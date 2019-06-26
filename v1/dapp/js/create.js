var abi = '';
var bin = '';

$(function () {
    $('.image-upload-wrap').bind('dragover', function () {
             $('.image-upload-wrap').addClass('image-dropping');
    });
    $('.image-upload-wrap').bind('dragleave', function () {
             $('.image-upload-wrap').removeClass('image-dropping');
    });

    getAbi();
    getBin();
});

var _default = {
    escrow: 600,    //600s, just for easy to develop now
}

var create = function () {
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            console.log(e);
        } else {
            var userAddress = address.toString();
            var title = $('#title').val();
            var desc = $('#desc').val();
            // var imageUrl = $('#imageUrl').val();
            var imageUrl = ($('#uploaded').attr("src") == undefined) ? "" : $('#uploaded').attr("src");
            var escrow = _default.escrow;
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

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $(".uploading-text").addClass("d-none");

  $('.image-upload-wrap').show();
}

$('#img-form').ajaxForm({
    beforeSubmit: function(){
        var imgname = $("#selected-img").val()
        var ext = imgname.substr( (imgname.lastIndexOf('.') +1) );
        var imgsize = $('#selected-img')[0].files[0].size / 1024 / 1024; // in MB
        console.log(ext, imgsize)
        if (ext=='jpg' || ext=='jpeg' || ext=='png' || ext=='gif' || ext=='PNG' || ext=='JPG' || ext=='JPEG'){
            if(imgsize <= 3){
                $(".uploading-text").removeClass("d-none");
                $(".drag-text").addClass("d-none");

                return true;
            }
        }
        
        $("#local-input").removeClass("d-none");
        tip.error(lgb["fail_to_upload"] || "Fail to upload. Please check your size and extension.");
        return false;
    },
    success: function(data) {
        url = data['secure_url']

        $(".uploading-text").addClass("d-none");
        $(".drag-text").removeClass("d-none");

        $('.image-upload-wrap').hide();
        $("#uploaded").attr("src", url)
        $('.file-upload-content').show();
        $('.image-title').html($("#selected-img").val());

        $("#img").val(url)
    }
}); 


function uploadPic(){
    console.log("upload")
    $(".image-upload-wrap").css("background-color","#999999")
    $(".image-upload-wrap").css('border','1px dashed #ffffff') 
    if($("#selected-img").val()){
           console.log("start")
          $("#submit").click()
    }
}

function changeBoxCSS(){
    console.log("changeBoxCSS")
 $(".image-upload-wrap").css('background-color','#999999')
 $(".image-upload-wrap").css('border','1px dashed #ffffff') 
 $(".image-upload-wrap").css('transition','.5s')
  setTimeout(function() {
    $(".image-upload-wrap").css('background-color','transparent') 
    $(".image-upload-wrap").css('border','1px dashed #999999') 

  }, 500);
}
