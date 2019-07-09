<template>
  <div>
    <div class="catalog-goods-list">
      <ul class="tags" v-if="tag !== undefined">
        <li v-for="popularTag in popularTags" :key="popularTag.key">
          <a
            :href="`/tag/` + popularTag"
            class="tag-link active"
            v-if="popularTag == tag"
            >{{ popularTag }}</a
          >
          <a :href="`/tag/` + popularTag" class="tag-link" v-else>{{
            popularTag
          }}</a>
        </li>
      </ul>
      <div class="search-field" v-if="search !== undefined">
        <input
          type="search"
          placeholder="Enter a search term or #tag"
          v-model="searchTerm"
          v-on:keyup.enter="goSearch"
        />
        <button @click="goSearch">Go</button>
      </div>
      <div class="search-result" v-if="search !== undefined">
        Total "<em>{{ goodList.length }}</em
        >" result
      </div>
      <div class="goods-list">
        <div v-for="good in goodList" :key="good.key">
          <GoodsListItem
            v-bind:contractAddr="good.contractAddr"
            :sold="good.sold ? true : ``"
          >
            <RespImg v-bind:src="good.image" alt="" />
            <template v-slot:price>
              ${{ good.price }}
            </template>
          </GoodsListItem>
        </div>
      </div>
      <div class="end">~ No More ~</div>
    </div>
    <div class="empty-list" v-if="goodList.length === 0">
      <div class="text">Sorry, we can’t find it</div>
      <router-link to="/">Back Home</router-link>
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
import global from "@/global.js";

export default {
  name: "home",
  data() {
    return {
      tag: this.$route.params.tag,
      cata: this.$route.params.cata,
      search: this.$route.params.search,
      goodList: [],
      popularTags: global.popularTags,
      searchTerm: ""
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
      var queryMarketplaceABI = "";
      if (this.$route.params.tag !== undefined) {
        queryMarketplaceABI = {
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
                  match_phrase: {
                    "functionDataList.0.functionData.info.3": this.tag
                  }
                }
                // { "match": {"functionDataList.0.functionData.info.0": "1"}}
              ]
            }
          }
        };
      } else if (this.$route.params.search !== undefined) {
        queryMarketplaceABI = {
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
      }
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
    },
    goSearch() {
      if (this.searchTerm.trim() == "" || this.searchTerm.trim() == "#") return;
      if (this.searchTerm.slice(0, 1) == "#")
        this.$router.push("/tag/" + this.searchTerm.slice(1));
      else this.$router.push("/search/" + this.searchTerm);
    }
  },
  watch: {
    $route(to) {
      // console.log("change",from.params.search,to.params.search)
      this.search = to.params.search;
      this.tag = to.params.tag;
      this.goodList.length = 0;
      this.initGoodList();
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