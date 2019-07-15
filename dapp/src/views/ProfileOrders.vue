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
          Paid({{ paidOrders.length }})
        </a>
      </li>
      <li>
        <a
          class="status-tab"
          :class="selectedOrderStatus === 'completed' ? 'active' : ''"
          @click="selectedOrderStatus = 'completed'"
        >
          Completed({{ completedOrders.length }})
        </a>
      </li>
      <li>
        <a
          class="status-tab"
          :class="selectedOrderStatus === 'refund' ? 'active' : ''"
          @click="selectedOrderStatus = 'refund'"
        >
          Refund({{ refundOrders.length }})
        </a>
      </li>
      <li>
        <a
          class="status-tab"
          :class="selectedOrderStatus === 'dispute' ? 'active' : ''"
          @click="selectedOrderStatus = 'dispute'"
        >
          Dispute({{ disputeOrders.length }})
        </a>
      </li>
    </ul>

    <OrderCard v-for="o in sampleOrders" role="buy" :order="o" :key="o.id" />
    <div class="end">~ No More ~</div>
  </div>
</template>

<script>
import OrderCard from "@/components/OrderCard.vue";
import axios from "axios";
import { computePayment } from "@/global.js";

export default {
  name: "profileOrders",
  components: {
    OrderCard
  },
  data() {
    return {
      selectedOrderStatus: "paid",
      paidOrders: [],
      completedOrders: [],
      refundOrders: [],
      disputeOrders: [],
      sampleOrders: []
    };
  },
  props: {
    userAddr: String
  },
  created() {
    this.setOrders();
    this.sampleOrders = this.paidOrders;
  },
  watch: {
    selectedOrderStatus: function(val) {
      this.sampleOrders = this[`${val}Orders`];
    },
    userAddr: function() {
      console.log("userAddr changed");
      this.setOrders();
    }
  },
  methods: {
    setOrders() {
      if (this.userAddr == "") return;
      var that = this;
      var queryPaid = {
        query: {
          bool: {
            must: [
              {
                match: {
                  abiShaList:
                    "0xca44fb82aad28d1d2c373a2934e8bc280cd418352b2c0e077d8dd715112434f1"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.0": "2"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.9": this.userAddr
                }
              }
            ]
          }
        }
      };
      var queryCompleted = {
        query: {
          bool: {
            must: [
              {
                match: {
                  abiShaList:
                    "0xca44fb82aad28d1d2c373a2934e8bc280cd418352b2c0e077d8dd715112434f1"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.0": "4"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.9": this.userAddr
                }
              }
            ]
          }
        }
      };
      var queryRefund = {
        query: {
          bool: {
            must: [
              {
                match: {
                  abiShaList:
                    "0xca44fb82aad28d1d2c373a2934e8bc280cd418352b2c0e077d8dd715112434f1"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.0": "5"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.9": this.userAddr
                }
              }
            ]
          }
        }
      };
      var queryDispute = {
        query: {
          bool: {
            must: [
              {
                match: {
                  abiShaList:
                    "0xca44fb82aad28d1d2c373a2934e8bc280cd418352b2c0e077d8dd715112434f1"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.0": "3"
                }
              },
              {
                match: {
                  "functionDataList.0.functionData.info.9": this.userAddr
                }
              }
            ]
          }
        }
      };
      const options = query => {
        return {
          method: "POST",
          headers: { "content-type": "application/json" },
          data: JSON.stringify(query),
          url: "https://cmt-testnet.search.secondstate.io/api/es_search"
        };
      };
      axios(options(queryPaid)).then(r => {
        console.log(r.data);
        that.paidOrders.length = 0;
        r.data.forEach(function(item) {
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
      axios(options(queryCompleted)).then(r => {
        console.log(r.data);
        that.completedOrders.length = 0;
        r.data.forEach(function(item) {
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
      axios(options(queryDispute)).then(r => {
        console.log(r.data);
        that.disputeOrders.length = 0;
        r.data.forEach(function(item) {
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
      axios(options(queryRefund)).then(r => {
        console.log(r.data);
        that.refundOrders.length = 0;
        r.data.forEach(function(item) {
          var refundReason = (function() {
            if (item.functionData.buyerInfo[3] === "True") {
              if (item.functionData.secondaryBuyerInfo[1] == 0) {
                return "You disputed and seller refunded you.";
              } else if (item.functionData.secondaryBuyerInfo[1] == 1) {
                return "You disputed and DAO assume that you win.";
              }
            } else {
              return "Seller refunded you.";
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
.profile-order-list
  h3
    margin (22/16)rem 0 (15/16)rem
  .status-tabs
    margin 0 0 (20/16)rem
    padding 0
    list-style none
    display flex
    overflow-x scroll
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
