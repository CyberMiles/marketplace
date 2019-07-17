<template>
  <div class="processing-mask">
    <div class="processing-effect">
      <div class="circ"></div>
      <div class="text">Processing...</div>
    </div>
  </div>
</template>

<style lang="stylus">
@keyframes spin
  100%
    -webkit-transform rotate(360deg)
    transform rotate(360deg)
.processing-mask
  display flex
  background #efefef
  z-index 999
  opacity 0.8
  position fixed
  top 0
  height 100%
  width 100%
  align-items center
  .processing-effect
    margin 0 auto
    .circ
      margin 0 auto
      border-radius: 50%;
      width: 50px;
      height: 50px;
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
