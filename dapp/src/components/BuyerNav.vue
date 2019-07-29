<template>
  <div class="listing-info-nav">
    <div class="base-footer">
      <button class="link" @click="contact()">Contact Seller</button>
      <button class="action" @click="goBuy()" v-if="status == 1">
        Buy Now
      </button>
      <router-link
        class="action"
        :to="`/order/buy/${contractAddr}`"
        v-else-if="isBuyer"
        >Order Status</router-link
      >
      <button class="link gray" v-else>Sold</button>
    </div>
    <DownloadBanner v-if="!_isMobile"></DownloadBanner>
  </div>
</template>
<script>
import { web3Pass } from "@/global.js";
import DownloadBanner from "@/components/DownloadBanner.vue";

export default {
  name: "BuyerNav",
  components: {
    DownloadBanner
  },
  props: {
    contractAddr: String,
    status: Number,
    sellerInfo: String,
    isBuyer: Boolean
  },
  methods: {
    contact() {
      if (web3Pass(this))
        this.$swal({
          text: `seller info:${this.sellerInfo}`
        });
    },
    goBuy() {
      if (web3Pass(this, `/buy/${this.contractAddr}`))
        this.$router.push(`/buy/${this.contractAddr}`);
    }
  },
  computed: {
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
  }
};
</script>
<style lang="stylus">
.gray
  background-color #ccc !important
  color #fff
</style>
