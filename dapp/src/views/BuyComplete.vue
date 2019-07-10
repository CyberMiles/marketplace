<template>
  <div class="empty-list">
    <img src="./../assets/imgs/success.svg" />
    <div class="text">Payment Completed</div>
    <router-link to="/">HomePage</router-link>
    <router-link :to="`/order/buy/${orderId}`">Order Details</router-link>
  </div>
</template>
<script>
export default {
  computed: {
    orderId: function() {
      console.log(this.$route.params.contractAddr);
      return this.$route.params.contractAddr;
    }
  }
};
</script>

<style lang="stylus">
.empty-list
  position absolute
  z-index -1
  top 0
  bottom 0
  left 0
  right 0
  display flex
  flex-direction column
  align-items center
  justify-content center
  img
    padding (10/16)rem
  .text
    font-size (17/16)rem
    color #191919
</style>
