<template>
  <div>
    <LoadingMask v-if="loading"></LoadingMask>
    <ProductInfo2
      edit="true"
      v-bind:contractAddr="$route.params.contractAddr"
    ></ProductInfo2>
  </div>
</template>

<script>
import ProductInfo2 from "@/components/ProductInfo2.vue";
import LoadingMask from "@/components/LoadingMask.vue";
import { web3Pass } from "@/global.js";

export default {
  name: "edit",
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
