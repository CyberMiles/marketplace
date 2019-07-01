<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import normalize from "normalize-styl";
import iconfont from "@/components/Icofont.vue";

export default {
  components: {}
};
</script>

<style lang="stylus">
html
  font-size 16px
#app
  font-family -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #191919
  background-color #fafafa
  &, *
    box-sizing border-box
    outline none
</style>
