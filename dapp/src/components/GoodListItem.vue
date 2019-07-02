<template>
  <div class="good-list-item" @click="goListing">
    <slot></slot>
    <div class="good-price">
      <slot name="price"></slot>
    </div>
    <div class="sold" v-if="sold">
      <span>Sold</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["sold", "contractAddr"],
  methods: {
    goListing() {
      this.$router.push("listing/" + this.contractAddr)
    }
  }
};
</script>

<style lang="stylus">
.good-list-item
  position relative
  width (165/16)rem
  height (165/16)rem
  border-radius (8/16)rem
  background-color #f0f0f0
  overflow hidden
  margin-bottom (15/16)rem
  img
    width (165/16)rem
    height (165/16)rem
  .good-price
    position absolute
    left (5/16)rem
    bottom (5/16)rem
    height (24/16)rem
    line-height (24/16)rem
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
</style>
