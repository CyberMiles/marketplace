<template>
  <footer>
    <div class="base-nav" v-if="hasWeb3 || _isMobile">
      <router-link
        class="entry"
        :class="showing === 'home' || !showing ? 'active' : ''"
        to="/"
      >
        <span class="icon-home"></span>
        Home
      </router-link>
      <a
        class="entry"
        :class="showing === 'profile' ? 'active' : ''"
        @click="goProfile"
      >
        <span class="icon-profile"></span>
        Profile
      </a>
      <button class="new-btn" @click="goCreate">
        <span class="plus-icon"></span>
      </button>
    </div>
    <DownloadBanner v-if="!_isMobile"></DownloadBanner>
  </footer>
</template>

<script>
import DownloadBanner from "@/components/DownloadBanner.vue";
import Global from "@/global.js";
import { web3Pass } from "@/global.js";

export default {
  props: ["showing"],
  components: {
    DownloadBanner
  },
  data() {
    return {
      hasWeb3: false
    };
  },
  created() {
    var that = this;
    setTimeout(function() {
      try {
        window.web3.cmt;
        if (window.web3.currentProvider.host !== Global.HttpProvider)
          that.hasWeb3 = true;
      } catch (e) {
        console.log("fail");
      }
    }, 500);
  },
  methods: {
    goCreate() {
      if (web3Pass(this)) this.$router.push("/create");
    },
    goProfile() {
      if (web3Pass(this)) this.$router.push("/profile");
    }
  },
  computed: {
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
  }
};
</script>

<style lang="stylus">
footer
  position fixed
  bottom 0
  z-index 99
  width 100%
  .base-nav
    display flex
    justify-content space-around
    height (49/16)rem
    box-shadow 0 -0.5px 0 0 #e5e5e5;
    background-color rgba(250, 250, 250, 0.9);
    .entry
      position relative
      height (49/16)rem
      padding-top (34/16)rem
      width (49/16)rem
      text-align center
      text-decoration none
      font-size (10/16)rem
      color #999999
      [class^="icon-"]
        font-size: 1.8rem;
        position: absolute;
        top: 0.3rem;
        left: 50%;
        margin-left: -0.9rem;
        color #c7c7c7
      &.active
        color #ff3f0f
        [class^="icon-"]
          background-image -webkit-linear-gradient(right, #ff7777, #ff3f0f)
          -webkit-background-clip text
          -webkit-text-fill-color transparent
    .new-btn
      position absolute
      left 50%
      margin-left (-22/16)rem
      top (-22/16)rem
      width (44/16)rem
      height (44/16)rem
      border 0
      border-radius 50%
      box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
      background-image linear-gradient(to left, #ff7777, #ff3f0f)
      .plus-icon
        position absolute
        top 50%
        margin-top (-2.1/2/16)rem
        left 50%
        margin-left (-16.9/2/16)rem
        width (16.9/16)rem
        height (2.1/16)rem
        background-color #fff
        &:after
          content ""
          position absolute
          top 50%
          margin-top (-16.9/2/16)rem
          left 50%
          margin-left (-2.1/2/16)rem
          width (2.1/16)rem
          height (16.9/16)rem
          background-color #fff
</style>
