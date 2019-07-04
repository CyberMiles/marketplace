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
          <button class="expl" @click.stop="showExplPop">?</button>
        </div>
        <div class="order-actions">
          <button class="main-action" @click="confirm">Confirm Receipt</button>
          <div class="other-actions">
            <button class="others-trigger" @click.stop="showActionsPop">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div class="others-pop" v-if="actionsPopShown">
              <button v-on:touchstart="confirm">Confirm Receipt</button>
              <button>Contract Seller</button>
            </div>
          </div>
        </div>
      </div>

      <div class="completed-order" v-if="order.status === 'completed'">
        <label>Contract:</label>
        <span class="contract-addr">{{ order.contract }}</span>
      </div>

      <div class="refund-order" v-if="order.status === 'refund'">
        <div>
          <label>Refund Amout:</label>
          <span class="refund-amount">${{ order.refundAmount }}</span>
        </div>
        <div>
          <label>Refund Reson:</label>
          <span class="refund-reason">{{ order.refundReason }}</span>
        </div>
      </div>
    </div>
    <div class="countdown-expl-pop" v-if="explPopShown">
      After payment, the digital currency is locked into an intelligent contract
      for 10 days, and the seller delivers the goods within 10 days; Smart
      contracts will automatically transfer digital money to the seller after 10
      days; If the seller fails to deliver the goods, please apply for
      arbitration refund within 10 days
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
  data() {
    return {
      explPopShown: false,
      actionsPopShown: false
    };
  },
  methods: {
    countdown(time) {
      const remain = new Date().getTime() - time;
      return Math.ceil(remain / (60 * 60 * 1000)) + "h";
    },
    showExplPop() {
      this.explPopShown = true;
      document.addEventListener("touchstart", this.hideExplPop);
    },
    hideExplPop() {
      document.removeEventListener("touchstart", this.hideExplPop);
      this.explPopShown = false;
    },
    showActionsPop() {
      this.actionsPopShown = true;
      document.addEventListener("touchstart", this.hideActionsPop);
    },
    hideActionsPop() {
      document.removeEventListener("touchstart", this.hideActionsPop);
      this.actionsPopShown = false;
    },
    confirm() {
      alert(1);
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
  margin-bottom (15/16)rem
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
        display block
        background-color transparent
        text-align center
        width (13/16)rem
        height (13/16)rem
        line-height 1
        color #999999
        border 1px solid #999999
        border-radius 50%
        font-size (10/16)rem
        margin-left (5/16)rem
        padding 0
    .order-actions
      display flex
      position relative
      button
        height (24/16)rem
        border-radius (8/16)rem
        border solid 0.5px #e5e5e5
        font-size (13/16)rem
        padding 0 (10/16)rem
        background-color transparent
      .others-trigger
        margin-left (15/16)rem
        width (48/16)rem
        display flex
        align-items center
        justify-content space-evenly
        span
          display block
          width (3/16)rem
          height (3/16)rem
          border-radius 50%
          background-color #666666
      .others-pop
        position absolute
        margin-top (10/16)rem
        right 0
        border-radius (8/16)rem
        background-color rgba(0, 0, 0, 0.7)
        padding 0 (12/16)rem
        z-index 1
        display flex
        flex-direction column
        justify-content space-around
        height (75/16)rem
        &:after
          content ""
          box-sizing border-box
          position absolute
          top (-10/16)rem
          right (10/16)rem
          width (10/16)rem
          height (10/16)rem
          border-width 0 (5/16)rem (5/16)rem (5/16)rem
          border-style solid
          border-color transparent transparent rgba(0, 0, 0, 0.7) transparent
        button
          display block
          height auto
          padding 0
          white-space nowrap
          font-size (13/16)rem
          color rgba(255, 255, 255, 0.8)
          border 0
  .completed-order
    font-size (13/16)rem
    label
      color #999999
      margin-right (8/16)rem
    .contract-addr
      color #00a0ff
      word-break break-all
  .refund-order
    font-size (13/16)rem
    label
      color #999999
      margin-right (8/16)rem
    .refund-amount
      color #ff3f0f
    .refund-reason
      word-break break-all
  .countdown-expl-pop
    position absolute
    left (30/16)rem
    margin-top (5/16)rem
    border-radius (8/16)rem
    background-color rgba(0, 0, 0, 0.7)
    font-size (11/16)rem
    color rgba(255, 255, 255, 0.8)
    padding (12/16)rem
    width (315/16)rem
    z-index 1
    &:after
      content ""
      box-sizing border-box
      position absolute
      top (-10/16)rem
      left (10/16)rem
      width (10/16)rem
      height (10/16)rem
      border-width 0 (5/16)rem (5/16)rem (5/16)rem
      border-style solid
      border-color transparent transparent rgba(0, 0, 0, 0.7) transparent
</style>
