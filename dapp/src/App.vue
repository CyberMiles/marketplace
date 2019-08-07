<template>
  <div id="app">
    <transition-page>
      <router-view />
    </transition-page>
  </div>
</template>

<script>
import normalize from "normalize-styl";
import iconfont from "@/components/Icofont.vue";
import TransitionPage from "@/components/Transition.vue";
import mdStyle from "github-markdown-css";

export default {
  components: {
    TransitionPage
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
</style>
