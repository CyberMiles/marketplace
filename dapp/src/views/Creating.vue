<template>
  <div class="empty-list">
    <div class="text strong" v-if="status == 'processing'">
      Creating Contract......
    </div>
    <div class="text" v-if="status == 'processing'">{{ remaining }} s</div>
    <div class="text" v-if="status == 'succeed'">
      Contract Creation Succeed!
    </div>
    <div class="text" v-if="status == 'fail'">Contract Creation Failed.</div>
    <router-link :to="`/listing/${goodId}`" :class="statusColor"
      >See my item<span v-if="status == 'processing'">
        ({{ remaining }}s)</span
      ></router-link
    >
    <div class="text">Or, you can</div>
    <router-link to="/">Browse Listings</router-link>
    <router-link to="/create">Create a New One</router-link>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import { goDebug } from "@/global.js";

export default {
  data() {
    return {
      status: "processing",
      goodId: "",
      remaining: 20
    };
  },
  created() {
    var that = this;
    var getReceipt = function() {
      try {
        window.web3.cmt.getTransactionReceipt(
          that.$route.params.txHash,
          function(e, receipt) {
            if (e) {
              goDebug({
                txhash: that.$route.params.txHash,
                error: e
              });
            } else {
              if (receipt == null) setTimeout(getReceipt, 100);
              else {
                if (receipt.status == 0x1) {
                  that.goodId = receipt.contractAddress;
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
    var startCounting = function() {
      setTimeout(function() {
        that.remaining--;
        if (that.remaining > 0) startCounting();
        else {
          if (that.status == "processing") {
            that.remaining = 20;
            startCounting();
          }
        }
      }, 1000);
    };
    startCounting();
  },
  computed: {
    orderId: function() {
      console.log(this.$route.params.contractAddr);
      return this.$route.params.contractAddr;
    },
    statusColor: function() {
      if (this.status == "succeed") return;
      else return "disabled";
    }
  }
};
</script>

<style lang="stylus">
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
    margin (7/16)rem
    font-size (17/16)rem
    color #191919
  .strong
    font-weight 600
  .disabled
    background #c7c7c7
    box-shadow none
</style>
