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
    var checkABIandGetInfo = function(){
      if( abi.length > 0 && web3 != undefined) {
        console.log("getInfo")
            getInfo();
      }
        else setTimeout( checkABIandGetInfo, 50 );
    }
    checkABIandGetInfo(); //immediate first run 

});

var initBuyer = (buyer) => {

    updatePanel = $("#update-buyer-panel")
    updatePanel.find("#update-name-field").val(buyer.name)
    updatePanel.find("#update-mesg-field").val(buyer.msg)
    var cc = buyer.contact.split(":");
    if(cc.length == 2){
        updatePanel.find('#update-contact-app-field').val(cc[0].trim());
        updatePanel.find('#update-contact-id-field').val(cc[1].trim())
    }
    buyerInfoStr = "addr: " + buyer.addr + "<br>" + 
                   "name: " + buyer.name + "<br>" +
                   "remark: " + buyer.msg  + "<br>" +
                   "payment date: " + new Date(buyer.boughtTime*1000) + "<br>" +
                   "contact: " + buyer.contact + "<br>" + 
                   "token name: " + buyer.token_name + "<br>" +
                   "token amount: " + buyer.token_amount
    $(".buyer-info").append(buyerInfoStr)

}

var initTags = (tags) => {
    tagsArr = tags.split(",")
    $.each(tagsArr, function(idx, tag){
        console.log(tag.trim())
        $('#tags').append("<li>" + tag.trim() + "</li>")

    })

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
                    const tradingInfo = {
                        status: r[0],
                        title: r[1],
                        desc: r[2],
                        tags: r[3],
                        categories: r[4],
                        escrowDuration: r[5],
                        imagesCount: r[6],
                        pricesCount: r[7],
                        ownerAddress: r[8].toString(),
                        buyerAddress: r[9].toString(),
                    }

                    var status = tradingInfo.status;
                    $('#title-div').text(tradingInfo.title);
                    $('#desc-panel').text(tradingInfo.desc);
                    $('#escrow').text(tradingInfo.escrowDuration);
                    initTags(tradingInfo.tags)
                    $("#categories").text(tradingInfo.categories)
                    imagesCount = tradingInfo.imagesCount;
                    ownerAddress = tradingInfo.ownerAddress;
                    buyerAddress = tradingInfo.buyerAddress;


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
                            $('.d-seller.d-open').removeClass("d-none")
                        }else{
                            $('.d-other.d-open').removeClass("d-none")
                        }
                    } else if (status == 2) {//buyer locked
                        if (userAddress != buyerAddress && userAddress != ownerAddress) {
                            $('.d-other.d-escrow').removeClass('d-none');
                        }
                        //other cases dealt in "instance.buyerInfo"
                    } else if (status == 3 || status == 4 || status == 5) {
                        if (userAddress != buyerAddress && userAddress != ownerAddress) {
                            $(".d-other.d-closed.d-closed-sold").removeClass('d-none') //for others, all is sold
                        }
                        //other cases dealt in "instance.buyerInfo"
                    } 

                    instance.buyerInfo (function (be, br) {
                        if (be) {
                            console.log(be);
                        } else {
                            if(br[0] != "0x0000000000000000000000000000000000000000"){
                                token_crc20 = br[8]
                                if (token_crc20 == "0x0000000000000000000000000000000000000000") {
                                    token_name = "CMT";
                                    token_amount = web3.fromWei(br[9]);
                                } else if (token_crc20 == "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a") {
                                    token_name = "OPB";
                                    token_amount = (parseInt(br[9]) / 100).toString();
                                }

                                var buyer = {
                                    addr: br[0],
                                    boughtTime: br[1],
                                    dispute: br[3],
                                    name: br[5],
                                    contact: br[6],
                                    msg: br[7],
                                    token_name: token_name,
                                    token_amount: token_amount,
                                }
                                //check if time is up to receive
                                var expiredTime = parseInt(buyer.boughtTime) + parseInt(tradingInfo.escrowDuration)
                                if (expiredTime.toString().length == 10) {
                                    var expiredDate = new Date(expiredTime * 1000);
                                } else if (expiredTime.toString().length == 13) {
                                    var expiredDate = new Date(expiredTime);
                                }
                                var currentDate = new Date()
                                console.log(expiredDate)
                                currentDate > expiredDate ? escrowDone = true : escrowDone = false
                                initBuyer(buyer)
                                
                                if (status == 2) {
                                    //init the buyer info panel
                                    if (userAddress == ownerAddress) {
                                        if(escrowDone){
                                            $(".d-seller.d-escrow.d-escrow-done").removeClass('d-none')
                                        }else{
                                            $(".d-seller.d-escrow.d-escrow-going").removeClass('d-none')
                                        }     
                                       
                                    }
                                    if (userAddress == buyerAddress) {
                                        // TODO: allow user to update info(when?)
                                        if(escrowDone){
                                            $(".d-buyer.d-escrow.d-escrow-done").removeClass('d-none')
                                        }else{
                                            $(".d-buyer.d-escrow.d-escrow-going").removeClass('d-none')
                                        }
                                    }
                                } else if (status == 3){

                                    if(userAddress == ownerAddress) {
                                        $(".d-seller.d-disputing").removeClass("d-none")
                                    }
                                    if(userAddress == buyerAddress){
                                        $(".d-buyer.d-disputing").removeClass("d-none")
                                    }
                                } else if (status == 4 || status == 5){
                                    instance.secondaryBuyerInfo(function(e, other_br){
                                        refundedReason = other_br[0]
                                        closedReason = other_br[1]
                                        if (status == 4) {
                                            if (buyer.dispute) {
                                                if (closedReason == 2) { // resolve by buyer
                                                    if (userAddress == ownerAddress) {
                                                        $(".d-seller.d-closed.d-closed-resolve-disputed").removeClass("d-none")
                                                    }
                                                    if (userAddress == buyerAddress) {
                                                        $(".d-buyer.d-closed.d-closed-resolve-disputed").removeClass("d-none")
                                                    }
                                                } else if (closedReason == 1) { // resolve by DAO

                                                }
                                                
                                            }else{
                                                if (userAddress == ownerAddress) {
                                                    $(".d-seller.d-closed.d-closed-sold").removeClass("d-none")
                                                }   
                                                if (userAddress == buyerAddress) {
                                                    $(".d-buyer.d-closed.d-closed-sold").removeClass("d-none")
                                                }    
                                            }
                                            
                                        }else if (status == 5) {
                                            if(buyer.dispute){
                                                if (closedReason == 0) {
                                                    //refund by buyer
                                                     if (userAddress == ownerAddress) {
                                                        $(".d-seller.d-closed-buyer.d-closed-refund-disputed").removeClass("d-none")
                                                    }
                                                    if (userAddress == buyerAddress) {
                                                        $(".d-buyer.d-closed-buyer.d-closed-refund-disputed").removeClass("d-none")
                                                    }
                                                } else if (closedReason == 1) {
                                                    //resolve by DAO
                                                }
                                            }else{
                                                //only buyerlocked state to buyerrefunded (refunded by buyer)
                                                if(userAddress == ownerAddress) {
                                                    console.log("refund")
                                                    $(".d-seller.d-closed-buyer.d-closed-refund-direct").removeClass("d-none")
                                                }
                                                if(userAddress == buyerAddress){
                                                    $(".d-buyer.d-closed-buyer.d-closed-refund-direct").removeClass("d-none")
                                                }
                                            }
                                            
                                        }
                                        
                                        
                                    })
                                    
                                }     
                            }
                                 
                        }
                    });

                    var i = 0;
                    for (i = 0; i < imagesCount; i++) {
                        instance.getImage (i, function (e_img, r_img) {
                            if (e_img) {
                                console.log(e_img);
                            } else {
                                imgSrc = r_img.split("upload/").join("upload/q_auto/")
                                $('#image-img').append('<img src="' + imgSrc + '" class="img-fluid img-thumbnail">');
                            }
                        }); // getImage
                    }

                    var price_options = "";
                    for (i = 0; i < tradingInfo.pricesCount; i++) {
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
                gas: '400000',
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

var updateBuyerInfo = () => {
    var contactApp = $("#update-contact-app-field").val();
    var contactId = $("#update-contact-id-field").val();
    var contact = contactApp + ": " + contactId;
    var name = $("#update-name-field").val();
    var mesg = $("#update-mesg-field").val();
    console.log(name, contact, mesg)
    instance.updateBuyer(name, contact, mesg, {
        gas: '400000',
        gasPrice: 0
    }, function(e, result){
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }  
    })
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

var updateListing = function () {
    var newTitle = $("#update-title").val()
    var newDesc = $("#update-desc").val()
    var newEscrow = $("#update-escrow-time").val()
    var newTags = $("#update-tags").val()
    instance.updateListing (newTitle, newDesc, newTags, "", newEscrow, {
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
    })
}

var addImage = function () {
    window.location = "addImage.html?contract=" + contract_address + "&imagesCount=" + imagesCount;
}

var setPrice = function () {
    window.location = "setPrice.html?contract=" + contract_address;
}


