<template>
  <div class="download-wx">
    <header>
      <img @click="$router.go(-1)" class="back" src="../assets/imgs/back.svg" />
      <span class="text">CyberMiles</span>
    </header>
    <div class="download-banner">
      <a href="https://app.cybermiles.io">
        Don't have <b>CyberMiles App</b> yet? Try it now!
      </a>
    </div>
    <div class="dapp">
      <img src="../assets/imgs/logo.png" class="dapp-logo" />
      <span class="text">MarketPlace</span>
      <button @click="dappReloc" class="dapp-reloc">
        View in CyberMiles App
      </button>
    </div>
    <div class="footer">
      If you have CyberMiles App, you can view and join Dapp right away.
    </div>
    <div class="overmask" v-if="wxTip" @click="wxTip = false">
      <div class="text-group">
        <span> 1. 点击右上角菜单</span>
        <span> Click the menu button at the top right corner. </span>
      </div>
      <div class="text-group">
        <span> 2. 选择在浏览器中打开 </span>
        <span> Select open in browser. </span>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.download-wx
  position absolute
  background #f4f4f4
  height 100%
  .overmask
    background #121212
    opacity 0.7
    z-index 999
    position absolute
    height 100%
    width 100%
    top 0
    color #fff
    .text-group
      margin (40/16)rem (10/16)rem 0
      span
        font-weight 600
        display flex
        font-size (16/16)rem
        padding (10/16)rem
        opacity 1
  header
    display flex
    background #fff
    height (39/16)rem
    .back
      position absolute
      height (13/16)rem
      margin (13/16)rem
    .text
      vertical-align center
      font-weight 600
      margin auto
  .download-banner
    a
      text-decoration none
      color inherit
    height (36/18)rem
    background #03a9f4
    color #ffffff
    align-items center
    display flex
    padding (20/16)rem
  .dapp
    .dapp-logo
      height (108/16)rem
      width (108/16)rem
      margin (50/16)rem auto
      display flex
    .text
      display flex
      justify-content center
    .dapp-reloc
      border-radius (22/16)rem
      padding (13/16)rem
      display flex
      margin (10/16)rem auto
      background #32afed
      border 0
      color #fff
  .footer
    padding (15/16)rem (74/16)rem
    font-size 13px
    color #666
    text-align center
</style>

<script>
export default {
  data() {
    return {
      wxTip: false,
      config: {
        localApp: "cmtwallet://dapp?url="
      }
    };
  },
  created() {
    // alert(this.config.localApp);
    this.reDirect();
  },
  methods: {
    reDirect: function() {
      if (this.isIOS) {
        this._go(this.config.localApp + this.relocHref);
      } else if (this.isAndroid) {
        console.log("isAndroid");
        // alert(this.config.localApp + this.relocHref);
        this._tryCallApp(this.config.localApp + this.relocHref);
      }
    },
    dappReloc: function() {
      const agent = navigator.userAgent;
      if (
        agent.indexOf("iPad") != -1 ||
        agent.indexOf("iPhone") != -1 ||
        agent.indexOf("Android") != -1
      ) {
        if (this.isWx) this.wxTip = true;
        else {
          this.reDirect();
        }
      }
    },
    _tryCallApp: function(scheme) {
      var aLink = document.createElement("a");
      var body = document.body;
      aLink.href = scheme;
      body.appendChild(aLink);
      aLink.click();
    },
    _go: function(url) {
      window.location.href = url;
    }
  },
  computed: {
    UA: function() {
      return navigator.userAgent || "";
    },
    isWx: function() {
      return this.UA.match(/micromessenger/i) ? true : false;
    },
    isAndroid: function() {
      return this.UA.match(/Android/i) ? true : false;
    },
    isIOS: function() {
      return this.UA.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    relocHref: function() {
      console.log(decodeURIComponent(window.location.href.split("reloc?=")[1]))
      return decodeURIComponent(window.location.href.split("reloc?=")[1]);
    }
  }
}
</script>
