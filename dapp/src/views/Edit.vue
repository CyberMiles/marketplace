<template>
  <ProductInfo
    edit="true"
    v-bind:contractAddr="$route.params.contractAddr"
  ></ProductInfo>
</template>

<script>
import ProductInfo from "@/components/ProductInfo.vue";

export default {
  name: "edit",
  components: {
    ProductInfo
  }
};
</script>
