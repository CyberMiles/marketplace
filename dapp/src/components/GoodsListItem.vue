<template>
  <div class="goods-list-item-container">
    <div class="goods-list-item" @click="goListing">
      <slot></slot>
      <div class="goods-price">
        <span><slot name="price"></slot></span>
      </div>
      <div class="sold" v-if="sold">
        <span>Sold</span>
      </div>
    </div>
    <div
      class="prefilled-text"
      style="margin-top: (3/16)rem"
      v-if="title === null"
    ></div>
    <div class="short-title">{{ title }}</div>
  </div>
</template>

<script>
import { refactorListingTitle } from "@/global.js";

export default {
  props: ["sold", "title", "contractAddr"],
  methods: {
    goListing() {
      this.$router.push(
        "/" + refactorListingTitle(this.title) + "/listing/" + this.contractAddr
      );
    }
  }
};
</script>

<style lang="stylus">
.goods-list-item-container
  height "calc(100% - %s)" % (18/16)rem
  .goods-list-item
    position relative
    width 100%
    height @width
    border-radius (8/16)rem
    background-color #f0f0f0
    overflow hidden
    img
      width 100%
      height @width
    .goods-price
      display flex
      align-items center
      position absolute
      left (5/16)rem
      bottom (5/16)rem
      height (24/16)rem
      line-height 1
      padding 0 (5/16)rem
      border-radius (12/16)rem
      background-color #ff3f0f
      font-size (14/16)rem
      color #ffffff
    .sold
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      background-color rgba(0, 0, 0, 0.5)
      span
        position absolute
        top 50%
        margin-top (-16/16)rem
        height (32/16)rem
        line-height (32/16)rem
        left 50%
        margin-left (-67/2/16)rem
        width (67/16)rem
        border-radius (16/16)rem
        border solid 1px rgba(255, 255, 255, 0.2)
        background-color rgba(255, 255, 255, 0.2)
        color rgba(255, 255, 255, 0.8)
        font-size (17/16)rem
        text-align center
  .short-title
    line-height (20/16) rem
    height (40/16) rem
    font-size (15/16)rem
    overflow hidden
    -webkit-line-clamp 1
    display -webkit-box
    -webkit-box-orient vertical
    margin-top (3/16)rem
</style>
