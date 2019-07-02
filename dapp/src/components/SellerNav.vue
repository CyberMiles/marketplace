<template>
  <div class="listing-info-nav">
    <button class="link" v-if="status == 1" @click="unlist">Unlist</button>
    <button class="link" v-else-if="status == relist" @click="relist">
      Relist
    </button>
    <router-link class="action" to="/">Edit</router-link>
  </div>
</template>
<script>

export default {
  name: "SellerNav",
  props: {
    contractAddr: String,
    status: Number
  },
  methods: {
    unlist() {
      this.$swal({
        html: "Hello Vue world!!!",
        width: "800px"
      });
    }
  }
};
</script>

<style lang="stylus">
.listing-info-nav
  position fixed
  bottom 0
  width 100vw
  height (50/16)rem
  display flex
  .link
    display block
    padding 0
    border 0
    width 50%
    height (50/16)rem
    line-height (50/16)rem
    background-color #ffffff
    font-weight 500
    text-align center
    text-decoration none
    font-size (17/16)rem
    box-shadow 0 -0.5px 0 0 #e5e5e5
  .action
    display block
    padding 0
    border 0
    width 50%
    height (50/16)rem
    line-height (50/16)rem
    font-size (17/16)rem
    font-weight 500
    text-align center
    text-decoration none
    color #ffffff
    box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
</style>
