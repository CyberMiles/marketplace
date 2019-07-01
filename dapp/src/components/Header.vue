<template>
  <header>
    <nav>
      <span class="icon-left-arrow"></span>
      <span class="icon-right-arrow"></span>
    </nav>
    <div class="title">
      <slot></slot>
    </div>
    <div>
      <span class="icon-close"></span>
    </div>
  </header>
</template>

<style lang="stylus">
header
  display flex
  justify-content space-between
  height (56/16)rem
  line-height (56/16)rem
  padding 0 (15/16)rem
  background-color #ffffff
  nav
    font-size 1rem
    color alpha(#191919, 0.2)
    .icon-left-arrow
      margin-right (23/16)rem
  .icon-close
    font-size 0.8rem
    color alpha(#191919, 0.8)
  .title
    font-size (17/16)rem
    font-weight normal
    margin 0
</style>
