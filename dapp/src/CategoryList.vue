<template>
  <div id="app">
    <div class="pc-header">
      <img src="./assets/logo.png" class="logo" />
    </div>
    <slot></slot>
    <Category/>
  </div>
</template>

<script>
import normalize from "normalize-styl";
import Category from "@/views/Category.vue";

export default {
  components: {
    Category
  }
};
</script>

<style lang="stylus">
html
  font-size 16px
  color #191919
  background-color #fafafa
  a
    color #191919
#app
  font-family -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  &, *
    box-sizing border-box
    outline none
  .pc-header
    .logo
      padding (10/16)rem 0
      width 160px
      min-height 48px
</style>
