<template>
  <footer>
    <a class="entry active" href="">
      <span class="icon-home"></span>
      Home
    </a>
    <a class="entry" href="">
      <span class="icon-profile"></span>
      Profile
    </a>
    <button class="new-btn" @click="goCreate">
      <span class="plus-icon"></span>
    </button>
  </footer>
</template>

<script>
export default {
  methods: {
    goCreate() {
      this.$router.push("/create");
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
