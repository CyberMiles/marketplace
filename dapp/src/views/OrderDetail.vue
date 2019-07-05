<template>
  <div class="order-detail">
    <div class="order-status">{{ order.status }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: "",
      order: {
        id: "2",
        status: "paid",
        goods: {
          image:
            "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
          title: "There is a kind of beauty in imperfection",
          price: "11"
        },
        time: 1562147586285
      },
    }
  },
  created() {
    this.role = this.$route.params.role;
  }
}
</script>

<style lang="stylus">
.order-detail
  padding (20/16)rem (15/16)rem
</style>
