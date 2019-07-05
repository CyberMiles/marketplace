<template>
  <div class="sell-orders">
    <OrderCard v-for="o in sampleOrders" role="sell" :order="o" :key="o.id" />
    <div class="end">~ No More ~</div>
    <Footer></Footer>
  </div>
</template>

<script>
import OrderCard from "@/components/OrderCard.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "sellOrders",
  components: {
    OrderCard,
    Footer
  },
  data() {
    return {
      paidOrders: [
        {
          id: "1",
          status: "paid",
          goods: {
            image:
              "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
            title: "There is a kind of beauty in imperfection",
            price: "11"
          },
          time: 1562147586285
        },
        {
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
        {
          id: "3",
          status: "paid",
          goods: {
            image:
              "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
            title: "There is a kind of beauty in imperfection",
            price: "11"
          },
          time: 1562147586285
        },
        {
          id: "4",
          status: "paid",
          goods: {
            image:
              "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
            title: "There is a kind of beauty in imperfection",
            price: "11"
          },
          time: 1562147586285
        }
      ],
      completedOrders: [
        {
          id: "1",
          status: "completed",
          goods: {
            image:
              "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
            title: "There is a kind of beauty in imperfection",
            price: "11"
          },
          time: 1562147586285,
          contract: "0xa3f1e99c46d1d7e6cc96f71b6116cee8160fa4d3"
        }
      ],
      refundOrders: [
        {
          id: "1",
          status: "refund",
          goods: {
            image:
              "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg",
            title: "There is a kind of beauty in imperfection",
            price: "11"
          },
          time: 1562147586285,
          refundAmount: "11",
          refundReason: "Seller has cancelled order"
        }
      ],
      sampleOrders: []
    }
  },
  created() {
    this.sampleOrders = this[`${this.$route.params.type}Orders`];
  }
}
</script>

<style lang="stylus">
.sell-orders
  padding (15/16)rem (15/16)rem (80/16)rem
  .end
    font-size (12/16)rem
    color #999999
    text-align center
</style>
