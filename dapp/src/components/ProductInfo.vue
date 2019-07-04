<template>
  <div class="create-info">
    <label for="file">Image {{ uploadedImgs.length + images.length }}/4</label>
    <div class="form-group">
      <div class="uploaded-img-container" v-if="edit">
        <div
          v-for="url in uploadedImgs"
          :key="url.key"
          class="preview-container"
        >
          <img class="preview" v-bind:src="url" />
        </div>
      </div>
      <div
        v-for="(image, key) in images"
        :key="image.key"
        class="preview-container"
      >
        <img class="preview" v-bind:ref="'image' + parseInt(key)" />
      </div>
      <div
        v-if="uploadedImgs.length + images.length < 4"
        class="upload-container"
        @click="$refs.myFiles.click()"
      >
        <input
          type="file"
          id="file"
          ref="myFiles"
          class="custom-file-input"
          accept="image/*"
          @change="previewFiles($event)"
          multiple
        />
      </div>
      <img
        v-if="uploadedImgs.length + images.length < 4"
        src="../assets/imgs/plus.svg"
        @click="$refs.myFiles.click()"
        class="plus-btn"
      />
    </div>
    <div class="form-group">
      <label for="title">Name</label>
      <input
        type="text"
        class="form-control"
        id="title"
        placeholder="What are you selling"
        v-model="title"
      />
    </div>
    <div class="form-group">
      <label for="tags">Tags</label>
      <input
        type="text"
        class="form-control"
        id="tags"
        placeholder="Such as BTC; Space out"
        v-model="tags"
      />
    </div>
    <div class="form-group">
      <label for="desc">Description</label>
      <textarea
        rows="3"
        type="text"
        class="form-control"
        id="desc"
        placeholder="Describe your product in as much detail as possible"
        v-model="desc"
      />
    </div>
    <div class="form-group">
      <label for="amount">Price</label>
      <div>
        <input
          type="number"
          class="form-control"
          id="amount"
          min="0.01"
          v-model="amount"
        />
        <div class="price-unit-container">
          <span class="price-unit">USD</span>
        </div>
      </div>
    </div>
    <div class="form-group" v-if="edit">
      <label for="CMTamount">Price2(optional)</label>
      <div>
        <input
          type="number"
          class="form-control"
          id="CMTamount"
          min="0.01"
          v-model="CMTamount"
        />
        <div class="price-unit-container">
          <span class="price-unit">CMT</span>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label for="contact">Contact Info</label>
      <input
        type="text"
        class="form-control"
        id="contact"
        placeholder="Email. Buyer contacts you."
        v-model="contact"
      />
    </div>
    <div v-if="edit">
      <a @click="$router.go(-1)" class="create-btn left-btn"
        ><span>Cancel</span></a
      >
      <a href="#" class="create-btn right-btn" @click="updateTrading"
        ><span>Update</span></a
      >
    </div>
    <a href="#" class="create-btn" @click="createTrading" v-else
      ><span>List</span></a
    >
  </div>
</template>

<script>
import Contracts from "@/contracts.js";
import axios from "axios";

export default {
  name: "ProductInfo",
  data() {
    return {
      title: "",
      desc: "",
      amount: 10,
      CMTamount: null,
      tags: "",
      contact: "",
      crc20: "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a",
      categories: "",
      escrowPeriod: 600,
      images: [],
      imageUrls: [],
      uploadedImgs: [],
      editModeInfo: {
        instance: null,
        userAddress: ""
      }
    };
  },
  props: ["edit", "contractAddr"],
  mounted() {
    this.initProductInfo();
  },
  methods: {
    initProductInfo() {
      if (this.edit) {
        var contract_address = this.contractAddr;
        var that = this;
        //set timeout to check web3, because sometimes once mounted, the web3 hasn't been injected
        var checkWeb3 = function() {
          try {
            window.web3.cmt.getAccounts(function(e, address) {
              if (e) {
                console.log(e);
              } else {
                var userAddress = address.toString();

                var contract = window.web3.cmt.contract(Contracts.Listing.abi);
                var instance = contract.at(contract_address);
                that.editModeInfo.instance = instance;
                that.editModeInfo.userAddress = userAddress;

                instance.info(function(e, r) {
                  if (e) {
                    console.log(e);
                  } else {
                    console.log(r[3]);
                    that.title = r[1];
                    that.desc = r[2];
                    that.tags = r[3];
                    that.uploadedImgs = r[6].split(",");
                    that.amount = (parseInt(r[7]) / 100).toString();
                    // seller: r[8].toString(),
                    that.contact = r[4];
                  }
                });
                instance.getPricesCount(function(e, pricesCount) {
                  if (e) {
                    console.log(e);
                  } else {
                    for (let i = 0; i < pricesCount; i++) {
                      instance.getPrice(i, function(e_price, r_price) {
                        if (e_price) {
                          console.log(e_price);
                        } else {
                          var token_crc20 = r_price[0].toString();
                          if (
                            token_crc20 ==
                            "0x0000000000000000000000000000000000000000"
                          ) {
                            that.CMTamount = window.web3.fromWei(r_price[1]);
                          }
                        }
                      });
                    }
                  }
                });
              }
            });
          } catch (e) {
            setTimeout(checkWeb3, 50);
          }
        };
        checkWeb3(); //immediate first run
      }
    },
    previewFiles(e) {
      console.log(event.target.files);
      var selectedFiles = e.target.files;
      if (
        this.uploadedImgs.length + this.images.length + selectedFiles.length >
        4
      ) {
        this.$swal({
          html: "You are only allowed to upload a maximum of 4 files.",
          width: "90%"
        });
        return;
      }
      for (var i = 0; i < selectedFiles.length; i++) {
        this.images.push(selectedFiles[i]);
      }

      console.log(this.images);
      for (let i = 0; i < this.images.length; i++) {
        let reader = new FileReader(); //instantiate a new file reader
        var that = this;
        reader.addEventListener(
          "load",
          function() {
            this.$refs["image" + parseInt(i)][0].src = reader.result;
            axios
              .post("https://api.cloudinary.com/v1_1/dgvnn4efo/image/upload", {
                file: reader.result,
                name: this.images[i].name,
                upload_preset: "marketplace"
              })
              .then(function(result) {
                console.log(result);
                that.imageUrls.push(result.data["secure_url"]);
              });
          }.bind(this),
          false
        ); //add event listener
        reader.readAsDataURL(this.images[i]);
      }
    },

    updateTrading() {
      var that = this;
      console.log(that.imageUrls.length, that.images.length);
      //wait until the pics have been uploaded to the cloud
      var checkUploadImg = function() {
        if (that.imageUrls.length == that.images.length) {
          var imageUrls = that.uploadedImgs.concat(that.imageUrls).join(",");
          console.log(imageUrls);
          var amount2Addr = that.crc20;
          var amount2 = parseInt(parseFloat(that.amount) * 100); // the OPB is 2 decimals,
          if (that.CMTamount > 0) {
            amount2Addr = "0x0000000000000000000000000000000000000000";
            amount2 = window.web3.toWei(that.CMTamount);
          }
          console.log(that.CMTamount, amount2Addr, parseInt(amount2));
          that.editModeInfo.instance.updateListing(
            that.title,
            that.desc,
            that.tags,
            imageUrls,
            that.contact,
            that.crc20,
            parseInt(parseFloat(that.amount) * 100), // the OPB is 2 decimals,
            amount2Addr,
            parseInt(amount2),
            {
              gas: "400000",
              gasPrice: 0
            },
            function(e, txhash) {
              if (e) {
                console.log(e);
              } else {
                var filter = window.web3.cmt.filter("latest");
                filter.watch(function(error, blockhash) {
                  if (!error) {
                    console.log(blockhash, txhash);
                    window.web3.cmt.getBlock(blockhash, function(e, r) {
                      console.log(blockhash, txhash, r.transactions);
                      if (r.transactions.indexOf(txhash) != -1) {
                        filter.stopWatching();
                        console.log("stop and redirect");
                        that.$router.push("/listing/" + that.contractAddr);
                      }
                    });
                  }
                });
              }
            }
          );
        } else setTimeout(checkUploadImg, 50);
      };
      checkUploadImg(); //immediate first run
    },
    createTrading() {
      var that = this;
      window.web3.cmt.getAccounts(function(e, addr) {
        if (e) {
          console.log(e);
        } else {
          var userAddress = addr.toString();
          console.log(that.imageUrls.length, that.images.length);
          //wait until the pics have been uploaded to the cloud
          var checkUploadImg = function() {
            if (that.imageUrls.length == that.images.length) {
              var contract = window.web3.cmt.contract(Contracts.Listing.abi);
              var imageUrls = that.imageUrls.join(",");
              console.log(imageUrls);
              var data =
                "0x" +
                contract.new.getData(
                  that.title,
                  that.desc,
                  that.tags,
                  that.categories,
                  imageUrls,
                  that.contact,
                  that.escrowPeriod,
                  that.crc20,
                  parseInt(parseFloat(that.amount) * 100), // the OPB is 2 decimals,
                  { data: Contracts.Listing.bin }
                );
              contract.new(
                [
                  that.title,
                  that.desc,
                  that.tags,
                  that.categories,
                  imageUrls,
                  that.contact,
                  that.escrowPeriod,
                  that.crc20,
                  that.amount
                ],
                {
                  from: userAddress,
                  data: data,
                  gas: "9999000",
                  gasPrice: 2000000000
                },
                function(e, instance) {
                  if (e) {
                    console.log(e);
                  } else {
                    var filter = window.web3.cmt.filter("latest");
                    var confirmed = false;
                    filter.watch(function(error, blockhash) {
                      if (!error) {
                        var txhash = instance.transactionHash;
                        console.log(blockhash, txhash, instance);
                        window.web3.cmt.getBlock(blockhash, function(e, r) {
                          if (r.transactions.indexOf(txhash) != -1) {
                            confirmed = true;
                          }
                          // console.log(confirmed, blockhash, txhash, r.transactions);
                          //The filter will watch when the state is changing. As the trasaction has been mined, the instance.address is still undefined. So we need to wait for .instance.address state changed.
                          if (instance.address != undefined && confirmed) {
                            filter.stopWatching();
                            console.log("stop and redirect"); //???
                            that.$router.push({
                              path: `/listing/${instance.address}`
                            });
                          }
                        });
                      }
                    });
                  }
                }
              );
            } else setTimeout(checkUploadImg, 50);
          };
          checkUploadImg(); //immediate first run
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.create-info
  padding (20/16)rem (15/16)rem (60/16)rem
  .form-group
    padding 0 0 (20/16)rem
    label
      font-size (15/16)rem
    .uploaded-img-container
      display inline-block
    .upload-container
      margin-top (10/16)rem
      width (100/16)rem
      height (100/16)rem
      border-radius 8px
      background-color #f0f0f0
      display inline-block
      position relative
      #file
        display none
    .plus-btn
      position relative
      top -(40/16)rem
      right (60/16)rem
    .preview-container
      margin (10/16)rem (10/16)rem (10/16)rem 0
      display inline-block
      .preview
        width (100/16)rem
        height (100/16)rem
        border-radius 8px
        display inline-block
    input
      width 100%
      padding 0 (10/16)rem
      height (40/16)rem
      line-height (38/16)rem
      border-radius (4/16)rem
      border solid 0.5px #e5e5e5
      background-color #ffffff
      margin (10/16)rem 0 0 0
    textarea
      width 100%
      padding (10/16)rem
      line-height (22/16)rem
      border-radius (4/16)rem
      border solid 0.5px #e5e5e5
      background-color #ffffff
      margin (10/16)rem 0 0 0
    .price-unit-container
      position relative
      top -(28/16)rem
      .price-unit
        position absolute
        right (25/16)rem
  .create-btn
    display flex
    border-radius 4px;
    box-shadow 0 0 7px 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    height (44/16)rem
    text-decoration none
    align-items center
    justify-content center
    span
      font-size (17/16)rem
      color #ffffff
  .right-btn
    width 45%
    float right
    display inline-flex
  .left-btn
    width 45%
    display inline-flex
</style>
