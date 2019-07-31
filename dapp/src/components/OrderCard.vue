<template>
  <div>
    <div class="order-card" @click="viewOrder(order.id)">
      <div class="order-goods-info">
        <div class="goods-img">
          <RespImg v-bind:src="order.goods.image" alt="" />
        </div>
        <div class="goods-desc">
          <div class="goods-title">{{ order.goods.title }}</div>
          <div class="goods-price">{{ order.payment }}</div>
        </div>
      </div>

      <hr />

      <div class="order-info">
        <div class="paid-order" v-if="order.status === 'paid'">
          <div class="countdown">
            {{ dynCountdown(order.time) }}
            <button class="expl" @click.stop="showExplPop">
              <span>?</span>
            </button>
          </div>
          <div class="order-actions">
            <button
              class="main-action"
              @click.stop="cancelOrder"
              v-if="role === 'sell'"
            >
              Cancel Order
            </button>
            <button class="main-action" @click.stop="confirm" v-else>
              Confirm Receipt
            </button>
            <div class="other-actions">
              <button class="others-trigger" @click.stop="showActionsPop">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>

        <div class="completed-order" v-if="order.status === 'completed'">
          <label>Contract:</label>
          <span class="contract-addr">{{ order.contract }}</span>
        </div>

        <div class="refund-order" v-if="order.status === 'refund'">
          <div>
            <label>Refund Amount:</label>
            <span class="refund-amount">{{ order.payment }}</span>
          </div>
          <div>
            <label>Refund Reason:</label>
            <span class="refund-reason">{{ order.refundReason }}</span>
          </div>
        </div>

        <div class="dispute-order" v-if="order.status === 'dispute'">
          <div>
            <label>Dispute Reason:</label>
            <span class="dispute-reason">{{ order.disputeReason }}</span>
          </div>
          <div class="order-actions">
            <button
              class="main-action"
              @click.stop="cancelOrder"
              v-if="role === 'sell'"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
      <div class="countdown-expl-pop" v-if="explPopShown">
        After payment, the digital currency is locked into an intelligent
        contract for 10 days, and the seller delivers the goods within 10 days;
        Smart contracts will automatically transfer digital money to the seller
        after 10 days; If the seller fails to deliver the goods, please apply
        for arbitration refund within 10 days
      </div>
    </div>
    <template v-if="actionsPopShown">
      <div class="others-mask" @mousedown="actionsPopShown = false"></div>
      <div class="others-pop" v-if="role === 'sell'">
        <button v-on:mousedown="cancelOrder">Cancel Order</button>
        <button v-on:mousedown="showBuyer">Contact Buyer</button>
        <button v-on:mousedown="receiveFund" v-if="countdown(order.time) == 0">
          Receive Fund
        </button>
        <button v-on:mousedown="remark(order.id)">Remark</button>
      </div>
      <div class="others-pop" v-else>
        <button v-on:mousedown="confirm">Confirm Receipt</button>
        <button v-on:mousedown="showSeller">
          Contact Seller
        </button>
        <button v-on:mousedown="dispute" v-if="countdown(order.time) > 0">
          Dispute
        </button>
        <button v-on:mousedown="remark(order.id)">Remark</button>
      </div>
    </template>
  </div>
</template>

<script>
import RespImg from "@/components/RespImg.vue";
import Contracts from "@/contracts.js";
import {
  closeByBuyerHandler,
  closeBySellerHandler,
  disputeHandler,
  refundHandler
} from "@/global.js";

export default {
  props: ["order", "role"],
  components: {
    RespImg
  },
  data() {
    return {
      explPopShown: false,
      actionsPopShown: false,
      remainTime: 0
    };
  },
  methods: {
    countdown(time) {
      const remain = time - new Date().getTime();
      if (remain > 0) {
        return Math.ceil(remain / 1000);
        // return Math.ceil(remain / (60 * 60 * 1000));
      } else {
        return 0;
      }
    },
    dynCountdown(time) {
      var remainSeconds = this.countdown(time);
      console.log(remainSeconds);
      var days = Math.floor(remainSeconds / (3600 * 24));
      remainSeconds = remainSeconds % (3600 * 24);
      var hours = Math.floor(remainSeconds / 3600);
      remainSeconds = remainSeconds % 3600;
      var minutes = Math.floor(remainSeconds / 60);
      var seconds = remainSeconds % 60;
      console.log(hours, remainSeconds, minutes, seconds);
      if (days) {
        return `${days}d ${hours}h`;
      } else return `${days}d ${hours}h`;
    },
    showExplPop() {
      this.explPopShown = true;
      document.addEventListener("touchstart", this.hideExplPop);
    },
    hideExplPop() {
      document.removeEventListener("touchstart", this.hideExplPop);
      setTimeout(() => {
        this.explPopShown = false;
      }, 100);
    },
    showActionsPop() {
      this.actionsPopShown = true;
      document.addEventListener("touchstart", this.hideActionsPop);
    },
    hideActionsPop() {
      document.removeEventListener("touchstart", this.hideActionsPop);
      setTimeout(() => {
        this.actionsPopShown = false;
      }, 300);
    },
    confirm() {
      let that = this;
      this.$swal({
        title: "<small>Are you sure?</small>",
        showCancelButton: true,
        customClass: {
          confirmButton: "confirm-button-class",
          cancelButton: "cancel-button-class"
        },
        animation: false,
        reverseButtons: true,
        confirmButtonText: "Yes, receive it!"
      }).then(result => {
        if (result.value) {
          var instance = that.createInstance(this.order.id);
          var reloc = {
            router: that.$router,
            href: `/order/${that.role}/${that.order.id}`
          };
          closeByBuyerHandler(instance, reloc);
        }
      });
    },
    dispute() {
      let that = this;
      this.$swal({
        title: "Are you sure?",
        showCancelButton: true,
        customClass: {
          confirmButton: "confirm-button-class",
          cancelButton: "cancel-button-class"
        },
        reverseButtons: true,
        animation: false,
        confirmButtonText: "Yes, dispute!"
      }).then(result => {
        if (result.value) {
          var instance = that.createInstance(this.order.id);
          disputeHandler(instance);
        }
      });
    },
    receiveFund() {
      var instance = this.createInstance(this.order.id);
      closeBySellerHandler(instance);
    },
    cancelOrder() {
      var instance = this.createInstance(this.order.id);
      refundHandler(instance);
    },
    viewOrder(id) {
      if (!this.actionsPopShown && !this.explPopShown) {
        this.$router.push(`/order/${this.role}/${id}`);
      }
      this.$router.push(`/order/${this.role}/${id}`);
    },
    remark(id) {
      this.$router.push(`/remark/${id}`);
    },
    createInstance(addr) {
      var contract = window.web3.cmt.contract(Contracts.Listing.abi);
      return contract.at(addr);
    },
    showSeller() {
      this.$swal({
        title: this.order.goods.title,
        text: `seller contact information: ${this.order.sellerContact}`
      });
    },
    showBuyer() {
      this.$swal({
        title: this.order.goods.title,
        text: `buyer contact information: ${this.order.buyerContact}`
      });
    }
  }
};
</script>

<style lang="stylus">
.confirm-button-class
  border-radius 18px  !important
  box-shadow 0 0 7px 0 rgba(255, 63, 15, 0.3)  !important
  font-size (15/16)rem !imporatant
  background-image linear-gradient(to left, #ff7777, #ff3f0f) !important
.cancel-button-class
  background transparent !important
  color #ff3f0f !important
  font-size (15/16)rem !imporatant
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
      width 100%
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
        span
          display inline-block
          vertical-align middle
          line-height normal
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
  .completed-order
    font-size (13/16)rem
    label
      color #999999
      margin-right (8/16)rem
    .contract-addr
      color #00a0ff
      word-break break-all
  .refund-order,.dispute-order
    font-size (13/16)rem
    label
      color #999999
      margin-right (8/16)rem
    .refund-amount
      color #ff3f0f
    .refund-reason,.dispute-reason
      word-break break-all
    .order-actions
      display inline-flex
      position relative
      padding-top (10/16)rem
      button
        height (24/16)rem
        border-radius (8/16)rem
        border solid 0.5px #e5e5e5
        font-size (13/16)rem
        padding 0 (10/16)rem
        background-color transparent
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
.others-pop
  position fixed
  bottom 0
  left 0
  border-radius (8/16)rem (8/16)rem
  background-color rgba(0, 0, 0, 0.7)
  padding 0 (12/16)rem
  z-index 999
  display flex
  flex-direction column
  justify-content space-around
  height (150/16)rem
  width 100%
  button
    display block
    height auto
    padding 0
    white-space nowrap
    background rgba(0, 0, 0, 0.7)
    font-size (18/16)rem
    color rgba(255, 255, 255, 0.8)
    border 0
.others-mask
  transition all .3s
  position fixed
  top 0
  left 0
  z-index 998
  background-color rgba(0, 0, 0, 0.7)
  height 100%
  width 100%
</style>
