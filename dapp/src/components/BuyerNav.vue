<template>
  <div id="buyer-nav">
    <router-link to="/">Contact Seller</router-link> |
    <router-link :to="`/buy/${contractAddr}`" v-if="status == 1"
      >Buy Now</router-link
    >
    <button v-else>Sold</button>
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
