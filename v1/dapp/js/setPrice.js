var getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const contract_address = getUrlParameter("contract");
var userAddress = '';
var ownerAddress = '';
var abi = '';
var abi_crc20 = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance

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

    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            console.log(e);
        } else {
            userAddress = address.toString();

            contract = web3.cmt.contract(abi);
            instance = contract.at(contract_address);

            instance.getPricesCount (function (e, r) {
                if (e) {
                    console.log(e);
                    return;
                } else {
                    var i = 0;
                    for (i = 0; i < r; i++) {
                        instance.getPrice (i, function (e_price, r_price) {
                            if (e_price) {
                                console.log(e_price);
                            } else {
                                var token_name = "Unknown";
                                var token_crc20 = r_price[0].toString();
                                var amount = r_price[1];
                                var token_amount = "";

                                if (token_crc20 == "0x0000000000000000000000000000000000000000") {
                                    token_name = "CMT";
                                    token_amount = web3.fromWei(amount);
                                } else if (token_crc20 == "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a") {
                                    token_name = "OPB";
                                    token_amount = (parseInt(amount) / 100).toString();
                                }
                                $('#prices-tbody').append("<tr><td>" + token_name + "</td><td>" + token_amount + "</td></tr>");  
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

var setPrice = function () {
    var crc20 = $("#crc20-select").val();
    var token_amount = $('#amount').val();
    var amount = "";

    if (crc20 == "0x0000000000000000000000000000000000000000") {
        amount = web3.toWei(token_amount);
    } else if (crc20 == "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a") {
        amount = parseInt(parseFloat(token_amount) * 100);
    }

    instance.setPrice (crc20, amount, {
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location = "listing.html?contract=" + contract_address;
            }, 20 * 1000);
        }
    });
}
