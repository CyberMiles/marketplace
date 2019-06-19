var abi = '';
var bin = '';

$(function () {
    getAbi();
    getBin();
});

var create = function () {
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            console.log(e);
        } else {
            var userAddress = address.toString();
            var title = $('#title').val();
            var desc = $('#desc').val();
            var imageUrl = $('#imageUrl').val();
            var escrow = $('#escrow').val();
            var tags = $('#tags').val();
            var categories = $('#categories').val();
            var crc20 = "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a";
            var amount = parseInt(parseFloat($('#amount').val()) * 100); // the OPB is 2 decimals

            var contract = web3.cmt.contract(abi);
            var data = '0x' + contract.new.getData(title, desc, tags, categories, imageUrl, escrow, crc20, amount, {data: bin.object});

            contract.new([title, desc, imageUrl, escrow, crc20, amount], {
                from: userAddress.toString(),
                data: data,
                gas: '9999000',
                gasPrice: 2000000000
            }, function (e, instance) {
                if (e) {
                    console.log(e);
                } else {
                    console.log(instance.address);
                    if (instance.address != undefined) {
                        window.location.href = "listing.html?contract=" + instance.address;
                    } else {
                        var checkTransactionTimer = setInterval(function () {
                            web3.cmt.getTransactionReceipt(instance.transactionHash, function (error, result) {
                                if (!error) {
                                    if (result != null && result.status == '0x1') {
                                        clearInterval(checkTransactionTimer);
                                        if (result.contractAddress != undefined) {
                                            window.location.href = "listing.html?contract=" + result.contractAddress;
                                        } else if (result.address != undefined) {
                                            window.location.href = "listing.html?contract=" + result.address;
                                        } else {
                                            console.log("error here");
                                        }
                                    } 
                                }
                            })
                        }, 3000);
                    }
                }
            });
        }
    });
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
