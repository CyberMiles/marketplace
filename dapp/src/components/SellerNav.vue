<template>
  <div id="seller-nav">
    <div v-if="status == 1">
      <button @click="unlist">Unlist</button>
    </div>
    <div v-else-if="status == relist">
      <button @click="relist">Relist</button>
    </div>
    <router-link to="/">Edit</router-link>
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
    unlist() {}
  }
};
</script>
