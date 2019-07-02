<template>
  <div>
    <div class="home">
      <h1>MARKETPLACE</h1>
      <div class="search-field">
        <input type="search" placeholder="Enter a search term or #tag" />
        <span class="icon-search"></span>
      </div>
      <div class="cate-title">
        <h2>Popular Tags</h2>
      </div>
      <ul class="tags">
        <li>
          <a href="" class="tag-link">wallet</a>
        </li>
        <li>
          <a href="" class="tag-link">BTC</a>
        </li>
        <li>
          <a href="" class="tag-link">Cell Phone</a>
        </li>
      </ul>
      <div class="cate-title">
        <h2>Latest</h2>
        <a class="more">View all ({{ goodList.filter((obj)=>{return !obj.sold;}).slice(0,4).length }})></a>
      </div>
      <div class="good-list">
        <div v-for="good in goodList.filter((obj)=>{return !obj.sold;}).slice(0,4)" :key="good.key">
          <GoodListItem  v-bind:contractAddr="good.contractAddr">
            <RespImg
              v-bind:src="good.image"
              alt=""
            />
            <template v-slot:price>
              ${{ good.price }}
            </template>
          </GoodListItem>
        </div>
 
      </div>
      <div class="cate-title">
        <h2>Just Sold</h2>
        <a class="more">View all ({{ goodList.filter((obj)=>{return obj.sold;}).slice(0,4).length }})></a>
      </div>
      <div class="good-list">
        <div v-for="good in goodList.filter((obj)=>{return obj.sold;}).slice(0,4)" :key="good.key">
          <GoodListItem sold="true">
            <RespImg
              v-bind:src="good.image"
              alt=""
            />
            <template v-slot:price>
              ${{ good.price }}
            </template>
          </GoodListItem>
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
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
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
      const queryMarketplaceABI = {"query":{"match":{"abiShaList": "0xca44fb82aad28d1d2c373a2934e8bc280cd418352b2c0e077d8dd715112434f1"}}}
      const data = { 'bar': 123 };
      const options = {
        method: 'POST',
        headers: { "content-type":  "application/json" },
        data:  JSON.stringify(queryMarketplaceABI),
        url: "https://cmt-testnet.search.secondstate.io/api/es_search"
      };
      axios(options)
        .then((r)=>{
          var sortedData = r.data.sort(this.compare("blockNumber")).reverse().filter(
            (obj)=>{
              //remove those whose usd price is 0 or the img url is empty or ulisted
              if(obj.functionData.info[7] != 0 && obj.functionData.info[6] != "" && obj.functionData.info[0] != 0)
                return obj
            })
          sortedData.forEach(function(item){
              that.goodList.push({
                blkNumber: item.blockNumber,
                image: item.functionData.info[6].split(",")[0],
                price: (parseInt(item.functionData.info[7]) / 100).toString(),
                contractAddr: item.contractAddress,
                sold: (item.functionData.info[0] == 1) ? false : true
              })
          })
          console.log(this.goodList)
        });
    },
    compare(prop) {
      return function (obj1, obj2) {
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
      } 
    }
  }
};
</script>

<style lang="stylus">
.home
  padding 0 (15/16)rem (60/16)rem
  h1
    line-height (44/16)rem
    font-size 1rem
    letter-spacing 0.2rem
    margin 0 0 (15/16)rem
  .search-field
    position relative
    input
      width 100%
      padding 0 0 0 (42/16)rem
      height (40/16)rem
      line-height (38/16)rem
      border-radius (4/16)rem
      border solid 1px #e5e5e5
      background-color #ffffff
    .icon-search
      position absolute
      left (15/16)rem
      top (12/16)rem
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
</style>
