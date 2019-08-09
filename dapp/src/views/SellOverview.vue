<template>
  <div class="sell-overview">
    <h3>Items</h3>
    <div class="entries">
      <router-link class="entry" to="/sell-goods/listed">
        <label>Listed</label>
        <span class="count">{{ listedN }}</span>
      </router-link>
      <router-link class="entry" to="/sell-goods/unlisted">
        <label>Unlisted</label>
        <span class="count">{{ unlistedN }}</span>
      </router-link>
      <router-link class="entry" to="/sell-goods/sold">
        <label>Sold</label>
        <span class="count">{{ soldN }}</span>
      </router-link>
    </div>

    <h3>Orders</h3>
    <div class="entries">
      <router-link class="entry" to="/sell-orders/paid">
        <label>Buyer has paid</label>
        <span class="count">{{ paidN }}</span>
      </router-link>
      <router-link class="entry" to="/sell-orders/completed">
        <label>Completed</label>
        <span class="count">{{ completedN }}</span>
      </router-link>
      <router-link class="entry" to="/sell-orders/dispute">
        <label>Dispute</label>
        <span class="count">{{ disputeN }}</span>
      </router-link>
      <router-link class="entry" to="/sell-orders/refund">
        <label>Refund to buyer</label>
        <span class="count">{{ refundN }}</span>
      </router-link>
    </div>

    <h3>Orders</h3>
    <div class="entries">
      <router-link class="entry" to="/withdraw-usdo-guide">
        <label>Withdraw USDO as dollars</label>
      </router-link>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { queryOptions, makeQuery, goDebug } from "@/global.js";

export default {
  data() {
    return {
      userAddress: "",
      listedN: "",
      unlistedN: "",
      soldN: "",
      paidN: "",
      completedN: "",
      disputeN: "",
      refundN: ""
    };
  },
  created() {
    var that = this;
    var checkWeb3 = function() {
      try {
        window.web3.cmt.getAccounts(function(e, address) {
          if (e) {
            goDebug({
              txhash: "null",
              callMethod: "getAccounts",
              e: e
            });
          } else {
            that.userAddress = address.toString();
            axios(queryOptions(makeQuery(["1"], that.userAddress))).then(r => {
              that.listedN = r.data.length;
            });
            axios(queryOptions(makeQuery(["0"], that.userAddress))).then(r => {
              that.unlistedN = r.data.length;
            });
            axios(
              queryOptions(makeQuery(["2", "3", "4", "5"], that.userAddress))
            ).then(r => {
              that.soldN = r.data.length;
            });
            axios(queryOptions(makeQuery(["2"], that.userAddress))).then(r => {
              that.paidN = r.data.length;
            });
            axios(queryOptions(makeQuery(["4"], that.userAddress))).then(r => {
              that.completedN = r.data.length;
            });
            axios(queryOptions(makeQuery(["3"], that.userAddress))).then(r => {
              that.disputeN = r.data.length;
            });
            axios(queryOptions(makeQuery(["5"], that.userAddress))).then(r => {
              that.refundN = r.data.length;
            });
          }
        });
      } catch (e) {
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3();
  }
};
</script>

<style lang="stylus">
.sell-overview
  h3
    margin (22/16)rem 0 (15/16)rem
  .entries
    background-color #ffffff
    border-radius (8/16)rem
    box-shadow 0 (3/16)rem (9/16)rem 0 rgba(0, 0, 0, 0.03)
    padding 0 (15/16)rem
    .entry
      position relative
      height (44/16)rem
      line-height (44/16)rem
      display flex
      justify-content space-between
      border-bottom solid 0.5px #e5e5e5
      font-size (15/16)rem
      text-decoration none
      &:last-child
        border 0
      &:after
        content "⌃"
        position absolute
        right 0
        color #c7c7c7
        transform rotate(90deg)
      .count
        color #c7c7c7
        margin-right (20/16)rem
</style>
