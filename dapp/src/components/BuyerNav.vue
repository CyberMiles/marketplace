<template>
  <div class="listing-info-nav">
    <router-link class="link" to="/">Contact Seller</router-link>
    <router-link class="action" :to="`/buy/${contractAddr}`" v-if="status == 1"
      >Buy Now</router-link
    >
    <button class="link gray" v-else>Sold</button>
  </div>
</template>
<script>
export default {
  name: "BuyerNav",
  props: {
    contractAddr: String,
    status: Number
  }
};
</script>
<style lang="stylus">
.gray
  background-color #ccc !important
  color #fff
</style>
