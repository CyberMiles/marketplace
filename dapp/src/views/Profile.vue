<template>
  <div class="profile">
    <div class="account">
      <h2>Account</h2>
      <div class="account-addr">x07fg204fg80v02239f239f8hc3333999</div>
    </div>
    <div class="roles-switch">
      <div
        class="role"
        :class="role === 'buy' ? 'active' : ''"
        @click="role = 'buy'"
      >
        Buy
      </div>
      <div
        class="role"
        :class="role === 'sell' ? 'active' : ''"
        @click="role = 'sell'"
      >
        Sell
      </div>
    </div>

    <div class="container">
      <div class="order-list" v-if="role === 'buy'">
        <h3>My Orders</h3>
        <ul class="status-tabs">
          <li>
            <a
              href="/"
              class="status-tab"
              :class="selectedOrderStatus === 'paid' ? 'active' : ''"
            >
              Paid(10)
            </a>
          </li>
          <li>
            <a
              href="/"
              class="status-tab"
              :class="selectedOrderStatus === 'completed' ? 'active' : ''"
            >
              Completed(1)
            </a>
          </li>
          <li>
            <a
              href="/"
              class="status-tab"
              :class="selectedOrderStatus === 'refund' ? 'active' : ''"
            >
              Refund(0)
            </a>
          </li>
        </ul>

        <OrderCard :order="sampleOrder" />
      </div>

      <div class="sell-overview" v-if="role === 'sell'"></div>
    </div>

    <Footer showing="profile"></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";
import OrderCard from "@/components/OrderCard.vue";

export default {
  name: "home",
  components: {
    Footer,
    OrderCard
  },
  data() {
    return {
      role: "buy",
      selectedOrderStatus: "paid",
      sampleOrder: {
        status: "paid",
        goods: {
          image:
            "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
          title: "There is a kind of beauty in imperfection and you will like",
          price: "11"
        },
        time: 1562147586285
      }
    };
  }
};
</script>

<style lang="stylus">
.profile
  .account
    background-color #ffffff
    height (57/16)rem
    display flex
    flex-direction column
    align-items center
    justify-content center
    h2
      margin 0 0 (3/16)rem
      font-size (17/16)rem
      font-weight 500
    .account-addr
      font-size (12/16)rem
  .roles-switch
    background-color #ffffff
    box-shadow 0 0.5px 0 0 #e5e5e5
    height (44/16)rem
    display flex
    justify-content space-around
    align-items center
    .role
      position relative
      font-size (15/16)rem
      color #999999
      height (25/16)rem
      &.active
        color #191919
        font-weight bold
        &:after
          content ""
          position absolute
          bottom 0
          left 50%
          margin-left (-10/16)rem
          width (20/16)rem
          height (3/16)rem
          border-radius (2/16)rem
          background-color #ff3f0f

  .container
    padding 0 (15/16)rem (60/16)rem
    h3
      margin (22/16)rem 0 (15/16)rem

  .status-tabs
    margin 0 0 (20/16)rem
    padding 0
    list-style none
    display flex
    li
      margin-right (15/16)rem
      &:last-child
        margin-right 0
    .status-tab
      display block
      height (24/16)rem
      line-height (24/16)rem
      padding 0 (12/16)rem
      border-radius (12/16)rem
      font-size (13/16)rem
      color #666666
      background-color #f0f0f0
      text-decoration none
      &.active
        box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
        background-image linear-gradient(to left, #ff7777, #ff3f0f)
        color #ffffff
</style>
