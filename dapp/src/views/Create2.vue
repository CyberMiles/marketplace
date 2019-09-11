<template>
  <div>
    <LoadingMask v-if="loading"></LoadingMask>
    <ProductInfo2 />
  </div>
</template>
<script>
// @ is an alias to /src
import ProductInfo2 from "@/components/ProductInfo2.vue";
import { web3Pass } from "@/global.js";
import LoadingMask from "@/components/LoadingMask.vue";

export default {
  name: "create",
  components: {
    ProductInfo2,
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
