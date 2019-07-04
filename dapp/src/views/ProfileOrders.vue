<template>
  <div class="profile-order-list">
    <h3>My Orders</h3>
    <ul class="status-tabs">
      <li>
        <a
          class="status-tab"
          :class="selectedOrderStatus === 'paid' ? 'active' : ''"
          @click="selectedOrderStatus = 'paid'"
        >
          Paid(10)
        </a>
      </li>
      <li>
        <a
          class="status-tab"
          :class="selectedOrderStatus === 'completed' ? 'active' : ''"
          @click="selectedOrderStatus = 'completed'"
        >
          Completed(1)
        </a>
      </li>
      <li>
        <a
          class="status-tab"
          :class="selectedOrderStatus === 'refund' ? 'active' : ''"
          @click="selectedOrderStatus = 'refund'"
        >
          Refund(0)
        </a>
      </li>
    </ul>

    <OrderCard v-for="o in sampleOrders" :order="o" :key="o.id" />
  </div>
</template>

<script>
import OrderCard from "@/components/OrderCard.vue";

export default {
  name: "profileOrders",
  components: {
    OrderCard
  },
  data() {
    return {
      selectedOrderStatus: "paid",
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
    };
  },
  created() {
    this.sampleOrders = this.paidOrders;
  },
  watch: {
    selectedOrderStatus: function(val) {
      this.sampleOrders = this[`${val}Orders`];
    }
  }
};
</script>

<style lang="stylus">
.profile-order-list
  h3
    margin (22/16)rem 0 (15/16)rem
  .status-tabs
    margin 0 0 (20/16)rem
    padding 0
    list-style none
    display flex
    li
      margin-right (15/16)rem
      &:last-child
        margin-right 0
    .status-tab
      display block
      height (24/16)rem
      line-height (24/16)rem
      padding 0 (12/16)rem
      border-radius (12/16)rem
      font-size (13/16)rem
      color #666666
      background-color #f0f0f0
      text-decoration none
      &.active
        box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
        background-image linear-gradient(to left, #ff7777, #ff3f0f)
        color #ffffff
</style>
