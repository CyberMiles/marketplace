<template>
  <div class="footer-banner">
    <img class="logo" src="../assets/imgs/app.jpg" />
    <div class="text">
      <h3>CyberMiles App</h3>
      <p class="tip">Please use CyberMiles APP to finish your order</p>
      <a
        class="download-url"
        @mouseover="showQR = true"
        @mouseleave="showQR = false"
        href="https://app.cybermiles.io"
      >
        Download
      </a>
      <img class="qrcode" v-if="showQR" src="../assets/imgs/appQrcode.png" />
    </div>
    <div class="download">
      <a
        href="https://play.google.com/store/apps/details?id=io.cybermiles.cmtwallet"
      >
        <img src="../assets/imgs/google-play.svg"
      /></a>
      <a href="https://apps.apple.com/us/app/id1418378426"
        ><img src="../assets/imgs/app-store.svg"
      /></a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showQR: false
    };
  }
};
</script>

<style lang="stylus">
.footer-banner
  height (240/16)rem
  background #ffffff
  padding (40/16)rem (120/16)rem (100/16)rem
  width 100%
  display flex
  .logo
    height (100/16)rem
  .download
    display flex
    margin-right 0
    margin-left auto
    img
      margin (20/16)rem
  .text
    position relative
    bottom (10/16)rem
    .tip
      color #666666
    .download-url
      display block
      text-decoration none
      color #00a0ff
    .qrcode
      width (160/16)rem
      height (160/16)rem
      position absolute
      top -100px
      padding 20px
      box-shadow 0 2px 20px 0 rgba(0, 0, 0, 0.1)
      background #fff
</style>
