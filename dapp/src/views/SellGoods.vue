<template>
  <div class="sell-goods">
    <div class="goods-items">
      <div class="sell-goods-item" v-for="g in goods" :key="g.id">
        <div class="goods-info">
          <RespImg v-bind:src="g.image" alt="" />
          <div class="goods-price">
            <span>$ {{ g.price }}</span>
          </div>
          <div class="sold" v-if="g.status === 'sold'">
            <span>Sold</span>
          </div>
        </div>
        <div class="goods-actions">
          <div v-if="g.status === 'listed'">
            <button @click="unlist(g.id)"><span>Unlist</span></button>
            <button @click="goEdit(g.id)"><span>Edit</span></button>
          </div>
          <div v-if="g.status === 'unlisted'">
            <button @click="relist(g.id)"><span>Relist</span></button>
            <button @click="goEdit(g.id)"><span>Edit</span></button>
          </div>
          <div v-if="g.status === 'sold'">
            <button @click="reCreate(g.id)" class="long">
              <span>Relist</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="end">~ No More ~</div>
  </div>
</template>

<script>
import RespImg from "@/components/RespImg.vue";
import axios from "axios";
import { setTimeout } from "timers";
import {
  makeQuery,
  queryOptions,
  unlistHandler,
  relistHandler,
  createHandler
} from "@/global.js";
import Global from "@/global.js";
import Contracts from "@/contracts.js";

export default {
  components: {
    RespImg
  },
  data() {
    return {
      goods: [],
      userAddress: ""
    };
  },
  created() {
    var that = this;
    console.log(this.$route.params.type);
    var checkWeb3 = function() {
      try {
        window.web3.cmt.getAccounts(function(e, address) {
          if (e) {
            console.log(e);
          } else {
            that.userAddress = address.toString();
            axios(
              queryOptions(makeQuery(that.typeStatus, that.userAddress))
            ).then(r => {
              that.goods.length = 0;
              document.title = `${that.$route.params.type} (${r.data.length})`;
              r.data.forEach(function(item) {
                that.goods.push({
                  id: item.contractAddress,
                  status: that.$route.params.type,
                  image: item.functionData.getImage.split(",")[0],
                  price: (parseInt(item.functionData.info[7]) / 100).toString()
                });
              });
            });
          }
        });
      } catch (e) {
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3();
  },
  computed: {
    typeStatus: function() {
      if (this.$route.params.type === "listed") return ["1"];
      else if (this.$route.params.type == "unlisted") return ["0"];
      else return ["2", "3", "4", "5"];
    }
  },
  methods: {
    goEdit(id) {
      this.$router.push(`/edit/` + id);
    },
    unlist(id) {
      var that = this;
      var contract = window.web3.cmt.contract(Contracts.Listing.abi);
      var instance = contract.at(id);
      unlistHandler(that, instance);
    },
    relist(id) {
      var contract = window.web3.cmt.contract(Contracts.Listing.abi);
      var instance = contract.at(id);
      relistHandler(instance);
    },
    reCreate(id) {
      var that = this;
      var contract = window.web3.cmt.contract(Contracts.Listing.abi);
      var instance = contract.at(id);
      instance.info(function(e, r) {
        if (e) {
          console.log(e);
        } else {
          var newItem = {
            title: r[1],
            desc: r[2],
            tags: r[3],
            categories: "",
            imageUrls: r[6],
            contact: r[4],
            escrowPeriod: r[5],
            crc20: Global.USDaddr,
            amount: r[7]
          };
          var newContract = window.web3.cmt.contract(Contracts.Listing.abi);
          window.web3.cmt.getAccounts(function(e, addr) {
            if (e) {
              console.log(e);
            } else {
              var userAddress = addr.toString();
              var bin = Contracts.Listing.bin;
              createHandler(newContract, newItem, bin, userAddress, that);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus">
.sell-goods
  padding (15/16)rem
  .goods-items
    display flex
    flex-wrap wrap
    justify-content space-between
    .sell-goods-item
      margin-bottom (15/16)rem
      border-radius (8/16)rem
      overflow hidden
      .goods-info
        position relative
        width (165/16)rem
        height (165/16)rem
        background-color #f0f0f0
        img
          width (165/16)rem
          height (165/16)rem
        .goods-price
          display flex
          align-items center
          position absolute
          left (5/16)rem
          bottom (5/16)rem
          height (24/16)rem
          line-height 1
          padding 0 (5/16)rem
          border-radius (12/16)rem
          background-color #ff3f0f
          font-size (14/16)rem
          color #ffffff
        .sold
          position absolute
          left 0
          right 0
          top 0
          bottom 0
          background-color rgba(0, 0, 0, 0.5)
          span
            position absolute
            top 50%
            margin-top (-16/16)rem
            height (32/16)rem
            line-height (32/16)rem
            left 50%
            margin-left (-67/2/16)rem
            width (67/16)rem
            border-radius (16/16)rem
            border solid 1px rgba(255, 255, 255, 0.2)
            background-color rgba(255, 255, 255, 0.2)
            color rgba(255, 255, 255, 0.8)
            font-size (17/16)rem
            text-align center
  .goods-actions
    > div
      background-color #ffffff
      height (40/16)rem
      display flex
      padding 0 (18/16)rem
      justify-content space-between
      align-items center
      button
        width (56/16)rem
        height (24/16)rem
        border-radius (4/16)rem
        border solid 0.5px #e5e5e5
        background-color transparent
        display flex
        align-items center
        justify-content center
        &.long
          width (130/16)rem
  .end
    font-size (12/16)rem
    color #999999
    text-align center
</style>
