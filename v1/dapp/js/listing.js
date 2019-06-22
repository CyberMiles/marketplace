var getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const contract_address = getUrlParameter("contract");
var userAddress = '';
var ownerAddress = '';
var buyerAddress = '';
var abi = '';
var abi_crc20 = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance
var tokens = {};
var imagesCount = '';

$(function () {
    getAbi();
    getBin();

    var interval = setInterval(function () {
        if (abi.length > 0) {
            getInfo();
            clearInterval(interval);
        }
    }, 50);
});

var initBuyer = (buyerPanel, buyer) => {
    // buyerPanel.removeClass("d-none").find("input,textarea,select").attr("disabled", true)
    // buyerPanel.find("#name-field").val(buyer.name)
    // buyerPanel.find("#mesg-field").val(buyer.msg)
    // var cc = buyer.contact.split(":");
    // buyerPanel.find('#contact-app-field').val(cc[0].trim());
    // buyerPanel.find('#contact-id-field').val(cc[1].trim());

    // buyerPanel.find('h3').text("Buyer Infomation")
    // buyerPanel.find('label').hide()
    // buyerPanel.find('#buy-submit').hide()

    //TODO price setting
    buyerInfoStr = "addr: " + buyer.addr + "<br>" + 
                   "name: " + buyer.name + "<br>" +
                   "remark: " + buyer.msg  + "<br>" +
                   "payment date: " + new Date(buyer.boughtTime*1000) + "<br>" +
                   "contact: " + buyer.contact + "<br>"
    $(".buyer-info").append(buyerInfoStr)

}

var getInfo = function () {
    $('#info-panel').css("display", "block");

    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            console.log(e);
        } else {
            userAddress = address.toString();

            contract = web3.cmt.contract(abi);
            instance = contract.at(contract_address);

            instance.info (function (e, r) {
                if (e) {
                    console.log(e);
                } else {
                    var status = r[0];
                    $('#title-div').text(r[1]);
                    $('#desc-panel').text(r[2]);
                    var escrowDuration = r[3];
                    $('#escrow').text(escrowDuration);
                    imagesCount = r[4];
                    var pricesCount = r[5];
                    ownerAddress = r[6].toString();
                    buyerAddress = r[7].toString();


                    $('#creator').text(ownerAddress);
                    console.log("current status:", status)
                    if (status == 0) {//unlisting
                        if(userAddress == ownerAddress){
                            //1. edit
                            //2. relist
                            $(".d-seller.d-unlisting").removeClass("d-none")
                        }else{
                            $(".d-other.d-unlisting").removeClass("d-none")
                        }
                    }else if (status == 1) {//open to buy
                        if(userAddress == ownerAddress){
                            //1. edit
                            //2. unlist
                            //3. buy?
                            $('.d-seller.d-open').removeClass("d-none")
                        }else{
                            $('.d-other.d-open').removeClass("d-none")
                        }
                    } else if (status == 2) {//buyer in escrow
                        if (buyerAddress != userAddress && userAddress != ownerAddress) {
                            $('.d-other.d-escrow').removeClass('d-none');
                        }
                        //other cases dealt in "instance.buyerInfo"
                    } else if (status == 3) {
                        if (userAddress != buyerAddress && userAddress != ownerAddress) {
                            $(".d-other.d-closed.d-closed-sold").removeClass('d-none')
                        }
                        //other cases dealt in "instance.buyerInfo"
                    }

                    instance.buyerInfo (function (be, br) {
                        if (be) {
                            console.log(be);
                        } else {
                            var buyer = {
                                addr: br[0],
                                boughtTime: br[1],
                                name: br[5],
                                contact: br[6],
                                msg: br[7],
                            }
                            var dispute = br[3];
                            //check if time is up to receive
                            var expiredTime = parseInt(br[1]) + parseInt(escrowDuration)
                            if (expiredTime.toString().length == 10) {
                                var expiredDate = new Date(expiredTime * 1000);
                            } else if (expiredTime.toString().length == 13) {
                                var expiredDate = new Date(expiredTime);
                            }
                            var currentDate = new Date()
                            console.log(expiredDate)
                            currentDate > expiredDate ? escrowDone = true : escrowDone = false
                            if (status == 2) {
                                //init the buyer info panel
                                if (userAddress == ownerAddress) {
                                    initBuyer($("#buy-panel"), buyer)
                                    if(dispute){
                                        $(".d-seller.d-escrow.d-escrow-disputing").removeClass('d-none')                                    
                                    }else{
                                        if(escrowDone){
                                            $(".d-seller.d-escrow.d-escrow-done").removeClass('d-none')
                                        }else{
                                            $(".d-seller.d-escrow.d-escrow-going").removeClass('d-none')
                                        }     
                                    }
                                   
                                }
                                if (userAddress == buyerAddress) {
                                    initBuyer($("#buy-panel"), buyer)
                                    // TODO: allow user to update info(when?)
                                    if (dispute) {
                                        $(".d-buyer.d-escrow.d-escrow-disputing").removeClass('d-none')                                    
                                    } else {
                                        if(escrowDone){
                                            $(".d-buyer.d-escrow.d-escrow-done").removeClass('d-none')
                                        }else{
                                            $(".d-buyer.d-escrow.d-escrow-going").removeClass('d-none')
                                        }
                                    }
                                }
                            }
                            
                            // soldTime = br[2]; //sold time (if the state is closed because of "resolve" , the sold time should be 0)
                            // soldTime == 0 ? resolved = true : resolved = false
                            if (userAddress == ownerAddress && status == 3) {
                                $(".d-seller.d-closed.d-closed-sold").removeClass("d-none")
                            }   
                            if (userAddress == buyerAddress && status == 3) {
                                $(".d-buyer.d-closed.d-closed-sold").removeClass("d-none")
                            }         
                        }
                    });

                    var i = 0;
                    for (i = 0; i < imagesCount; i++) {
                        instance.getImage (i, function (e_img, r_img) {
                            if (e_img) {
                                console.log(e_img);
                            } else {
                                $('#image-img').append('<img src="' + r_img + '" class="img-fluid img-thumbnail">');
                            }
                        }); // getImage
                    }

                    var price_options = "";
                    for (i = 0; i < pricesCount; i++) {
                        instance.getPrice (i, function (e_price, r_price) {
                            if (e_price) {
                                console.log(e_price);
                            } else {
                                var token_name = "Unknown";
                                var token_crc20 = r_price[0].toString();
                                tokens[token_crc20] = r_price[1];
                                var token_amount = "";
                                if (token_crc20 == "0x0000000000000000000000000000000000000000") {
                                    token_name = "CMT";
                                    token_amount = web3.fromWei(tokens[token_crc20]);
                                } else if (token_crc20 == "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a") {
                                    token_name = "OPB";
                                    token_amount = (parseInt(tokens[token_crc20]) / 100).toString();
                                }
                                $('#prices-select').append($("<option></option>").attr("value",token_crc20).text(token_amount + " " + token_name));  
                                $("#price-desc").append("<div>" + token_amount + " " + token_name + "</div>")
                            }
                        }); // getPrice
                    }
                }
            }); // info
            instance.getSellerMesg(function(e,r){
                console.log(r!="")
                if(r != "" && (userAddress == ownerAddress || userAddress == buyerAddress)){
                    $('.seller-mesg').text(r)
                }else{
                    $('#seller-mesg-text').detach()
                }
            });//sellerMesg
        }
    }); // getAccounts
}

var getAbi = function () {
    $.ajax({
        url: 'Listing.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
        }
    });
    $.ajax({
        url: 'ERC20.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi_crc20 = JSON.parse(data);
        }
    });
}

var getBin = function () {
    $.ajax({
        url: 'Listing.bin',
        dataType: 'text',
        sync: true,
        success: function (data) {
            bin = JSON.parse(data);
        }
    });
}

var buy = function () {
        var contactApp = $("#contact-app-field").val();
        var contactId = $("#contact-id-field").val();
        var contact = contactApp + ": " + contactId;
        var name = $("#name-field").val();
        var mesg = $("#mesg-field").val();

        var crc20 = $("#prices-select").val();
        if (crc20 == "0x0000000000000000000000000000000000000000") {
            instance.buyWithCMT(name, contact, mesg, {
                gas: '200000',
                gasPrice: 0,
                value: tokens[crc20]
            }, function (e, result) {
                if (e) {
                    if(e.message.includes('User denied transaction signature.') ){
                        window.location.reload(true);
                    } else {
                        window.location.reload(true);
                    }
                } else {
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 20 * 1000);
                }
            }); // buyWithCMT
        } else {
            var contract_crc20 = web3.cmt.contract(abi_crc20);
            var instance_crc20 = contract_crc20.at(crc20);
            instance_crc20.approve(contract_address, parseInt(tokens[crc20]), {
                gas: '200000',
                gasPrice: 0
            }, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    instance.buyWithCRC20(crc20, name, contact, mesg, {
                        gas: '400000',
                        gasPrice: 0
                    }, function (e, r) {
                        if (e) {
                            console.log(error);
                        } else {
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 20 * 1000);
                        }
                    }); // buyWithCRC20
                }
            }); // approve
        }
}

var closeBySeller = function () {
    instance.closeBySeller ({
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}

var closeByBuyer = function () {
    instance.closeByBuyer ({
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}

var refund = function () {
    instance.refund ({
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}

var resolve = function () {
    instance.resolve ({
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}

var dispute = function () {
    instance.dispute ("TODO: add reason from UI", {
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}

var unlist = function () {
    instance.pause ({
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}

var relist = function() {
    instance.resume ({
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}

var setSellerMesg = function (mesg) {
    instance.setSellerMesg ( mesg, {
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });   
}

var addImage = function () {
    window.location = "addImage.html?contract=" + contract_address + "&imagesCount=" + imagesCount;
}

var setPrice = function () {
    window.location = "setPrice.html?contract=" + contract_address;
}


