<template>
  <div class="listing">
    <ListingInfo v-on:tradingInfo="setNav" />
    <component
      v-bind="{ contractAddr: contractAddr, status: status }"
      :is="footerComponent"
      class="nav"
    ></component>
  </div>
</template>
<script>
import ListingInfo from "@/components/ListingInfo.vue";
import SellerNav from "@/components/SellerNav.vue";
import BuyerNav from "@/components/BuyerNav.vue";

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
      status: null
    };
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
    }
  },
  computed: {
    footerComponent: function() {
      return this.FooterNav;
    }
  }
};
</script>
