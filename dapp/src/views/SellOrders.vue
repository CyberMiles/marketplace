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
                  "functionDataList.0.functionData.info.8": this.userAddr
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
                  "functionDataList.0.functionData.info.8": this.userAddr
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
                  "functionDataList.0.functionData.info.8": this.userAddr
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
                  "functionDataList.0.functionData.info.8": this.userAddr
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
              1000 * parseInt(item.functionData.info[5])
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
            contract: item.contractAddress
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
            disputeReason: "Dispute."
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
            refundReason: refundReason
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
