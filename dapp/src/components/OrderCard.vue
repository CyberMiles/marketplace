<template>
  <div class="order-card">
    <div class="order-goods-info">
      <div class="goods-img">
        <RespImg v-bind:src="order.goods.image" alt="" />
      </div>
      <div class="goods-desc">
        <div class="goods-title">{{ order.goods.title }}</div>
        <div class="goods-price">$ {{ order.goods.price }}</div>
      </div>
    </div>

    <hr />

    <div class="order-info">
      <div class="paid-order" v-if="order.status === 'paid'">
        <div class="countdown">
          {{ countdown(order.time) }}
          <span class="expl">?</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RespImg from "@/components/RespImg.vue";

export default {
  props: ["order"],
  components: {
    RespImg
  },
  methods: {
    countdown(time) {
      const remain = new Date().getTime() - time;
      return Math.ceil(remain / (60 * 60 * 1000)) + "h";
    }
  }
};
</script>

<style lang="stylus">
.order-card
  background-color #ffffff
  padding (15/16)rem
  border-radius (8/16)rem
  box-shadow 0 (3/16)rem (9/16)rem 0 rgba(0, 0, 0, 0.03)
  .order-goods-info
    display flex
    .goods-img
      width (60/16)rem
      min-width (60/16)rem
      height (60/16)rem
      margin-right (10/16)rem
      border-radius (8/16)rem
      background-color #e5e5e5
      overflow hidden
      img
        width (60/16)rem
    .goods-desc
      height (60/16)rem
      overflow hidden
      position relative
      .goods-title
        font-size (15/16)rem
        line-height 1.4
      .goods-price
        position absolute
        bottom 0
        font-size (13/16)rem
        font-weight 600
        color #ff3f0f
        background-color #ffffff
        width 100%
  hr
    margin (15/16)rem 0
    height 1px
    border 0
    background-color #e5e5e5
  .paid-order
    display flex
    justify-content space-between
    .countdown
      font-size (13/16)rem
      color #ff3f0f
      display flex
      align-items center
      .expl
        display inline-block
        text-align center
        width (13/16)rem
        height (13/16)rem
        line-height 1
        color #999999
        border 1px solid #999999
        border-radius 50%
        font-size (10/16)rem
        margin-left (5/16)rem
</style>
