<template>
  <div>
    <LoadingMask v-if="loading"></LoadingMask>
    <div class="home">
      <div class="pc-header">
        <h1><img src="./../assets/logo.png" style="width:160px"/></h1>
        <!-- <h1>{{ DAppName }}</h1> -->
        <div class="search-field">
          <div class="onsearch-field">
            <input
              type="search"
              placeholder="Enter a search term or #tag"
              v-model="searchTerm"
              v-on:keyup.enter="goSearch"
              @focus="onSearch = true"
              @blur="onSearch = false"
            />
            <span
              class="icon-delete"
              @mousedown="searchTerm = ''"
              v-if="onSearch"
            >
              <img src="../assets/imgs/clear-button.svg" />
            </span>
          </div>
          <button @mousedown="goSearch" v-if="onSearch">Go</button>

          <span class="icon-search"></span>
        </div>
        <button @click="goCreate" class="create-pc">
          Sell on {{ DAppName }}
        </button>
      </div>
      <div class="cate-title">
        <h2>Popular Tags</h2>
      </div>
      <ul class="tags">
        <li v-for="tag in popularTags" :key="tag.key">
          <router-link :to="`tag/` + tag" class="tag-link">{{
            tag
          }}</router-link>
        </li>
      </ul>
      <div class="cate-title">
        <h2>Latest</h2>
        <router-link to="/all/unsold" class="more"
          >View all ({{
            goodList.filter(obj => {
              return !obj.sold;
            }).length
          }})></router-link
        >
      </div>
      <div class="goods-list">
        <div
          v-for="good in goodList
            .filter(obj => {
              return !obj.sold;
            })
            .slice(0, maxDisplayItems)"
          :key="good.key"
          class="good-container"
        >
          <GoodsListItem v-bind:contractAddr="good.contractAddr">
            <RespImg v-bind:src="good.image" alt="" />
            <template v-slot:price>
              ${{ good.price }}
            </template>
          </GoodsListItem>
        </div>
      </div>
      <div class="cate-title">
        <h2>Just Sold</h2>
        <router-link to="/all/sold" class="more"
          >View all ({{
            goodList.filter(obj => {
              return obj.sold;
            }).length
          }})></router-link
        >
      </div>
      <div class="goods-list">
        <div
          v-for="good in goodList
            .filter(obj => {
              return obj.sold;
            })
            .slice(0, maxDisplayItems)"
          :key="good.key"
          class="good-container"
        >
          <GoodsListItem sold="true" v-bind:contractAddr="good.contractAddr">
            <RespImg v-bind:src="good.image" alt="" />
            <template v-slot:price>
              ${{ good.price }}
            </template>
          </GoodsListItem>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer.vue";
import GoodsListItem from "@/components/GoodsListItem.vue";
import RespImg from "@/components/RespImg.vue";
import LoadingMask from "@/components/LoadingMask.vue";
import axios from "axios";
import Global from "@/global.js";
import { web3Pass, queryOptions, makeQuery, compare } from "@/global.js";

export default {
  name: "home",
  data() {
    return {
      loading: true,
      goodList: [],
      popularTags: Global.popularTags,
      searchTerm: "",
      onSearch: false
    };
  },
  components: {
    Footer,
    GoodsListItem,
    RespImg,
    LoadingMask
  },
  created() {
    this.initGoodList();
    this.$ga.page("/");
  },
  methods: {
    initGoodList() {
      var that = this;
      const queryMarketplaceABI = makeQuery([1, 2, 3, 4, 5]);
      axios(queryOptions(queryMarketplaceABI)).then(r => {
        console.log(r.data);
        that.loading = false;
        var sortedData = r.data
          .sort(compare("blockNumber"))
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
    goSearch() {
      if (this.searchTerm.trim() == "" || this.searchTerm.trim() == "#") return;
      if (this.searchTerm.slice(0, 1) == "#")
        this.$router.push("/tag/" + this.searchTerm.slice(1));
      else this.$router.push("/search/" + this.searchTerm);
    },
    goCreate() {
      if (web3Pass(this, "/create")) this.$router.push("/create");
    }
  },
  computed: {
    maxDisplayItems: function() {
      if (window.innerWidth > 1000) return 6;
      else if (window.innerWidth > 800) return 5;
      else return 4;
    },
    DAppName: function() {
      return Global.ProductName;
    }
  }
};
</script>

<style lang="stylus">
.home
  padding 0 (15/16)rem (60/16)rem
  @media screen and (min-width: 600px)
    margin 0 0 (420/16)rem
    padding 0 (60/16)rem
  @media screen and (min-width: 1200px)
    margin 0 0 (420/16)rem
    padding 0 (120/16)rem
  h1
    line-height (44/16)rem
    font-size 1rem
    letter-spacing 0.2rem
    margin 0 0 (15/16)rem
    text-transform uppercase
    @media screen and (min-width: 600px)
      margin-top (44/16)rem
      display inline-block
      max-width (160/16)rem;
  .search-field
    @media screen and (min-width: 600px)
      margin (44/16)rem (10/16)rem 0 (10/16)rem
      display inline-block
      button-size = (200/16)rem
      logo-size = (160/16)rem
      margin-size = (20/16)rem
      width  "calc(100% - %s)" % (button-size + logo-size + margin-size )
    display flex
    position relative
    .onsearch-field
      position relative
      width 100%
      input
        width 100%
        padding 0 (42/16)rem 0 (42/16)rem
        height (40/16)rem
        line-height (38/16)rem
        border-radius (8/16)rem
        border solid 1px #e5e5e5
        background-color #ffffff
        transition all 3s
      input::-webkit-input-placeholder
        color #c7c7c7
        font-size (15/16)rem
      .icon-delete
        position absolute
        top (12/16)rem
        right (15/16)rem
        img
          height (12/16)rem
    .icon-search
      position absolute
      left (15/16)rem
      top (12/16)rem
      color #c7c7c7
    button
      font-size (17/16)rem
      font-weight 500
      color #ff3f0f
      background transparent
      border none
      @media screen and (min-width: 600px)
        display none
  .create-pc
    @media screen and (max-width: 600px)
      display none
    padding (10/16)rem
    font-weight 600
    text-decoration none
    border-radius (8/16)rem
    box-shadow 0 0 7px 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    color #fff
    max-width (200/16)rem
    border 0
  .cate-title
    display flex
    justify-content space-between
    align-items center
    margin (20/16)rem 0 (15/16)rem
    h2
      margin 0
      font-size (22/16)rem
      font-weight bold
    .more
      font-size (15/16)rem
    a
      text-decoration none
  .tags
    margin 0
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
</style>
