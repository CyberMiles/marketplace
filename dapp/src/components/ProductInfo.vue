<template>
<div>
    <input type="file" id="file" ref="myFiles" class="custom-file-input" accept="image/*" @change="previewFiles($event) " multiple>
    <div v-for="(image, key) in images" :key="image.key">
        <div>
            <img class="preview" v-bind:ref="'image' +parseInt( key )" /> 
            {{ image.name }}
        </div>
    </div>
    <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title" v-model="title">
    </div>
    <div class="form-group">
        <label for="desc">Description</label>
        <input type="text" class="form-control" id="desc" v-model="desc">
    </div>
    <div class="form-group">
        <label for="amount">Price (USD)</label>
        <input type="number" class="form-control" id="amount" v-model="amount">
    </div>
    <div class="form-group">
        <label for="tags">Tags</label>
        <input type="text" class="form-control" id="tags" v-model="tags">
    </div>
    <div class="form-group">
        <label for="contact">Contact Info</label>
        <input type="text" class="form-control" id="contact" v-model="contact">
    </div>
    <a href="#" class="create-btn" @click="createTrading">List</a>
</div>
</template>

<script>
import Contracts from '@/contracts.js';
import axios from 'axios';

export default {
    name: "ProductInfo",
    data() {
        return {
            title: "",
            desc: "",
            amount: 0,
            tags: "",
            contact: "",
            crc20: "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a",
            categories: "",
            escrowPeriod: 600,
            images: [],
            imageUrls: []
        }
    },
    methods: {
        previewFiles(e) {
            console.log(event.target.files);
            var selectedFiles = e.target.files;
            for (var i=0; i < selectedFiles.length; i++){
                this.images.push(selectedFiles[i]);
            }

            console.log(this.images)
            for (let i=0; i<this.images.length; i++){
                let reader = new FileReader(); //instantiate a new file reader
                var that = this
                reader.addEventListener('load', function(){
                    this.$refs['image' + parseInt( i )][0].src = reader.result;
                    axios.post("https://api.cloudinary.com/v1_1/dgvnn4efo/image/upload", {
                        "file": reader.result,
                        "name": this.images[i].name,
                        "upload_preset": "openbay",
                    })
                    .then(function (result) {
                        console.log(result)
                        that.imageUrls.push(result.data['secure_url'])
                    })
                }.bind(this), false);  //add event listener

                reader.readAsDataURL(this.images[i]);
              
            }
        },

        createTrading() {
            var that = this
            web3.cmt.getAccounts(function(e, addr) {
                if(e) {
                    console.log(e);
                } else {
                    var userAddress = addr.toString();
                    console.log(that.imageUrls.length, that.images.length)
                    //wait until the pics have been uploaded to the cloud
                    var checkUploadImg = function(){
                        if(that.imageUrls.length == that.images.length) {
                            var contract = web3.cmt.contract(Contracts.Listing.abi);
                            

                            var imageUrls = that.imageUrls.join(",")
                            console.log(imageUrls) 
                            
                            that.amount = parseInt(parseFloat(that.amount) * 100); // the OPB is 2 decimals

                            var data = '0x' + contract.new.getData(that.title, that.desc, that.tags, that.categories, imageUrls, that.contact, that.escrowPeriod, that.crc20, that.amount, {data: Contracts.Listing.bin});
                            contract.new([that.title, that.desc, that.tags, that.categories, imageUrls, that.contact, that.escrowPeriod, that.crc20, that.amount], {
                                from: userAddress,
                                data: data,
                                gas: '9999000',
                                gasPrice: 2000000000
                            }, function (e, instance) {
                                if (e) {
                                    console.log(e);
                                } else {
                                    console.log(instance.address);
                                    if (instance.address != undefined) {
                                        that.$router.push({path: `/listing/${instance.address}`})
                                        // window.location.href = "listing.html?contract=" + instance.address;
                                    } else {
                                        var filter = web3.cmt.filter("latest")
                                        filter.watch(function(error, blockhash){
                                            if (!error){
                                                var txhash = instance.transactionHash
                                                console.log(blockhash, txhash, instance)
                                                web3.cmt.getBlock(blockhash, function(e,r){
                                                    console.log(blockhash, txhash, r.transactions)
                                                    //The filter will watch when the state is changing. As the trasaction has been mined, the instance.address is still undefined. So we need to wait for .instance.address state changed.
                                                    if(instance.address != undefined && txhash.indexOf(r.transactions) != -1){
                                                        filter.stopWatching()
                                                        that.$router.push({path: `/listing/${instance.address}`})
                                                    }
                                                });
                                            }
                                        });

                                    }
                                }
                            });
                            
                        }
                        else setTimeout( checkUploadImg, 50 );
                    }
                    checkUploadImg(); //immediate first run 

          
                }
            })
        }
    },
};
</script>

