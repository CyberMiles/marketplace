<template>
  <div class="order-detail">
    <div class="order-status">- {{ order.status }} -</div>
    <section>
      <h3>Goods Info</h3>
      <div class="info-panel">
        <div class="order-goods-info">
          <div class="goods-img">
            <RespImg v-bind:src="order.goods.image" alt="" />
          </div>
          <div class="goods-desc">
            <div class="goods-title">{{ order.goods.title }}</div>
            <!-- <div class="goods-quantity"><label>Quantity</label>x1</div> -->
          </div>
        </div>
        <dl>
          <dt>Payment</dt>
          <dd class="goods-price">{{ order.buyer.payment }}</dd>
        </dl>
        <dl>
          <dt>Contract</dt>
          <dd class="goods-contract">
            <a
              v-bind:href="'https://www.cmttracking.io/address/' + contractAddr"
            >
              {{ contractAddr }}
            </a>
          </dd>
        </dl>
      </div>
    </section>

    <section v-if="order.status === 'refund'">
      <h3>Refund</h3>
      <div class="info-panel">
        <dl>
          <dt>Refund Amount</dt>
          <dd class="goods-price">{{ order.buyer.payment }}</dd>
        </dl>
        <dl>
          <dt>Refund Reason</dt>
          <dd>{{ refundReason }}</dd>
        </dl>
      </div>
    </section>

    <section>
      <h3>Buyer Info</h3>
      <div class="info-panel">
        <dl>
          <dt>Address</dt>
          <dd>{{ order.buyer.addr }}</dd>
        </dl>
        <dl>
          <dt>Contact</dt>
          <dd>{{ order.buyer.contact }}</dd>
        </dl>
        <dl>
          <dt>Payment Date</dt>
          <dd>{{ order.buyer.paymentDate }}</dd>
        </dl>
        <dl>
          <dt>Remark</dt>
          <dd>{{ order.buyer.remark }}</dd>
        </dl>
      </div>
    </section>

    <section>
      <h3>Seller Info</h3>
      <div class="info-panel">
        <dl>
          <dt>Address</dt>
          <dd>{{ order.seller.addr }}</dd>
        </dl>
        <dl>
          <dt>Contact</dt>
          <dd>{{ order.seller.contact }}</dd>
        </dl>
      </div>
    </section>

    <section>
      <h3>Remark</h3>
      <div class="info-panel remark">
        <dl>
          <dt>Remark</dt>
          <dd><a @click="remark">Add New Remark</a></dd>
        </dl>
        <dl v-for="msg in sortedMessageBoard" v-bind:key="msg.id">
          <dt>{{ recognizeSpeaker(msg.party) }}, {{ msg.time }}</dt>
          <dd>{{ msg.words }}</dd>
        </dl>
      </div>
    </section>

    <button
      class="order-action"
      v-if="order.status === 'paid' && role === 'buy'"
      @click="closeByBuyer"
    >
      <span>Confirm Receipt</span>
    </button>
    <button
      class="order-action sell-action"
      v-if="
        (order.status === 'paid' || order.status === 'dispute') &&
          role === 'sell'
      "
      @click="refund"
    >
      <span>Cancel Order</span>
    </button>
    <button
      class="order-action sell-action"
      v-if="order.status === 'paid' && role === 'sell' && timeisup"
      @click="closeBySeller"
    >
      <span>Receive Fund</span>
    </button>
    <button
      class="order-action sell-action"
      v-if="order.status === 'paid' && role === 'buy' && !timeisup"
      @click="dispute"
    >
      <span>Dispute</span>
    </button>
    <div style="text-align:center;margin-top:20px;">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/profile">Profile</router-link>
    </div>
  </div>
</template>

<script>
import RespImg from "@/components/RespImg.vue";
import Contracts from "@/contracts.js";
import Global from "@/global.js";
import {
  closeByBuyerHandler,
  closeBySellerHandler,
  refundHandler,
  disputeHandler,
  compare
} from "@/global.js";
import { setTimeout } from "timers";

export default {
  components: {
    RespImg
  },
  data() {
    return {
      role: "",
      contractAddr: "",
      instance: null,
      order: {
        status: "",
        goods: {
          image: "",
          title: ""
        },
        buyer: {
          addr: "",
          payment: "",
          contact: "",
          disputed: false,
          closedReason: ""
        },
        seller: {
          addr: "",
          contact: ""
        },
        escrow_time: ""
      },
      messageBoard: []
    };
  },
  created() {
    this.role = this.$route.params.role;
    var contract_address = this.$route.params.orderId;
    this.contractAddr = contract_address;
    var that = this;
    var instance = "";
    var checkWeb3 = function() {
      var userAddress = "";
      try {
        if (!window.web3.isAddress(contract_address)) {
          that.$router.push(`/`);
        }
        window.web3.cmt.getAccounts(function(e, address) {
          if (e) {
            console.log(e);
          } else {
            // This method should return much faster than network methods
            userAddress = address.toString();
          }
        });

        var contract = window.web3.cmt.contract(Contracts.Listing.abi);
        instance = contract.at(that.contractAddr);
        that.instance = instance;
        instance.info(function(e, r) {
          if (e) {
            console.log(e);
            that.$router.push(`/`);
          } else {
            if (r[0] == 2) that.order.status = "paid";
            else if (r[0] == 3) that.order.status = "dispute";
            else if (r[0] == 4) that.order.status = "completed";
            else if (r[0] == 5) {
              that.order.status = "refund";
            }
            that.order.goods = {
              image: r[6].split(",")[0],
              title: r[1]
            };
            that.order.seller = {
              addr: r[8],
              contact: r[4]
            };
            that.order.escrow_time = parseInt(r[5]);
          }
          if (that.role == "sell" && that.order.seller.addr != userAddress) {
            that.$router.push(`/listing/${that.contractAddr}`);
          }
        });
        instance.buyerInfo(function(e, b_r) {
          if (e) {
            console.log(e);
          } else {
            var unit = "";
            var amount = "";
            if (b_r[8] == Global.USDaddr) {
              unit = Global.USDunit;
              amount = (parseInt(b_r[9]) / 100).toString();
            } else if (b_r[8] == "0x0000000000000000000000000000000000000000") {
              unit = "CMT";
              amount = window.web3.fromWei(b_r[9]);
            }
            that.order.buyer = {
              addr: b_r[0],
              payment: amount.toString() + " " + unit,
              paymentDate: new Date(1000 * b_r[1]),
              contact: b_r[6],
              remark: b_r[7],
              disputed: b_r[3],
              closedReason: that.order.buyer.closedReason
            };
          }
          if (that.role == "buy" && that.order.buyer.addr != userAddress) {
            that.$router.push(`/listing/${that.contractAddr}`);
          }
        });
        instance.secondaryBuyerInfo(function(e, s_r) {
          if (e) {
            console.log(e);
          } else {
            that.order.buyer.closedReason = s_r[1];
          }
        });
        instance.getMessagesCount(function(e, r) {
          if (e) {
            console.log(e);
          } else {
            for (let i = 0; i < r; i++) {
              instance.showMessageBoard(i, function(e, msg) {
                if (e) {
                  console.log(e);
                } else {
                  that.messageBoard.push({
                    id: i,
                    party: msg[0],
                    time: new Date(1000 * msg[1]).toLocaleString(),
                    words: msg[2]
                  });
                }
              });
            }
          }
        });
      } catch (e) {
        console.log("wait");
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3();
    this.$ga.page("/order");
  },
  computed: {
    refundReason: function() {
      if (this.order.buyer.disputed) {
        if (this.order.buyer.closedReason == 0) {
          return this.role == "sell"
            ? "Buyer disputed and you refunded."
            : "You disputed and seller refunded you.";
        } else if (this.order.buyer.closedReason == 1) {
          return this.role == "sell"
            ? "Buyer disputed and DAO assumes buyer won."
            : "You disputed and DAO assume that you win.";
        } else {
          return "empty";
        }
      } else {
        return this.role == "sell" ? "You refunded." : "Seller refunded you.";
      }
    },
    timeisup: function() {
      return (
        this.order.buyer.paymentDate != null &&
        this.order.escrow_time + this.order.buyer.paymentDate.getTime() / 1000 <
          new Date().getTime() / 1000
      );
    },
    sortedMessageBoard: function() {
      return this.messageBoard.slice(0).sort(compare("id"));
    }
  },
  methods: {
    closeByBuyer() {
      closeByBuyerHandler(this.instance);
    },
    closeBySeller() {
      closeBySellerHandler(this.instance);
    },
    refund() {
      refundHandler(this.instance);
    },
    dispute() {
      disputeHandler(this.instance);
    },
    recognizeSpeaker: function(addr) {
      var speaker = addr;
      if (addr == this.order.seller.addr) speaker = "seller";
      else if (addr == this.order.buyer.addr) speaker = "buyer";
      return speaker;
    },
    async remark() {
      this.$router.push(`/remark/${this.contractAddr}`);
    }
  }
};
</script>

<style lang="stylus">
.order-detail
  padding (20/16)rem (15/16)rem
  .order-status
    font-size (18/16)rem
    font-weight 500
    text-transform capitalize
    text-align center
  section
    h3
      font-size (22/16)rem
      font-weight 600
      margin (25/16)rem 0 (15/16)rem
    .info-panel
      background-color #ffffff
      padding (15/16)rem (15/16)rem (10/16)rem
      border-radius (8/16)rem
      box-shadow 0 (3/16)rem (9/16)rem 0 rgba(0, 0, 0, 0.03)
      .order-goods-info
        display flex
        margin-bottom (15/16)rem
        .goods-img
          width (60/16)rem
          min-width (60/16)rem
          height (60/16)rem
          margin-right (10/16)rem
          border-radius (8/16)rem
          background-color #e5e5e5
          overflow hidden
          img
            width (60/16)rem
        .goods-desc
          height (60/16)rem
          overflow hidden
          position relative
          .goods-title
            font-size (15/16)rem
            line-height 1.4
          .goods-quantity
            position absolute
            bottom 0
            font-size (13/16)rem
            background-color #ffffff
            width 100%
            label
              color #999999
              margin-right (10/16)rem
      dl
        display flex
        font-size (13/16)rem
        margin 0 0 (10/16)rem
        dt
          color #999999
          width (70/16)rem
          min-width (70/16)rem
          word-wrap nowrap
        dd
          margin 0
          word-break break-all
          &.goods-price
            color #ff3f0f
            font-weight bold
          &.goods-contract
            a
              text-decoration none
              color #00a0ff
      &.remark
        dl
          display block
          dt
            width auto
            padding-top (10/16)rem
          dd
            margin-top (5/16)rem
          &:first-child
            display flex
            justify-content space-between
            dt
              padding-top 0
              color #666666
            dd
              margin-top 0
              a
                text-decoration none
                color #00a0ff
  .order-action
    display block
    width 100%
    margin (20/16)rem 0
    height (44/16)rem
    display flex
    align-items center
    justify-content center
    border-radius (4/16)rem
    border 0
    box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    font-size (17/16)rem
    color #ffffff
    &.sell-action
      background #ffffff
      color #fa5a3a
      box-shadow none
</style>
