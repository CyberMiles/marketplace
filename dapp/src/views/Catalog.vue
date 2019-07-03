<template>
  <div>
    <div class="catalog-goods-list">
      <ul class="tags" v-if="tag !== undefined">
        <li>
          <a href="" class="tag-link">wallet</a>
        </li>
        <li>
          <a href="" class="tag-link active">BTC</a>
        </li>
        <li>
          <a href="" class="tag-link">Cell Phone</a>
        </li>
      </ul>
      <div class="search-field" v-if="search !== undefined">
        <input type="search" placeholder="Enter a search term or #tag" />
        <button>Go</button>
      </div>
      <div class="search-result" v-if="search !== undefined">
        Total "<em>1</em>" result
      </div>
      <div class="goods-list">
        <div
          v-for="good in goodList
            .filter(obj => {
              return !obj.sold;
            })
            .slice(0, 4)"
          :key="good.key"
        >
          <GoodsListItem v-bind:contractAddr="good.contractAddr">
            <RespImg v-bind:src="good.image" alt="" />
            <template v-slot:price>
              ${{ good.price }}
            </template>
          </GoodsListItem>
        </div>
      </div>
      <div class="end">~ No More ~</div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";
import GoodsListItem from "@/components/GoodsListItem.vue";
import RespImg from "@/components/RespImg.vue";
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      tag: this.$route.params.tag,
      cata: this.$route.params.cata,
      search: this.$route.params.search,
      goodList: []
    };
  },
  components: {
    Footer,
    GoodsListItem,
    RespImg
  },
  mounted() {
    this.initGoodList();
  },
  methods: {
    initGoodList() {
      var that = this;
      const queryMarketplaceABI = {
        query: {
          match: {
            abiShaList:
              "0xca44fb82aad28d1d2c373a2934e8bc280cd418352b2c0e077d8dd715112434f1"
          }
        }
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        data: JSON.stringify(queryMarketplaceABI),
        url: "https://cmt-testnet.search.secondstate.io/api/es_search"
      };
      axios(options).then(r => {
        var sortedData = r.data
          .sort(this.compare("blockNumber"))
          .reverse()
          .filter(obj => {
            //remove those whose usd price is 0 or the img url is empty or ulisted
            if (
              obj.functionData.info[7] != 0 &&
              obj.functionData.info[6] != "" &&
              obj.functionData.info[0] != 0
            )
              return obj;
          });
        sortedData.forEach(function(item) {
          that.goodList.push({
            blkNumber: item.blockNumber,
            image: item.functionData.info[6].split(",")[0],
            price: (parseInt(item.functionData.info[7]) / 100).toString(),
            contractAddr: item.contractAddress,
            sold: item.functionData.info[0] == 1 ? false : true
          });
        });
        console.log(this.goodList);
      });
    },
    compare(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    }
  }
};
</script>

<style lang="stylus">
.catalog-goods-list
  padding 0 (15/16)rem (60/16)rem
  .tags
    margin (20/16)rem 0
    padding 0
    list-style none
    display flex
    li
      margin-right (15/16)rem
      &:last-child
        margin-right 0
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
    button
      font-size (17/16)rem
      font-weight 500
      color #ff3f0f
  .search-result
    margin (15/16)rem 0 (20/16)rem
    font-size (22/16)rem 0
    font-weight 600
    em
      font-style normal
      color #ff3f0f
  .end
    font-size (12/16)rem
    color #999999
    text-align center
</style>
