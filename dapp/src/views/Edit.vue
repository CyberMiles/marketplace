<template>
  <div>
    <LoadingMask v-if="loading"></LoadingMask>
    <ProductInfo
      edit="true"
      v-bind:contractAddr="$route.params.contractAddr"
    ></ProductInfo>
  </div>
</template>

<script>
import ProductInfo from "@/components/ProductInfo.vue";
import LoadingMask from "@/components/LoadingMask.vue";
import { web3Pass } from "@/global.js";

export default {
  name: "edit",
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
