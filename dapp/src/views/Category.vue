<template>
  <div>
    <div class="catalog-goods-list">
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
  </div>
</template>

<script>
// @ is an alias to /src
import GoodsListItem from "@/components/GoodsListItemForCategory.vue";
import LoadingMask from "@/components/LoadingMask.vue";
import RespImg from "@/components/RespImg.vue";
import axios from "axios";
import Global from "@/global.js";
import { queryOptions, makeQuery, compare } from "@/global.js";

export default {
  name: "home",
  data() {
    return {
      loading: true,
      tag: undefined,
      all: undefined,
      search: window.location.href.match(/\/categories\/(\w+)\.html$/)[1],
      goodList: [],
      searchTerm: ""
    };
  },
  components: {
    GoodsListItem,
    RespImg,
    LoadingMask
  },
  created() {
    this.initGoodList();
    this.searchTerm = this.search || (this.tag ? "#" + this.tag : this.tag);
  },
  methods: {
    initGoodList() {
      var that = this;
      var queryMarketplaceABI = "";
      if (this.tag !== undefined) {
        queryMarketplaceABI = {
          query: {
            bool: {
              must: [
                {
                  match: {
                    abiShaList: Global.abiShaList
                  }
                },
                {
                  match_phrase: {
                    "functionDataList.0.functionData.info.3": this.tag
                  }
                }
                // { "match": {"functionDataList.0.functionData.info.0": "1"}}
              ]
            }
          }
        };
      } else if (this.search !== undefined) {
        queryMarketplaceABI = {
          query: {
            bool: {
              must: [
                {
                  match: {
                    abiShaList: Global.abiShaList
                  }
                },
                {
                  multi_match: {
                    fields: [
                      "functionDataList.0.functionData.info.1",
                      "functionDataList.0.functionData.info.2",
                      "functionDataList.0.functionData.info.3"
                    ],
                    query: this.search
                  }
                }
                // { "match": {"functionDataList.0.functionData.info.0": "1"}}
              ]
            }
          }
        };
      } else if (this.all !== undefined) {
        if (this.all == "sold") {
          queryMarketplaceABI = makeQuery([2, 3, 4, 5]);
        } else if (this.all == "unsold") {
          queryMarketplaceABI = makeQuery([1]);
        }
      }
      axios(queryOptions(queryMarketplaceABI)).then(r => {
        that.loading = false;
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
        console.log(sortedData);
        sortedData.forEach(function(item) {
          if (item.functionData.info[0] == 1) {
            that.goodList.push({
              blkNumber: item.blockNumber,
              image: item.functionData.info[6].split(",")[0],
              price: (parseInt(item.functionData.info[7]) / 100).toString(),
              contractAddr: item.contractAddress,
              title: item.functionData.info[1],
              sold: item.functionData.info[0] == 1 ? false : true
            });
          }
        });
        console.log(this.goodList);
      });
    }
  }
};
</script>

<style lang="stylus">
.catalog-goods-list
  padding 0 (15/16)rem (20/16)rem
  @media screen and (min-width: 600px)
    margin 0
    padding 0 (15/16)rem
  @media screen and (min-width: 1200px)
    margin 0
    padding 0 (15/16)rem
  .tags
    margin (20/16)rem 0
    padding 0
    list-style none
    li
      margin-right (15/16)rem
      white-space nowrap
      float left
      display block
      margin-bottom (10/16)rem
    .tag-link
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
        background-color #ff3f0f
        color #ffffff
  .goods-list
    display flex
    flex-wrap wrap
    justify-content space-between
    .good-container
      good-margin = (15/16) rem
      height fit-content
      margin-bottom (15/16)rem
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
  .search-field
    position relative
    margin-top (15/16)rem
    display flex
    justify-content space-between
    input
      width 90%
      height (40/16)rem
      line-height (38/16)rem
      border-radius (8/16)rem
      border solid 1px #e5e5e5
      background-color #ffffff
      padding-left (10/16)rem
    input::-webkit-input-placeholder
      color #c7c7c7
      font-size (15/16)rem
    button
      font-size (17/16)rem
      font-weight 500
      color #ff3f0f
      background transparent
      border none
  .search-result
    margin (15/16)rem 0 (20/16)rem
    font-size (22/16)rem
    font-weight 600
    em
      font-style normal
      color #ff3f0f
  .end
    font-size (12/16)rem
    color #999999
    text-align center
.empty-list
  position absolute
  z-index -1
  top 0
  bottom 0
  left 0
  right 0
  display flex
  flex-direction column
  align-items center
  justify-content center
  .text
    font-size (15/16)rem
    color #999999
  a
    margin-top (30/16)rem
    width (200/16)rem
    height (40/16)rem
    line-height (40/16)rem
    border-radius 20px
    box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    font-size (15/16)rem
    color #ffffff
    text-decoration none
    text-align center
</style>
