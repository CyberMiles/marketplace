<template>
  <div id="seller-nav">
    <div v-if="status == 1">
      <button @click="unlist">Unlist</button>
      <router-link to="/">Edit</router-link>
    </div>
    <div v-else-if="status == 0">
      <button @click="relist">Relist</button>
      <router-link to="/">Edit</router-link>
    </div>
    
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
