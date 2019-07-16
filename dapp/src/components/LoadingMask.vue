<template>
  <div class="loading-mask">
    <div class="loading-effect">
      loading...
    </div>
  </div>
</template>

<style lang="stylus">
.loading-mask
  display flex
  background #efefef
  z-index 999
  position absolute
  top 0
  height 100%
  width 100%
  justify-content space-between
  align-items center
  .loading-effect
    margin 0 auto
    font-size (13/16)rem
    color #808080
</style>
