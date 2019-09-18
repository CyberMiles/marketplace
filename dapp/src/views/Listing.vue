<template>
  <div class="listing">
    <!-- <LoadingMask v-if="loading"></LoadingMask> -->
    <ListingInfo v-bind="{ ProductInfo: ProductInfo }" />
    <div style="text-align:center;margin-bottom:60px;">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/profile">Profile</router-link>
    </div>
    <SellerNav
      v-bind="{
        status: ProductInfo.status.toNumber(),
        contractAddr: contractAddr,
        instance: instance
      }"
      v-if="userAddress !== null && userAddress == ProductInfo.seller"
    />
    <BuyerNav
      v-bind="{
        status: ProductInfo.status.toNumber(),
        contractAddr: contractAddr,
        instance: instance,
        sellerInfo: ProductInfo.contact,
        isBuyer: userAddress === ProductInfo.buyerAddress
      }"
      v-else-if="ProductInfo.seller !== null"
    />
  </div>
</template>
<script>
import Contracts from "@/contracts.js";
import ListingInfo from "@/components/ListingInfo.vue";
import SellerNav from "@/components/SellerNav.vue";
import BuyerNav from "@/components/BuyerNav.vue";
// import LoadingMask from "@/components/LoadingMask.vue";
import Global from "@/global.js";
import { goDebug } from "@/global.js";

export default {
  name: "listing",
  components: {
    ListingInfo,
    SellerNav,
    BuyerNav
    // LoadingMask
  },
  data() {
    return {
      loading: true,
      contractAddr: this.$route.params.contractAddr,
      instance: null,
      userAddress: null,
      ProductInfo: {
        images: [],
        title: null,
        tags: [],
        desc: null,
        seller: null,
        contact: null,
        USDprice: null,
        status: null
      }
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
    this.initProductInfo();
  },
  methods: {
    initProductInfo() {
      var contract_address = this.$route.params.contractAddr;
      var that = this;
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
            that.userAddress = address.toString();

            var contract = window.web3.cmt.contract(Contracts.Listing.abi);
            var instance = contract.at(contract_address);
            that.instance = instance;
            instance.info(function(e, r) {
              if (e) {
                that.$router.replace(`/safelisting/${contract_address}`);
                // goDebug({
                //   callMethod: "instance.info",
                //   error: e
                // });
              } else {
                that.ProductInfo = {
                  status: r[0],
                  title: r[1],
                  desc: r[2],
                  tags: r[3].split("#").filter(obj => obj.trim() != ""),
                  escrowDuration: r[5],
                  images: r[6].split(","),
                  USDprice: (parseInt(r[7]) / 100).toString(),
                  seller: r[8].toString(),
                  buyerAddress: r[9].toString(),
                  contact: r[4]
                };
                that.setMetaInfo();
              }
            });
          }
        });
      } catch (e) {
        goDebug({
          error: "Init Error."
        });
      }
    },
    setMetaInfo() {
      document.title = `${this.ProductInfo.title} at ${this.ProductInfo.USDprice} USD — ${Global.ProductName}`;

      let keywords = this.ProductInfo.title;
      this.ProductInfo.tags.forEach(tag => {
        keywords = keywords + "," + tag.trim();
      });
      const tag = document.createElement("meta");
      tag.setAttribute("name", "keywords");
      tag.setAttribute("content", keywords);
      document.head.appendChild(tag);
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
