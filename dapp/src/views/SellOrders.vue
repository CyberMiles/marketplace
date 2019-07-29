<template>
  <div class="sell-orders">
    <OrderCard v-for="o in sampleOrders" role="sell" :order="o" :key="o.id" />
    <div class="end">~ No More ~</div>
    <Footer showing="profile"></Footer>
  </div>
</template>

<script>
import OrderCard from "@/components/OrderCard.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import { computePayment, compare, makeQuery, queryOptions } from "@/global.js";

export default {
  name: "sellOrders",
  components: {
    OrderCard,
    Footer
  },
  data() {
    return {
      paidOrders: [],
      completedOrders: [],
      refundOrders: [],
      disputeOrders: [],
      sampleOrders: [],
      userAddr: ""
    };
  },
  created() {
    var that = this;
    var checkWeb3 = function() {
      try {
        window.web3.cmt.getAccounts(function(e, address) {
          if (e) {
            console.log(e);
          } else {
            that.userAddr = address.toString();
          }
        });
      } catch (e) {
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3(); //immediate first run
    this.setOrders();
    this.sampleOrders = this[`${this.$route.params.type}Orders`];
  },
  watch: {
    userAddr: function() {
      this.setOrders();
    },
    sampleOrders: function() {
      document.title = `${this.$route.params.type} (${
        this.sampleOrders.length
      })`;
    }
  },
  methods: {
    setOrders() {
      if (this.userAddr == "") return;
      var that = this;
      var queryPaid = makeQuery([2], this.userAddr);
      var queryCompleted = makeQuery([4], this.userAddr);
      var queryRefund = makeQuery([5], this.userAddr);
      var queryDispute = makeQuery([3], this.userAddr);

      axios(queryOptions(queryPaid)).then(r => {
        that.paidOrders.length = 0;
        r.data
          .sort(compare("functionData.buyerInfo.1"))
          .reverse()
          .forEach(function(item) {
            that.paidOrders.push({
              id: item.contractAddress,
              status: "paid",
              goods: {
                image: item.functionData.getImage.split(",")[0],
                title: item.functionData.info[1],
                price: (parseInt(item.functionData.info[7]) / 100).toString()
              },
              time:
                1000 * parseInt(item.functionData.buyerInfo[1]) +
                1000 * parseInt(item.functionData.info[5]),
              payment: computePayment(item),
              sellerContact: item.functionData.info[4],
              buyerContact: item.functionData.buyerInfo[6]
            });
          });
      });
      axios(queryOptions(queryCompleted)).then(r => {
        console.log(r.data);
        that.completedOrders.length = 0;
        r.data
          .sort(compare("functionData.buyerInfo.1"))
          .reverse()
          .forEach(function(item) {
            that.completedOrders.push({
              id: item.contractAddress,
              status: "completed",
              goods: {
                image: item.functionData.getImage.split(",")[0],
                title: item.functionData.info[1],
                price: (parseInt(item.functionData.info[7]) / 100).toString()
              },
              contract: item.contractAddress,
              payment: computePayment(item)
            });
          });
      });
      axios(queryOptions(queryDispute)).then(r => {
        console.log(r.data);
        that.disputeOrders.length = 0;
        r.data
          .sort(compare("functionData.buyerInfo.1"))
          .reverse()
          .forEach(function(item) {
            that.disputeOrders.push({
              id: item.contractAddress,
              status: "dispute",
              goods: {
                image: item.functionData.getImage.split(",")[0],
                title: item.functionData.info[1],
                price: (parseInt(item.functionData.info[7]) / 100).toString()
              },
              disputeReason: "Dispute.",
              payment: computePayment(item)
            });
          });
      });
      axios(queryOptions(queryRefund)).then(r => {
        console.log(r.data);
        that.refundOrders.length = 0;
        r.data
          .sort(compare("functionData.buyerInfo.1"))
          .reverse()
          .forEach(function(item) {
            var refundReason = (function() {
              if (item.functionData.buyerInfo[3] === "True") {
                if (item.functionData.secondaryBuyerInfo[1] == 0) {
                  return "Buyer disputed and you refunded.";
                } else if (item.functionData.secondaryBuyerInfo[1] == 1) {
                  return "Buyer disputed and DAO assumes buyer won.";
                }
              } else {
                return "You refunded.";
              }
            })();
            that.refundOrders.push({
              id: item.contractAddress,
              status: "refund",
              goods: {
                image: item.functionData.getImage.split(",")[0],
                title: item.functionData.info[1],
                price: (parseInt(item.functionData.info[7]) / 100).toString()
              },
              refundAmount: (
                parseInt(item.functionData.info[7]) / 100
              ).toString(),
              refundReason: refundReason,
              payment: computePayment(item)
            });
          });
      });
    }
  }
};
</script>

<style lang="stylus">
.sell-orders
  padding (15/16)rem (15/16)rem (80/16)rem
  .end
    font-size (12/16)rem
    color #999999
    text-align center
</style>
