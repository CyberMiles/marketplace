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
      <ProfileOrders v-if="role === 'buy'" />

      <div class="sell-overview" v-if="role === 'sell'"></div>
    </div>

    <Footer showing="profile"></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";
import ProfileOrders from "@/views/ProfileOrders.vue";

export default {
  name: "profile",
  components: {
    Footer,
    ProfileOrders
  },
  data() {
    return {
      role: "buy"
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
</style>
