<template>
  <div>
    <div class="create-info">
      <div class="form-group">
        <label for="title">Image #1</label>
        <input
          type="text"
          class="form-control"
          id="imageUrl01"
          v-model="imageUrl01"
        />
      </div>
      <div class="form-group">
        <label for="title">Image #2</label>
        <input
          type="text"
          class="form-control"
          id="imageUrl02"
          v-model="imageUrl02"
        />
      </div>
      <div class="form-group">
        <label for="title">Image #3</label>
        <input
          type="text"
          class="form-control"
          id="imageUrl03"
          v-model="imageUrl03"
        />
      </div>
      <div class="form-group">
        <label for="title">Image #4</label>
        <input
          type="text"
          class="form-control"
          id="imageUrl04"
          v-model="imageUrl04"
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
        <label for="tags">Tags(max. 5 tags)</label>
        <input
          type="text"
          class="form-control"
          id="tags"
          placeholder="Such as #rolex#watch"
          v-model="tags"
        />
        <small class="alert" v-if="invalidTags">
          Please enter tags starting with "#".
        </small>
        <small class="alert" v-if="maxTags">
          Maximum is 5 tags.
        </small>
      </div>
      <div class="form-group">
        <label for="desc">Description</label>
        <textarea
          rows="3"
          type="text"
          class="form-control"
          id="desc"
          placeholder="Please describe the destination countries and other important delivery info."
          v-model="desc"
        />
      </div>
      <div class="form-group">
        <p>Please set a price either in USD or in CMT</p>
        <label for="amount">Total USD Price(S&amp;H + tax included)</label>
        <div>
          <input
            type="number"
            class="form-control"
            id="amount"
            min="0.01"
            v-model="amount"
          />
          <div class="price-unit-container">
            <span class="price-unit">{{ USDunit }}</span>
          </div>
          <span class="price-tip">1 {{ USDunit }} ≈ 1 USD <a target="_blank" href="/withdraw-usdo-guide">how to exchange</a></span>
          <small class="alert" v-if="emptyPrice">
            Either the USD or CMT price must be set.
          </small>
        </div>
      </div>
      <div class="form-group">
        <label for="CMTamount">Or total CMT Price</label>
        <div>
          <input
            type="number"
            class="form-control"
            id="CMTamount"
            min="1"
            v-model="CMTamount"
          />
          <div class="price-unit-container">
            <span class="price-unit">CMT</span>
          </div>
          <span class="price-tip">Better privacy and anonymity</span>
          <small class="alert" v-if="emptyPrice">
            Either the USD or CMT price must be set.
          </small>
        </div>
      </div>
      <div class="form-group">
        <label for="contact">Contact Info</label>
        <textarea
          rows="4"
          type="text"
          class="form-control"
          autocorrect="off"
          autocapitalize="off"
          id="contact"
          placeholder="Leave your email(required) and/or other contact info like telegram The buyers will contact you with this info and send you the receiving address, etc."
          v-model="contact"
        />
        <small class="alert" v-if="contactIsEmpty">
          contact info cannot be empty
        </small>
      </div>
      <div v-if="edit">
        <a @click="$router.go(-1)" class="create-btn left-btn"
          ><span>Cancel</span></a
        >
        <a href="#" class="create-btn right-btn" @click="updateTrading"
          ><span>Update</span></a
        >
      </div>
      <div v-else>
        <a @click="$router.go(-1)" class="create-btn left-btn"
          ><span>Cancel</span></a
        >
        <a
          href="#"
          class="create-btn right-btn"
          @click="createTrading"
          v-bind:class="{ gray: notReady }"
          ><span>List</span></a
        >
      </div>
    </div>
    <ProcessingMask v-if="processing"></ProcessingMask>
  </div>
</template>

<script>
import Vue from "vue";
import Contracts from "@/contracts.js";
import ProcessingMask from "@/components/ProcessingMask.vue";
import axios from "axios";
import Global from "@/global.js";
import { createHandler, web3Callback, goDebug } from "@/global.js";
import Toast from "@/components/Toast.vue";

Vue.use(Toast);

export default {
  name: "ProductInfo2",
  data() {
    return {
      processing: false,
      title: "",
      desc: "",
      amount: null,
      CMTamount: null,
      tags: "",
      contact: "",
      crc20: Global.USDaddr,
      categories: "",
      escrowPeriod: Global.escrowPeriod,
      imageUrl01: "",
      imageUrl02: "",
      imageUrl03: "",
      imageUrl04: "",
      editModeInfo: {
        instance: null,
        userAddress: ""
      },
      contactIsEmpty: false,
      invalidTags: false,
      emptyPrice: false,
      emptyPics: false,
      maxTags: false
    };
  },
  props: ["edit", "contractAddr"],
  created() {
    this.initProductInfo2();
  },
  components: {
    ProcessingMask
  },
  methods: {
    initProductInfo2() {
      if (this.edit) {
        var contract_address = this.contractAddr;
        var that = this;
        //set timeout to check web3, because sometimes once mounted, the web3 hasn't been injected
        var checkWeb3 = function() {
          try {
            if (!window.web3.isAddress(contract_address)) {
              that.$router.push(`/`);
            }
            window.web3.cmt.getAccounts(function(e, address) {
              if (e) {
                goDebug({
                  callMethod: "getAccounts",
                  error: e
                });
              } else {
                var userAddress = address.toString();

                var contract = window.web3.cmt.contract(Contracts.Listing.abi);
                var instance = contract.at(contract_address);
                that.editModeInfo.instance = instance;
                that.editModeInfo.userAddress = userAddress;

                instance.info(function(e, r) {
                  if (e) {
                    goDebug({
                      callMethod: "instance.info",
                      error: e
                    });
                  } else {
                    console.log(r[3]);
                    that.title = r[1];
                    that.desc = r[2];
                    that.tags = r[3];
                    var imageUrls = r[6].split(",");
                    if (imageUrls.length > 0) that.imageUrl01 = imageUrls[0];
                    if (imageUrls.length > 1) that.imageUrl02 = imageUrls[1];
                    if (imageUrls.length > 2) that.imageUrl03 = imageUrls[2];
                    if (imageUrls.length > 3) that.imageUrl04 = imageUrls[3];
                    that.amount = (parseInt(r[7]) / 100).toString();
                    // seller: r[8].toString(),
                    that.contact = r[4];
                  }
                });
                instance.getPricesCount(function(e, pricesCount) {
                  if (e) {
                    goDebug({
                      callMethod: "instance.getPricesCount",
                      error: e
                    });
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
    updateTrading() {
      var that = this;
      if (this.contact.trim() == "") {
        this.contactIsEmpty = true;
        return;
      }

      var imageUrls = "";
      if (imageUrl01) {
          imageUrls = imageUrls + that.imageUrl01;
      }
      if (imageUrl02) {
          imageUrls = imageUrls + "," + that.imageUrl02;
      }
      if (imageUrl03) {
          imageUrls = imageUrls + "," + that.imageUrl03;
      }
      if (imageUrl04) {
          imageUrls = imageUrls + "," + that.imageUrl04;
      }
      // console.log(imageUrls);
      
      var amountAddr = "0x0000000000000000000000000000000000000000";
      var amount = 0;
      var amount2Addr = amountAddr;
      var amount2 = amount;
      if (that.amount > 0 && that.CMTamount > 0) {
        amountAddr = that.crc20;
        amount = parseInt(Math.round(parseFloat(that.amount) * 100)); // the OPB is 2 decimals. //Math.round() is to fix the problem: 19.99 * 100 = 1998.9999999999998
        amount2Addr = "0x0000000000000000000000000000000000000000";
        amount2 = window.web3.toWei(that.CMTamount);
      } else if (that.amount > 0) {
        amountAddr = that.crc20;
        amount = parseInt(Math.round(parseFloat(that.amount) * 100)); // the OPB is 2 decimals. //Math.round() is to fix the problem: 19.99 * 100 = 1998.9999999999998
        amount2Addr = amountAddr;
        amount2 = amount;
      } else if (that.CMTamount > 0) {
        amountAddr = "0x0000000000000000000000000000000000000000";
        amount = window.web3.toWei(that.CMTamount);
        amount2Addr = amountAddr;
        amount2 = amount;
      } else {
        that.emptyPrice = true;
        return;
      }
          
      that.editModeInfo.instance.updateListing(
        that.title,
        that.desc,
        that.tags,
        imageUrls,
        that.contact,
        amountAddr,
        amount,
        amount2Addr,
        amount2,
        "", //TODO: JSON_SHIPPING_COST. It should fetch from user input in the future.
        {
          gas: "99990000",
          gasPrice: 2000000000
        },
        function(e, txhash) {
          that.processing = true;
          var reloc = {
            router: that.$router,
            href: "/listing/" + that.contractAddr
          };
          web3Callback(e, txhash, reloc);
        }
      );
    },
    createTrading() {
      var that = this;
      if (this.imageUrl01.length == 0 && this.imageUrl02.length == 0 && this.imageUrl03.length == 0 && this.imageUrl04.length == 0) {
        this.emptyPics = true;
        return;
      }
      if (!(this.amount >0 || this.CMTamount >0)) {
        this.emptyPrice = true;
        return;
      }
      if (this.contact.trim() == "") {
        this.contactIsEmpty = true;
        return;
      }
      window.web3.cmt.getAccounts(function(e, addr) {
        if (e) {
          goDebug({
            callMethod: "getAccounts",
            error: e
          });
        } else {
          var userAddress = addr.toString();
          that.processing = true;

          var imageUrls = "";
          if (that.imageUrl01) {
              imageUrls = imageUrls + that.imageUrl01;
          }
          if (that.imageUrl02) {
              imageUrls = imageUrls + "," + that.imageUrl02;
          }
          if (that.imageUrl03) {
              imageUrls = imageUrls + "," + that.imageUrl03;
          }
          if (that.imageUrl04) {
              imageUrls = imageUrls + "," + that.imageUrl04;
          }
          
          var amountAddr = "0x0000000000000000000000000000000000000000";
          var amount = 0;
          var amount2Addr = amountAddr;
          var amount2 = amount;
          if (that.amount > 0 && that.CMTamount > 0) {
            amountAddr = that.crc20;
            amount = parseInt(Math.round(parseFloat(that.amount) * 100)); // the OPB is 2 decimals. //Math.round() is to fix the problem: 19.99 * 100 = 1998.9999999999998
            amount2Addr = "0x0000000000000000000000000000000000000000";
            amount2 = window.web3.toWei(that.CMTamount);
          } else if (that.amount > 0) {
            amountAddr = that.crc20;
            amount = parseInt(Math.round(parseFloat(that.amount) * 100)); // the OPB is 2 decimals. //Math.round() is to fix the problem: 19.99 * 100 = 1998.9999999999998
            amount2Addr = amountAddr;
            amount2 = amount;
          } else if (that.CMTamount > 0) {
            amountAddr = "0x0000000000000000000000000000000000000000";
            amount = window.web3.toWei(that.CMTamount);
            amount2Addr = amountAddr;
            amount2 = amount;
          } else {
            // validated before
            console.log("This is not supposed to happen");
            that.emptyPrice = true;
            return;
          }
          
          var newItem = {
            title: that.title,
            desc: that.desc,
            tags: that.tags,
            categories: that.categories,
            imageUrls: imageUrls,
            contact: that.contact,
            escrowPeriod: that.escrowPeriod,
            crc20: amountAddr,
            amount: amount,
            crc20_2: amount2Addr,
            amount_2: amount2
          };
          var newContract = window.web3.cmt.contract(Contracts.Listing.abi);
          var bin = Contracts.Listing.bin;
          createHandler(newContract, newItem, bin, userAddress, that);
        }
      });
    }
  },
  computed: {
    USDunit: function() {
      return Global.USDunit;
    }
  },
  watch: {
    tags: function() {
      if (this.tags.slice(0, 1) != "#") {
        this.tags = this.tags.slice(1);
        this.invalidTags = true;
      } else {
        this.invalidTags = false;
      }
      let tagArray = this.tags.split("#");
      let n = tagArray.length;
      if (n > 6) {
        this.tags = this.tags
          .split("#")
          .slice(0, 6)
          .join("#");
        this.maxTags = true;
      } else if (n <= 5) {
        this.maxTags = false;
      }
    },
    amount: function() {
      if (
        this.amount > 0 ||
        this.CMTamount > 0
      ) {
        this.emptyPrice = false;
      } else {
        this.emptyPrice = true;
      }
    },
    CMTamount: function() {
      if (
        this.amount > 0 ||
        this.CMTamount > 0
      ) {
        this.emptyPrice = false;
      } else {
        this.emptyPrice = true;
      }
    },
    contact: function() {
      if (this.contact === "") {
        this.contactIsEmpty = true;
      } else {
        this.contactIsEmpty = false;
      }
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
      display inline
      position relative
      top -(40/16)rem
      right (60/16)rem
    .preview-container
      margin (10/16)rem (10/16)rem (10/16)rem 0
      display inline-block
      .preview
        object-fit cover
        width (100/16)rem
        height (100/16)rem
        border-radius 8px
        display inline-block
      .delete
        position relative
        bottom (92/16)rem
        right (4/16)rem
    .alert
      color red
      padding (5/16)rem
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
    .price-tip
      position absolute
      font-size (11/16)rem
      right (25/16)rem
      color #999
      padding (5/16)rem
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
  .gray
    background #ccc !important
    box-shadow none !important
    color #fff
</style>
