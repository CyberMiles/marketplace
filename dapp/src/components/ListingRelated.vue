<template>
  <div class="listing-related">
    <div class="goods-list">
      <div v-for="good in goodList" :key="good.key" class="good-container">
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
      goodList: []
    };
  },
  methods: {
    loadRelated() {
      const tags = this.ProductInfo.tags;
      tags.forEach(t => {
        this.query(JSON.parse(TagQueryTemplate.replace('{tag}', t)))
      });
    },
    query(dsl) {
      axios(queryOptions(dsl)).then(r => {
        var sortedData = r.data
          .sort(compare("blockNumber"))
          .reverse()
          .filter(obj => {
            //remove those whose usd price is 0 or the img url is empty or ulisted
            if (
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
        sortedData.forEach((item) => {
          this.goodList.push({
            blkNumber: item.blockNumber,
            image: item.functionData.info[6].split(",")[0],
            price: (parseInt(item.functionData.info[7]) / 100).toString(),
            contractAddr: item.contractAddress,
            title: item.functionData.info[1],
            sold: item.functionData.info[0] == 1 ? false : true
          });
        });
      });
    }
  },
  watch: {
    ProductInfo: function() {
        this.loadRelated();
      }
  }
};
</script>

<style lang="stylus">
.listing-related
  padding 0 (15/16)rem (60/16)rem
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
</style>