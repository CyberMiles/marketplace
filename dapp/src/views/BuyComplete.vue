<template>
  <div class="empty-list">
    <img
      src="https://img.icons8.com/ios/50/000000/loading.png"
      v-if="status == 'processing'"
      class="loading"
    />
    <img src="./../assets/imgs/success.svg" v-if="status == 'succeed'" />
    <img
      src="./../assets/imgs/error.png"
      srcset="
        ./../assets/imgs/error@2x.png 2x,
        ./../assets/imgs/error@3x.png 3x
      "
      v-if="status == 'fail'"
    />
    <div class="text" v-if="status == 'processing'">Payment Processing</div>
    <div class="text" v-if="status == 'succeed'">Payment Completed</div>
    <div class="text" v-if="status == 'fail'">Payment Failed</div>
    <router-link to="/">HomePage</router-link>
    <router-link :to="`/order/buy/${orderId}`" v-if="status == 'succeed'"
      >Order Details</router-link
    >
  </div>
</template>
<script>
import { setTimeout } from "timers";
import { goDebug } from "@/global.js";

export default {
  data() {
    return {
      status: "processing"
    };
  },
  created() {
    console.log("created");
    var that = this;
    var getReceipt = function() {
      try {
        window.web3.cmt.getTransactionReceipt(
          that.$route.params.txHash,
          function(e, receipt) {
            if (e) {
              goDebug({
                txhash: "null",
                callMethod: "getTransactionReceipt",
                error: e
              });
            } else {
              if (receipt == null) setTimeout(getReceipt, 100);
              else {
                if (receipt.status == 0x1) {
                  that.status = "succeed";
                } else {
                  that.status = "fail";
                }
              }
            }
          }
        );
      } catch (e) {
        setTimeout(getReceipt, 100);
        console.log("wait");
      }
    };
    getReceipt();
  },
  computed: {
    orderId: function() {
      console.log(this.$route.params.contractAddr);
      return this.$route.params.contractAddr;
    }
  }
};
</script>

<style lang="stylus">
@keyframes spin
  100%
    -webkit-transform rotate(360deg)
    transform rotate(360deg)

.empty-list
  position absolute
  z-index -1
  top 0
  bottom 0
  left 0
  right 0
  display flex
  flex-direction column
  align-items center
  justify-content center
  img
    padding (10/16)rem
  .text
    font-size (17/16)rem
    color #191919
  .loading
    animation spin 1.5s linear infinite
</style>
