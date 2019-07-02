<template>
<div class="create">
    <ProductInfo/>
</div>
</template>
<script>
// @ is an alias to /src
import ProductInfo from "@/components/ProductInfo.vue";

export default {
  name: "create",
  components: {
    ProductInfo
  }
};
</script>
<style lang="stylus">
.create
  background-color: #fafafa;
</style>
