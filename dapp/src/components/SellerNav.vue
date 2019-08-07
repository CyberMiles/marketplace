<template>
  <div class="listing-info-nav">
    <div class="base-footer">
      <button class="link" v-if="status == 1" @click="unlist">
        Unlist
      </button>
      <button class="link" v-else-if="status == 0" @click="relist">
        Relist
      </button>
      <router-link
        class="action"
        :to="`/edit/${contractAddr}`"
        v-if="status == 0 || status == 1"
        >Edit</router-link
      >
      <button
        class="link gray"
        @click="reCreate"
        v-if="status != 0 && status != 1"
      >
        Relist a New One
      </button>
      <router-link
        class="action"
        :to="`/order/sell/${contractAddr}`"
        v-if="status != 0 && status != 1"
        >Order Status</router-link
      >
    </div>
  </div>
</template>
<script>
import { createHandler, relistHandler, unlistHandler } from "@/global.js";
import Global from "@/global.js";
import Contracts from "@/contracts.js";

export default {
  name: "SellerNav",
  props: {
    contractAddr: String,
    status: Number,
    instance: Object
  },
  methods: {
    relist() {
      relistHandler(this.instance);
    },
    unlist() {
      unlistHandler(this, this.instance);
    },
    reCreate() {
      var that = this;
      var instance = this.instance;
      instance.info(function(e, r) {
        if (!e) {
          instance.getPricesCount(function(e, pricesCount) {
            if (!e) {
              var newItem = {
                title: r[1],
                desc: r[2],
                tags: r[3],
                categories: "",
                imageUrls: r[6],
                contact: r[4],
                escrowPeriod: r[5],
                crc20: Global.USDaddr,
                amount: r[7],
                crc20_2: Global.USDaddr,
                amount_2: r[7]
              };
              var newContract = window.web3.cmt.contract(Contracts.Listing.abi);
              if (pricesCount == 1) {
                window.web3.cmt.getAccounts(function(e, addr) {
                  if (!e) {
                    var userAddress = addr.toString();
                    var bin = Contracts.Listing.bin;
                    createHandler(newContract, newItem, bin, userAddress, that);
                  }
                });
              } else {
                for (let i = 0; i < pricesCount; i++) {
                  instance.getPrice(i, function(e_price, r_price) {
                    if (!e_price) {
                      var token_crc20 = r_price[0].toString();
                      if (
                        token_crc20 ==
                        "0x0000000000000000000000000000000000000000"
                      ) {
                        newItem.crc20_2 = token_crc20;
                        newItem.amount_2 = r_price[1];
                        window.web3.cmt.getAccounts(function(e, addr) {
                          if (!e) {
                            var userAddress = addr.toString();
                            var bin = Contracts.Listing.bin;
                            createHandler(
                              newContract,
                              newItem,
                              bin,
                              userAddress,
                              that
                            );
                          }
                        });
                      }
                    }
                  });
                }
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.wide
  width 100% !important
.listing-info-nav
  box-shadow 0 -1px 0 0 #e5e5e5;
  position fixed
  bottom 0
  width 100vw
  .base-footer
    height (50/16)rem
    display flex
    .link
      display block
      padding 0
      border 0
      width 50%
      height (50/16)rem
      line-height (50/16)rem
      background-color #ffffff
      font-weight 500
      text-align center
      text-decoration none
      font-size (17/16)rem
      box-shadow 0 -0.5px 0 0 #e5e5e5
    .action
      display block
      padding 0
      border 0
      width 50%
      height (50/16)rem
      line-height (50/16)rem
      font-size (17/16)rem
      font-weight 500
      text-align center
      text-decoration none
      color #ffffff
      box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
      background-image linear-gradient(to left, #ff7777, #ff3f0f)
</style>
