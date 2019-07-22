<template>
  <div class="listing">
    <LoadingMask v-if="loading"></LoadingMask>
    <ListingInfo v-on:tradingInfo="setNav" />
    <div style="text-align:center;margin-top:20px;">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/profile">Profile</router-link>
    </a>
    <component
      v-bind="{
        contractAddr: contractAddr,
        status: status,
        instance: instance,
        sellerInfo: sellerInfo,
        isBuyer: isBuyer
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
import LoadingMask from "@/components/LoadingMask.vue";
import Global from "@/global.js";

export default {
  name: "listing",
  components: {
    ListingInfo,
    SellerNav,
    BuyerNav,
    LoadingMask
  },
  data() {
    return {
      loading: true,
      FooterNav: null,
      contractAddr: this.$route.params.contractAddr,
      status: null,
      instance: null,
      sellerInfo: null,
      isBuyer: false
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
    this.$ga.page("/listing");
  },
  methods: {
    setNav: function(tradingInfo) {
      this.loading = false;
      console.log(tradingInfo);
      if (tradingInfo.isSeller) {
        this.FooterNav = "SellerNav";
      } else {
        this.FooterNav = "BuyerNav";
      }
      this.status = parseInt(tradingInfo.status);
      this.instance = tradingInfo.instance;
      this.sellerInfo = tradingInfo.sellerInfo;
      this.isBuyer = tradingInfo.isBuyer;
    }
  },
  computed: {
    footerComponent: function() {
      return this.FooterNav;
    }
  }
};
</script>

<style lang="stylus">
.listing
  @media screen and (min-width: 600px)
    margin 0 0 (420/16)rem
</style>
