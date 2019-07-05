<template>
  <div class="order-detail">
    <div class="order-status">- {{ order.status }} -</div>
    <section>
      <h3>Goods Info</h3>
      <div class="info-panel">
        <div class="order-goods-info">
          <div class="goods-img">
            <RespImg v-bind:src="order.goods.image" alt="" />
          </div>
          <div class="goods-desc">
            <div class="goods-title">{{ order.goods.title }}</div>
            <div class="goods-quantity"><label>Quantity</label>x1</div>
          </div>
        </div>
        <dl>
          <dt>Payment</dt>
          <dd class="goods-price">3,000.00 SMC</dd>
        </dl>
        <dl>
          <dt>Contract</dt>
          <dd class="goods-contract">0xa3f1e99c46d1d7e6cc96f71b6116cee8160fa4d3</dd>
        </dl>
      </div>
    </section>

    <section v-if="order.status === 'refund'">
      <h3>Refund</h3>
      <div class="info-panel">
        <dl>
          <dt>Refund Amount</dt>
          <dd class="goods-price">2,000.00 SMC</dd>
        </dl>
        <dl>
          <dt>Refund Reason</dt>
          <dd>empty</dd>
        </dl>
      </div>
    </section>

    <section>
      <h3>Buyer Info</h3>
      <div class="info-panel">
        <dl>
          <dt>Address</dt>
          <dd>0xa3f1e99c46d1d7e6cc96f71b6116cee8160fa4d3</dd>
        </dl>
        <dl>
          <dt>Contact</dt>
          <dd>xxxx@xxxx.xxx</dd>
        </dl>
        <dl>
          <dt>Payment Date</dt>
          <dd>June 19, 2019</dd>
        </dl>
        <dl>
          <dt>Remark</dt>
          <dd>/</dd>
        </dl>
      </div>
    </section>

    <section>
      <h3>Seller Info</h3>
      <div class="info-panel">
        <dl>
          <dt>Address</dt>
          <dd>0xa3f1e99c46d1d7e6cc96f71b6116cee8160fa4d3</dd>
        </dl>
        <dl>
          <dt>Contact</dt>
          <dd>xxxx@xxxx.xxx</dd>
        </dl>
      </div>
    </section>

    <section>
      <h3>Remark</h3>
      <div class="info-panel remark">
        <dl>
          <dt>Remark</dt>
          <dd><router-link to="">Add New Remark</router-link></dd>
        </dl>
        <dl>
          <dt>Seller, 19:59 Jun 01th</dt>
          <dd>I Know!</dd>
        </dl>
        <dl>
          <dt>Buyer, 19:00 Jun 01th</dt>
          <dd>I hope you can deliver the goods as soon as possible</dd>
        </dl>
      </div>
    </section>

    <button class="order-action" v-if="order.status === 'paid' && role === 'buy'">
      <span>Confirm Receipt</span>
    </button>
    <button class="order-action sell-action" v-if="order.status === 'paid' && role === 'sell'">
      <span>Cancel Order</span>
    </button>
  </div>
</template>

<script>
import RespImg from "@/components/RespImg.vue";

export default {
  components: {
    RespImg
  },
  data() {
    return {
      role: "",
      order: {
        id: "2",
        status: "refund",
        goods: {
          image:
            "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
          title: "There is a kind of beauty in imperfection",
          price: "11"
        },
        time: 1562147586285
      },
    }
  },
  created() {
    this.role = this.$route.params.role;
  }
}
</script>

<style lang="stylus">
.order-detail
  padding (20/16)rem (15/16)rem
  .order-status
    font-size (18/16)rem
    font-weight 500
    text-transform capitalize
    text-align center
  section
    h3
      font-size (22/16)rem
      font-weight 600
      margin (25/16)rem 0 (15/16)rem
    .info-panel
      background-color #ffffff
      padding (15/16)rem (15/16)rem (10/16)rem
      border-radius (8/16)rem
      box-shadow 0 (3/16)rem (9/16)rem 0 rgba(0, 0, 0, 0.03)
      .order-goods-info
        display flex
        margin-bottom (15/16)rem
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
          .goods-quantity
            position absolute
            bottom 0
            font-size (13/16)rem
            background-color #ffffff
            width 100%
            label
              color #999999
              margin-right (10/16)rem
      dl
        display flex
        font-size (13/16)rem
        margin 0 0 (10/16)rem
        dt
          color #999999
          width (70/16)rem
          min-width (70/16)rem
          word-wrap nowrap
        dd
          margin 0
          word-break break-all
          &.goods-price
            color #ff3f0f
            font-weight bold
          &.goods-contract
            color #00a0ff
      &.remark
        dl
          display block
          dt
            width auto
            padding-top (10/16)rem
          dd
            margin-top (5/16)rem
          &:first-child
            display flex
            justify-content space-between
            dt
              padding-top 0
              color #666666
            dd
              margin-top 0
              a
                text-decoration none
                color #00a0ff
  .order-action
    display block
    width 100%
    margin (20/16)rem 0
    height (44/16)rem
    display flex
    align-items center
    justify-content center
    border-radius (4/16)rem
    border 0
    box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    font-size (17/16)rem
    color #ffffff
    &.sell-action
      background #ffffff
      color #fa5a3a
      box-shadow none
</style>
