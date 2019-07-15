<template>
  <div class="listing">
    <ListingInfo v-on:tradingInfo="setNav" />
    <component
      v-bind="{
        contractAddr: contractAddr,
        status: status,
        instance: instance,
        sellerInfo: sellerInfo
      }"
      :is="footerComponent"
      class="nav"
    ></component>
  </div>
</template>
<script>
import ListingInfo from "@/components/ListingInfo.vue";
import SellerNav from "@/components/SellerNav.vue";
import BuyerNav from "@/components/BuyerNav.vue";
import Global from "@/global.js";

export default {
  name: "listing",
  components: {
    ListingInfo,
    SellerNav,
    BuyerNav
  },
  data() {
    return {
      FooterNav: null,
      contractAddr: this.$route.params.contractAddr,
      status: null,
      instance: null,
      sellerInfo: null
    };
  },
  created() {
    try {
      window.web3.cmt;
    } catch (e) {
      var Web3 = require("web3-cmt");
      window.web3 = new Web3(
        new Web3.providers.HttpProvider(Global.HttpProvider)
      );
    }
  },
  methods: {
    setNav: function(tradingInfo) {
      console.log(tradingInfo);
      if (tradingInfo.isSeller) {
        this.FooterNav = "SellerNav";
      } else {
        this.FooterNav = "BuyerNav";
      }
      this.status = parseInt(tradingInfo.status);
      this.instance = tradingInfo.instance;
      this.sellerInfo = tradingInfo.sellerInfo;
    }
  },
  computed: {
    footerComponent: function() {
      return this.FooterNav;
    }
  }
};
</script>
