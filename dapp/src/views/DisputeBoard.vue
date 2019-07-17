<template>
  <div>
    <div class="unsolved">
      <h1>Current Dispute Orders</h1>
      <div v-for="order in unsolvedOrders" v-bind:key="order.id" class="order">
        <div>contract address: {{ order.contract }}</div>
        <div>buyer address: {{ order.buyer }}</div>
        <div>seller address: {{ order.seller }}</div>
        <div v-if="isDAO">
          <button @click="resolveByDAO(order, true)">buyer win</button>
          <button @click="resolveByDAO(order, false)">seller win</button>
        </div>
      </div>
    </div>
    <div class="solved">
      <h1>History Dispute Orders</h1>
      <div v-for="order in solvedOrders" v-bind:key="order.id" class="order">
        <div>contract address: {{ order.contract }}</div>
        <div>buyer address: {{ order.buyer }}</div>
        <div>buyer address: {{ order.seller }}</div>
        <div>dispute result: {{ order.status }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from "@/global.js";
import Contracts from "@/contracts.js";
import { setTimeout } from "timers";
import { queryOptions, makeQuery } from "@/global.js";
import axios from "axios";

export default {
  data() {
    return {
      isDAO: false,
      solvedOrders: [],
      unsolvedOrders: []
    };
  },
  created() {
    var that = this;
    window.web3.cmt.getAccounts(function(e, address) {
      if (!e) {
        if (address.toString().toLowerCase() == Global.DAOaddr.toLowerCase()) that.isDAO = true;
      }
    });
    axios(queryOptions(makeQuery([3]))).then(r => {
      that.unsolvedOrders.length = 0;
      console.log(r.data)
      r.data.forEach(function(item, id) {
        that.unsolvedOrders.push({
          id: id,
          contract: item.contractAddress,
          seller: item.functionData.info[8],
          buyer: item.functionData.info[9]
        });
      });
    });

    axios(queryOptions(makeQuery([4, 5]))).then(r => {
      that.solvedOrders.length = 0;
      console.log(r.data)
      r.data.forEach(function(item, id) {
        var resolvedReason = "unkown";
        if (item.functionData.buyerInfo[3] == "True") {//buyer disputed before
          if (item.functionData.info[0] == 4) { //fund goes to seller finally
            if (item.functionData.secondaryBuyerInfo[1] == 1) 
              resolvedReason = "Buyer disputed and DAO assumes seller won.";
            else if (item.functionData.secondaryBuyerInfo[1] == 2)// buyer resolve himself
              resolvedReason = "Buyer disputed and Buyer resolved himself.";
          } else if (item.functionData.info[0] == 5) {//fund goes to buyer finally
            if (item.functionData.secondaryBuyerInfo[1] == 0)
              resolvedReason = "Buyer disputed and seller refunded.";
            else if (item.functionData.secondaryBuyerInfo[1] == 1)
              resolvedReason = "Buyer disputed and DAO assumes buyer won.";
          }
          that.solvedOrders.push({
            id: id,
            contract: item.contractAddress,
            seller: item.functionData.info[8],
            buyer: item.functionData.info[9],
            status: resolvedReason
          });
        }
      });
    });
  },
  methods: {
    resolveByDAO(order, buyerWin) {
      var contract = window.web3.cmt.contract(Contracts.Listing.abi);
      var instance = contract.at(order.contract);
      console.log(buyerWin, order.contract)
      instance.resolveByDAO(
        buyerWin,
        {
          gas: "400000",
          gasPrice: 0
        },
        function(e) {
          if (!e) {
            setTimeout(function() {
              location.reload(true);
            }, 10 * 1000);
          }
        }
      );
    }
  }
};
</script>

<style lang="stylus">
.order
  padding (10/16)rem (40/16)rem
</style>
