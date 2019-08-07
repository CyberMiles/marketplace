<template>
  <div class="listing-info">
    <div class="main">
      <RespImg v-bind:src="headImg" v-bind:alt="ProductInfo.desc" />
      <div class="goods-price">
        <span>$ {{ ProductInfo.USDprice }}</span>
      </div>
    </div>
    <section>
      <div class="thumbs">
        <div
          class="goods-thumb"
          v-for="image in ProductInfo.images"
          :key="image.key"
          @click="headImg = image"
        >
          <RespImg v-bind:src="image" />
        </div>
      </div>
      <h1 class="wrap-text">{{ ProductInfo.title }}</h1>
      <ul class="tags" v-if="ProductInfo.tags.length > 0">
        <li v-for="tag in ProductInfo.tags" :key="tag.id">
          <router-link :to="`/tag/${tag.trim()}`" class="tag-link">{{
            tag.trim()
          }}</router-link>
        </li>
      </ul>
    </section>
    <section class="desc-sec">
      <h3>Description</h3>
      <p class="markdown-body">
        <vue-markdown v-bind:source="ProductInfo.desc">...</vue-markdown>
      </p>
    </section>
    <section>
      <h3>Seller</h3>
      <dl>
        <dt>Address</dt>
        <dd>{{ ProductInfo.seller }}</dd>
        <dt>Completed Order</dt>
        <dd>{{ sellerCompletedNumber }} order</dd>
        <dt>Contact Info</dt>
        <dd>{{ ProductInfo.contact }}</dd>
      </dl>
    </section>
  </div>
</template>
<script>
import Contracts from "@/contracts.js";
import RespImg from "@/components/RespImg";
import axios from "axios";
import Global from "@/global.js";
import { goDebug } from "@/global.js";
import VueMarkdown from "vue-markdown";

export default {
  name: "ListingInfo",
  components: {
    RespImg,
    VueMarkdown
  },
  data() {
    return {
      isSeller: false,
      isBuyer: false,
      sellerCompletedNumber: 0,
      headImg: "",
      ProductInfo: {
        images: [],
        title: null,
        tags: [],
        desc: null,
        seller: null,
        contact: null,
        USDprice: null
      }
    };
  },
  created() {
    this.initProductInfo();
  },
  methods: {
    initProductInfo() {
      var contract_address = this.$route.params.contractAddr;
      // console.log(contract_address);
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
                txHash: "null",
                callMethod: "getAccounts",
                error: e
              });
            } else {
              var userAddress = address.toString();

              var contract = window.web3.cmt.contract(Contracts.Listing.abi);
              var instance = contract.at(contract_address);

              instance.info(function(e, r) {
                if (e) {
                  goDebug({
                    txHash: "null",
                    callMethod: "instance.info",
                    error: e
                  });
                } else {
                  console.log(r);
                  // console.log(r[3]);
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
                  document.title = `${that.ProductInfo.title} — ${
                    Global.ProductName
                  }`;
                  // console.log(that.ProductInfo);
                  that.headImg = that.ProductInfo.images[0];
                  that.isSeller = userAddress == that.ProductInfo.seller;
                  that.isBuyer = userAddress == that.ProductInfo.buyerAddress;
                  that.$emit("tradingInfo", {
                    isSeller: that.isSeller,
                    isBuyer: that.isBuyer,
                    status: that.ProductInfo.status.toNumber(),
                    instance: instance,
                    sellerInfo: that.ProductInfo.contact
                  });
                  that.getCompletedOrder(that.ProductInfo.seller);
                }
              });
            }
          });
        } catch (e) {
          setTimeout(checkWeb3, 50);
        }
      };
      checkWeb3(); //immediate first run
    },
    getCompletedOrder(seller) {
      var that = this;
      var queryMarketplaceABI = {
        query: {
          bool: {
            must: [
              {
                match: {
                  abiShaList: Global.abiShaList
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.0": "4"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.8": seller
                }
              }
            ]
          }
        }
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        data: JSON.stringify(queryMarketplaceABI),
        url: "https://cmt-testnet.search.secondstate.io/api/es_search"
      };
      axios(options).then(r => {
        console.log(r.data.length);
        that.sellerCompletedNumber = r.data.length;
      });
    }
  },
};
</script>
<style lang="stylus">
.listing-info
  margin-bottom (50/16)rem
  .main
    position relative
    background-color #f0f0f0
    img
      display block
      width 100vw
    .goods-price
      display flex
      align-items center
      position absolute
      left (15/16)rem
      bottom (15/16)rem
      height (24/16)rem
      line-height 1
      border-radius (12/16)rem
      box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
      background-image linear-gradient(to left, #ff7777, #ff3f0f)
      font-size (15/16)rem
      font-weight bold
      color #ffffff
      padding 0 (7/16)rem
  .thumbs
    margin-top (-5/16)rem
    .goods-thumb
      width (60/16)rem
      border-radius (4/16)rem
      background-color #f0f0f0
      overflow hidden
      margin-right (15/16)rem
      display inline-block
      img
        display block
        width (60/16)rem
        height (60/16)rem
  .wrap-text
    font-size (17/16)rem
    font-weight 500
    line-height 1.4
    word-break break-word
    margin (12/16)rem 0
  .tags
    margin 0
    padding 0
    list-style none
    display flex
    li
      margin-right (15/16)rem
      &:last-child
        margin-right 0
    .tag-link
      display block
      height (24/16)rem
      line-height (24/16)rem
      padding 0 (12/16)rem
      border-radius (12/16)rem
      font-size (13/16)rem
      color #666666
      background-color #f0f0f0
      text-decoration none
  .desc-sec
    padding 45px
    @media screen and (max-width: 767px)
      padding (20/16)rem (15/16)rem
    margin-bottom (8/16)rem
    box-shadow 0 0.5px 0 0 #e5e5e5
    background-color #ffffff
    .markdown-body
      box-sizing border-box
      min-width 200px
      max-width 980px
      margin 0 auto
      padding 45px
      @media screen and (max-width: 767px)
        padding 0
  section:not(.desc-sec)
    padding 45px
    @media screen and (max-width: 767px)
      padding (20/16)rem (15/16)rem
    margin-bottom (8/16)rem
    box-shadow 0 0.5px 0 0 #e5e5e5
    background-color #ffffff
    h3
      font-size (18/16)rem
      margin 0 0 (15/16)rem
    p
      font-size (15/16)rem
      line-height 1.5
      margin 0
      word-break break-word
    dl
      margin 0
      dt
        font-size (15/16)rem
        color #999999
      dd
        font-size (13/16)rem
        margin (7/16)rem 0 (15/16)rem
</style>
