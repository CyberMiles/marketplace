<template>
  <div class="listing-info">
    <div
      class="main"
      :style="{ height: headImgWidth + 'px' }"
      @click="showFullPic()"
    >
      <RespImg
        v-bind:src="headImg"
        v-bind:alt="ProductInfo.desc"
        v-bind:division="1"
      />
      <div class="goods-price">
        <span>$ {{ ProductInfo.USDprice }}</span>
      </div>
    </div>
    <section>
      <div class="thumbs">
        <div class="goods-thumb" v-if="ProductInfo.images.length === 0"></div>
        <div
          class="goods-thumb"
          v-for="image in ProductInfo.images"
          :key="image.key"
          @click="headImg = image"
          v-bind:class="{ selected: image === headImg }"
        >
          <RespImg v-bind:src="image" v-bind:division="6" />
        </div>
      </div>
      <div v-if="ProductInfo.title === null">
        <br />
        <div class="prefilled-text"></div>
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
      <div v-if="ProductInfo.desc === null">
        <div class="prefilled-text"></div>
        <br />
        <div class="prefilled-text"></div>
      </div>
      <p class="markdown-body">
        <vue-markdown v-bind:source="ProductInfo.desc">{{
          ProductInfo.desc
        }}</vue-markdown>
      </p>
    </section>
    <section>
      <h3>Seller</h3>
      <dl>
        <dt>Address</dt>
        <div class="prefilled-text" v-if="ProductInfo.seller === null"></div>
        <dd>{{ ProductInfo.seller }}</dd>
        <dt>Completed Order</dt>
        <dd>{{ sellerCompletedNumber }} order</dd>
        <dt>Contact Info</dt>
        <div class="prefilled-text" v-if="ProductInfo.contact === null"></div>
        <dd>{{ ProductInfo.contact }}</dd>
      </dl>
    </section>
  </div>
</template>
<script>
import RespImg from "@/components/RespImg";
import axios from "axios";
import { makeQuery, queryOptions } from "@/global.js";
import VueMarkdown from "vue-markdown";

export default {
  name: "ListingInfo",
  props: ["ProductInfo"],
  components: {
    RespImg,
    VueMarkdown
  },
  data() {
    return {
      headImg: "",
      sellerCompletedNumber: 0
    };
  },
  created() {
    console.log(this.ProductInfo);
  },
  methods: {
    getCompletedOrder(seller) {
      var that = this;
      var queryMarketplaceABI = makeQuery([4], seller);
      axios(queryOptions(queryMarketplaceABI)).then(r => {
        that.sellerCompletedNumber = r.data.length;
      });
    },
    showFullPic() {
      location.href = this.headImg;
    }
  },
  computed: {
    headImgWidth: function() {
      return window.innerWidth;
    }
  },
  watch: {
    ProductInfo: function() {
      this.getCompletedOrder(this.ProductInfo.seller);
      this.headImg = this.ProductInfo.images[0];
    }
  }
};
</script>
<style lang="stylus">
.prefilled-text
  background #f2f2f2
  width 80%
  height (16/16)rem
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
    .selected
      opacity 0.3
    margin-top (-5/16)rem
    .goods-thumb
      width (60/16)rem
      height (60/16)rem
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
    overflow: auto;
    li
      margin-right (15/16)rem
      white-space nowrap
      float left
      display block
      margin-bottom (10/16)rem
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
