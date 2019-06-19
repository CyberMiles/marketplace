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

var getInfo = function () {
    $('#info-panel').css("display", "block");
    $('#buy-panel').css("display", "none");
    $('#dispute-panel').css("display", "none");
    $('#resolve-panel').css("display", "none");
    $('#escrowed-panel').css("display", "none");
    $('#sold-panel').css("display", "none");
    $('#seller-panel').css("display", "none");

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
                    $('#escrow').text(r[3]);
                    var imagesCount = r[4];
                    var pricesCount = r[5];
                    ownerAddress = r[6].toString();
                    buyerAddress = r[7].toString();

                    $('#creator').text(ownerAddress);

                    if (status == 1) {
                        $('#buy-panel').css("display", "block");
                    } else if (status == 2) {
                        if (buyerAddress != userAddress) {
                            $('#escrowed-panel').css("display", "block");
                        }
                    } else if (status == 3) {
                        $('#sold-panel').css("display", "block");
                    }

                    if (userAddress == ownerAddress) {
                        if (status == 1 || status == 2) {
                            $('#seller-panel').css("display", "block");
                        }
                    }

                    instance.buyerInfo (function (be, br) {
                        if (be) {
                            console.log(be);
                        } else {
                            var dispute = br[3];
                            // TODO: Fill in seller panel
                            if (buyerAddress == userAddress && status == 2) {
                                // TODO: allow user to update info
                                if (dispute) {
                                    $('#resolve-panel').css("display", "block");
                                } else {
                                    $('#dispute-panel').css("display", "block");
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
                                $('#image-img').html('<img src="' + r_img + '" class="img-fluid img-thumbnail">');
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
                            }
                        }); // getPrice
                    }
                }
            }); // info
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

var addImage = function () {
    window.location = "addImage.html?contract=" + contract_address;
}

var setPrice = function () {
    window.location = "setPrice.html?contract=" + contract_address;
}

