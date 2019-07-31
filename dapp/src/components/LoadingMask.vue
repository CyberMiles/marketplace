<template>
  <div class="loading-mask">
    <div class="loading-effect">
      <div class="circ"></div>
      <div class="text">loading...</div>
    </div>
  </div>
</template>

<style lang="stylus">
@keyframes spin
  100%
    -webkit-transform rotate(360deg)
    transform rotate(360deg)
.loading-mask
  display flex
  background #efefef
  z-index 999
  position fixed
  top 0
  height 100%
  width 100%
  justify-content space-between
  align-items center
  .loading-effect
    margin 0 auto
    .circ
      margin 0 auto
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: inline-block;
      background-color: #efefef;
      border-top: 3px solid transparent;
      border-left: 3px solid gray;
      border-right: 3px solid gray;
      border-bottom: 3px solid gray;
      animation spin 1.5s linear infinite
    .text
      font-size (16/16)rem
      color #808080
      padding-top (30/16)rem
</style>
