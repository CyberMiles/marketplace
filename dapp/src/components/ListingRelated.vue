<template>
  <div v-if="ProductInfo && loaded === 1 + ProductInfo.tags.length" class="listing-related">
    <div class="related-list-switch">
      <div class="list-switch" :class="active === 'related' ? 'active' : ''" @click="active = 'related'">Related</div>
      <div class="list-switch" :class="active === 'sellers' ? 'active' : ''" @click="active = 'sellers'">Seller's Listing</div>
    </div>
    <div v-if="active === 'related'" class="goods-list">
      <div v-for="good in relatedList" :key="good.key" class="good-container">
        <GoodsListItem
          v-bind="{
            contractAddr: good.contractAddr,
            title: good.title
          }"
          :sold="good.sold ? true : ``"
        >
          <RespImg v-bind:src="good.image" alt="" division="2" />
          <template v-slot:price>
            ${{ good.price }}
          </template>
        </GoodsListItem>
      </div>
      <div
        v-for="i in Array.from(
          {
            length: 4
          },
          (x, i) => i
        )"
        :key="parseInt(i)"
        class="good-container stuff"
      ></div>
      <div v-if="relatedList.length === 0" class="empty">~ Empty ~</div>
    </div>
    <div v-if="active === 'sellers'" class="goods-list">
      <div v-for="good in sellerList" :key="good.key" class="good-container">
        <GoodsListItem
          v-bind="{
            contractAddr: good.contractAddr,
            title: good.title
          }"
          :sold="good.sold ? true : ``"
        >
          <RespImg v-bind:src="good.image" alt="" division="2" />
          <template v-slot:price>
            ${{ good.price }}
          </template>
        </GoodsListItem>
      </div>
      <div
        v-for="i in Array.from(
          {
            length: 4
          },
          (x, i) => i
        )"
        :key="parseInt(i)"
        class="good-container stuff"
      ></div>
      <div v-if="sellerList.length === 0" class="empty">~ Empty ~</div>
    </div>
  </div>
</template>

<script>
import GoodsListItem from "@/components/GoodsListItem.vue";
import RespImg from "@/components/RespImg.vue";
import axios from "axios";
import Global from "@/global.js";
import { queryOptions, makeQuery, compare } from "@/global.js";

const TagQueryTemplate = JSON.stringify({
  query: {
    bool: {
      must: [
        {
          bool: {
            should: [
              {
                match: {
                  "functionDataList.0.functionData.info.0": "1"
                }
              }
            ]
          }
        },
        {
          match: {
            abiShaList: Global.abiShaList
          }
        },
        {
          match_phrase: {
            "functionDataList.0.functionData.info.3": "{tag}"
          }
        }
      ]
    }
  }
});

export default {
  name: "ListingRelated",
  props: ["ProductInfo"],
  components: {
    GoodsListItem,
    RespImg,
  },
  data() {
    return {
      loaded: 0,
      active: "related",
      relatedList: [],
      sellerList: [],
      currentContractAddr: ""
    };
  },
  methods: {
    loadRelated() {
      this.currentContractAddr = this.$route.params.contractAddr;
      const tags = this.ProductInfo.tags;
      this.relatedList = [];
      tags.forEach(t => {
        this.queryRelated(JSON.parse(TagQueryTemplate.replace('{tag}', t)))
      });
    },
    queryRelated(dsl) {
      axios(queryOptions(dsl)).then(r => {
        var sortedData = r.data
          .sort(compare("blockNumber"))
          .reverse()
          .filter(obj => {
            //remove those whose usd price is 0 or the img url is empty or 
            if (
              // filter current goods
              obj.contractAddress !== this.currentContractAddr &&
              obj.functionData.info[7] != 0 &&
              obj.functionData.info[6] != "" &&
              obj.functionData.info[0] != 0 &&
              Global.blackAddrs
                .map(o => o.toLowerCase())
                .indexOf(obj.contractAddress.toLowerCase()) === -1 &&
              Global.blackAddrs
                .map(o => o.toLowerCase())
                .indexOf(obj.functionData.info[8].toLowerCase()) === -1
            )
              return obj;
          });
        sortedData.forEach(item => {
          this.relatedList.push({
            blkNumber: item.blockNumber,
            image: item.functionData.info[6].split(",")[0],
            price: (parseInt(item.functionData.info[7]) / 100).toString(),
            contractAddr: item.contractAddress,
            title: item.functionData.info[1],
            sold: item.functionData.info[0] == 1 ? false : true
          });
        });
        this.loaded++;
      });
    },
    loadSellers() {
      this.sellerList = [];
      axios(
        queryOptions(makeQuery(["1"], this.ProductInfo.seller))
      ).then(r => {
        r.data
          .sort(compare("blockNumber"))
          .reverse()
          .filter(obj => {
            //remove those whose usd price is 0 or the img url is empty or 
            if (
              // filter current goods
              obj.contractAddress !== this.currentContractAddr &&
              obj.functionData.info[7] != 0 &&
              obj.functionData.info[6] != "" &&
              obj.functionData.info[0] != 0 &&
              Global.blackAddrs
                .map(o => o.toLowerCase())
                .indexOf(obj.contractAddress.toLowerCase()) === -1 &&
              Global.blackAddrs
                .map(o => o.toLowerCase())
                .indexOf(obj.functionData.info[8].toLowerCase()) === -1
            )
              return obj;
          })
          .forEach(item => {
            this.sellerList.push({
              blkNumber: item.blockNumber,
              image: item.functionData.info[6].split(",")[0],
              price: (parseInt(item.functionData.info[7]) / 100).toString(),
              contractAddr: item.contractAddress,
              title: item.functionData.info[1],
              sold: item.functionData.info[0] == 1 ? false : true
            });
          });
          this.loaded++;
      });
    }
  },
  watch: {
    // Called when listing goods is loaded or the same route with same params is pushed
    ProductInfo: function() {
      this.loaded = 0;
      this.loadRelated();
      this.loadSellers();
    }
  }
};
</script>

<style lang="stylus">
.listing-related
  padding 0 (15/16)rem (60/16)rem
  margin-bottom (50/16)rem
  background-color #fff
  @media screen and (min-width: 600px)
    margin 0 0 (420/16)rem
    padding 0 (60/16)rem
  @media screen and (min-width: 1200px)
    margin 0 0 (420/16)rem
    padding 0 (120/16)rem
  .goods-list
    width 100%
    display flex
    flex-wrap wrap
    justify-content space-between
    .good-container
      good-margin = (15/16) rem
      height fit-content
      margin-bottom (20/16)rem
      width w = "calc((100% - %s)/2)" % good-margin
      @media screen and (min-width: 600px)
        good-margin = (25/16) rem
        width "calc((100% - %s)/3)" % good-margin
      @media screen and (min-width: 800px)
        good-margin = (55/16) rem
        width "calc((100% - %s)/4)" % good-margin
      @media screen and (min-width: 1000px)
        good-margin = (80/16) rem
        width "calc((100% - %s)/5)" % good-margin
    .good-container.stuff
      margin-bottom 0 !important
  .related-list-switch
    margin 0 (-15/16)rem (20/16)rem
    display flex
    justify-content center
    align-items center
    box-shadow 0 0.5px 0 0 #e5e5e5, 0 -0.5px 0 0 #e5e5e5
    height (44/16)rem
    > .list-switch
      width 50%
      text-align center
      font-size (15/16)rem
      color #999999
      position relative
      height (25/16)rem
      &.active
        font-weight bold
        color #191919
        &:after
          content ""
          position absolute
          bottom 0
          left 50%
          margin-left (-10/16)rem
          width (20/16)rem
          height (3/16)rem
          border-radius (2/16)rem
          background-color #ff3f0f
  .empty
      width 100%
      font-size (12/16)rem
      color #999999
      text-align center
</style>