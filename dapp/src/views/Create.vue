<template>
  <div>
    <LoadingMask v-if="loading"></LoadingMask>
    <ProductInfo />
  </div>
</template>
<script>
// @ is an alias to /src
import ProductInfo from "@/components/ProductInfo.vue";
import { web3Pass } from "@/global.js";
import LoadingMask from "@/components/LoadingMask.vue";

export default {
  name: "create",
  components: {
    ProductInfo,
    LoadingMask
  },
  data() {
    return {
      loading: true
    };
  },
  created() {
    if (!web3Pass(this)) {
      return;
    } else {
      this.loading = false;
    }
  }
};
</script>
