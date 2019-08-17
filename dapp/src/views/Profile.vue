<template>
  <div>
    <LoadingMask v-if="loading"></LoadingMask>
    <div class="profile">
      <div class="account">
        <h2>Account</h2>
        <div class="account-addr">
          {{ userAddr }}
          <span
            class="icon-copy"
            v-clipboard="() => userAddr"
            v-clipboard:success="copySuccess"
          >
          </span>
        </div>
      </div>
      <div class="roles-switch">
        <div
          class="role"
          :class="role === 'buy' ? 'active' : ''"
          @click="switchRole('buy')"
        >
          Buy
        </div>
        <div
          class="role"
          :class="role === 'sell' ? 'active' : ''"
          @click="switchRole('sell')"
        >
          Sell
        </div>
      </div>

      <div class="container">
        <ProfileOrders v-if="role === 'buy'" v-bind="{ userAddr: userAddr }" />
        <SellOverview v-if="role === 'sell'" v-bind="{ userAddr: userAddr }" />
      </div>

      <Footer showing="profile"></Footer>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import Clipboard from "v-clipboard";
import Toast from "@/components/Toast.vue";
import Footer from "@/components/Footer.vue";
import ProfileOrders from "@/views/ProfileOrders.vue";
import SellOverview from "@/views/SellOverview.vue";
import LoadingMask from "@/components/LoadingMask.vue";
import { web3Pass, goDebug } from "@/global.js";
import Global from "@/global.js";

Vue.use(Clipboard);
Vue.use(Toast);

export default {
  name: "profile",
  components: {
    Footer,
    ProfileOrders,
    SellOverview,
    LoadingMask
  },
  data() {
    return {
      loading: true,
      role: "buy",
      userAddr: ""
    };
  },
  created() {
    if (!web3Pass(this)) {
      return;
    } else {
      this.loading = false;
    }
    var that = this;
    if (this.$route.hash === "#sell") {
      this.role = "sell";
    }
    var checkWeb3 = function() {
      try {
        window.web3.cmt.getAccounts(function(e, address) {
          if (e) {
            goDebug({
              txhash: "null",
              callMethod: "getAccounts",
              e: e
            });
          } else {
            that.userAddr = address.toString();
          }
        });
      } catch (e) {
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3(); //immediate first run
  },
  methods: {
    copySuccess() {
      this.$toast("copied");
    },
    switchRole(role) {
      this.role = role;
      this.$router.replace("#" + role);
    }
  }
};
</script>

<style lang="stylus">
.profile
  @media screen and (min-width: 600px)
    margin 0 0 (420/16)rem
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
      display flex
      align-items center
      .icon-copy
        color rgba(255, 63, 15, 0.5)
        font-size (15/16)rem
        margin-left (5/16)rem
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
    padding 0 (15/16)rem (80/16)rem
    .end
      font-size (12/16)rem
      color #999999
      text-align center
</style>
