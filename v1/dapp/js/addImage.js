var getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const contract_address = getUrlParameter("contract");
const imagesCount = getUrlParameter("imagesCount");
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
});

var addImage = function () {

    contract = web3.cmt.contract(abi);
    instance = contract.at(contract_address);

    var i = 0;
    imageUrl = $("#imageUrl").val()
    instance.addImage(imageUrl, function(e, r){
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location = "listing.html?contract=" + contract_address;
            }, 20 * 1000);
        }
    })
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
