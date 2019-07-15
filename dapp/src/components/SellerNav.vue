<template>
  <div class="listing-info-nav">
    <div class="base-footer">
      <button class="link" v-if="status == 1" @click="unlistHandler">
        Unlist
      </button>
      <button class="link" v-else-if="status == 0" @click="relistHandler">
        Relist
      </button>
      <router-link
        class="action"
        :to="`/edit/${contractAddr}`"
        v-if="status == 0 || status == 1"
        >Edit</router-link
      >
      <button
        class="link gray wide"
        @click="reCreate"
        v-if="status != 0 && status != 1"
      >
        Relist a New One
      </button>
    </div>
  </div>
</template>
<script>
import { createHandler } from "@/global.js";
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
    relistHandler() {
      this.instance.resume(
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
                  if (txhash.indexOf(r.transactions) != -1) {
                    filter.stopWatching();
                    location.reload(true);
                  }
                });
              }
            });
          }
        }
      );
    },
    unlistHandler() {
      let that = this;
      this.$swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, unlist it!"
      }).then(result => {
        if (result.value) {
          that.unlist();
          // this.$swal(
          //   'Unlisted!',
          //   'Your product has been unlisted.',
          //   'success'
          // )
        }
      });
    },
    unlist() {
      this.instance.pause(
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
                  if (txhash.indexOf(r.transactions) != -1) {
                    filter.stopWatching();
                    location.reload(true);
                  }
                });
              }
            });
          }
        }
      );
    },
    reCreate() {
      var that = this;
      var instance = this.instance;
      instance.info(function(e, r) {
        if (e) {
          console.log(e);
        } else {
          var newItem = {
            title: r[1],
            desc: r[2],
            tags: r[3],
            categories: "",
            imageUrls: r[6],
            contact: r[4],
            escrowPeriod: r[5],
            crc20: Global.USDaddr,
            amount: r[7]
          };
          var newContract = window.web3.cmt.contract(Contracts.Listing.abi);
          window.web3.cmt.getAccounts(function(e, addr) {
            if (e) {
              console.log(e);
            } else {
              var userAddress = addr.toString();
              var bin = Contracts.Listing.bin;
              createHandler(newContract, newItem, bin, userAddress, that);
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
