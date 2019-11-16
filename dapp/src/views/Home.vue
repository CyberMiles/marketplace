<template>
  <div>
    <!-- <LoadingMask v-if="loading"></LoadingMask> -->
    <div class="home" ref="home">
      <div class="pc-header">
        <img src="./../assets/logo.png" class="logo" />
        <span class="about-entry" @click="$router.push('/about')">About?</span>
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
          <button @mousedown="goSearch" v-if="onSearch">Search</button>

          <span class="icon-search"></span>
        </div>
        <button @click="goCreate" class="create-pc">
          Sell on {{ DAppName }}
        </button>
      </div>
      <div class="lead">
        <p>The CyberMiles blockchain is the privacy-preserving and censorship-resistant platform for e-commerce. Through specialized smart contracts, you can list anything for sale. Buyers can transact securely with you through cryptocurrency or US Dollars. Here is how.</p>
      </div>
      
      <div class="cate-title">
        <h2>Sellers</h2>
      </div>
      <div>
        <ol class="steps-list">
          <li>You must have at least 1 CMT in <a href="https://app.cybermiles.io">CyberMiles mobile app</a> OR the <a href="https://chrome.google.com/webstore/detail/venus/hmiddckbbijmdkamphkgkelnjjdkicck?hl=en">Venus wallet</a> address. You can <a href="/categories/cmt.html">get CMTs here</a>.</li>
          <li>Create a for-sale listing through this page on your mobile or Chrome browser. Upload pictures, descriptions, and prices in US Dollars. You could also choose to accept CMTs to give the buyer more privacy.</li>
          <li>Once you finished creating the listing, you will see a link that you can share. See <a href="/sell-goods/listed">all your listings</a>.</li>
          <li>Share this link with potential buyers. Ask them to get in touch when they put down the escrow payment in USD or CMT.</li>
          <li>Ship the product, and ask the buyer to release the escrow. You will receive either CMT or USDO tokens in the account you used to create the listing.</li>
          <li>You can <a href="/withdraw-usdo-guide">exchange USDO to US Dollars</a> via bank transfers, or purchase BTCs / CMTs using your USDO for privacy.</li>
        </ol>
        <p><i>Notice: Smart contracts created via the OpenBay.io web site can be moderated by OpenBay. You can, of course, create completely uncensorable contracts by deploying <a href="https://raw.githubusercontent.com/CyberMiles/marketplace/master/Listing.lity">your own</a> using Second State’s <a href="http://buidl.secondstate.io/cmt">developer tools.</a></i></p>
      </div>
      
      <div class="cate-title">
        <h2>Buyers</h2>
      </div>
      <div>
        <ol class="steps-list">
          <li>On mobile device or Chrome browser, open the purchase link shared by the seller. <a href="https://admiring-easley-6b2f52.netlify.com/Cartier-Ballon-Bleu-De-Cartier-W69012Z4-100-replica/listing/0x2637567AD5e24cd13175D875C6108b00206D6b0D">See an example</a></li>
          <li>You can purchase with a credit card (or with CMTs, if the seller accepts CMTs, for better privacy). Both require the <a href="https://app.cybermiles.io">CyberMiles mobile app</a> OR the <a href="https://chrome.google.com/webstore/detail/venus/hmiddckbbijmdkamphkgkelnjjdkicck?hl=en">Venus wallet</a> on the Chrome browser.</li>
          <li>The payment is held in escrow the seller cannot access it for 7 days.</li>
          <li>Once you receive the product, you can release the escrow, or do nothing and allow the escrow to automatically release after 7 days.</li>
          <li>You can also dispute the transaction within 7 days. The fund will be automatically locked until the OpenBay team can investigate and determine who should get the fund.</li>
        </ol>
      </div>
      
      <div>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
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
// import LoadingMask from "@/components/LoadingMask.vue";
import axios from "axios";
import Global from "@/global.js";
import { web3Pass, queryOptions, makeQuery, compare } from "@/global.js";

export default {
  name: "home",
  data() {
    return {
      loading: true,
      searchTerm: "",
      onSearch: false,
      homePanelWidth: window.innerWidth
    };
  },
  components: {
    Footer
  },
  created() {
    this.$ga.page("/");
  },
  mounted() {
    this.homePanelWidth = this.$refs.home.clientWidth;
  },
  methods: {
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
      if (window.innerWidth > 1000) return 10;
      else if (window.innerWidth > 800) return 8;
      else if (window.innerWidth > 600) return 6;
      else return 4;
    },
    DAppName: function() {
      return Global.ProductName;
    },
    containerHeight: function() {
      let parentWidth = this.homePanelWidth;
      let homePadding = 15;
      let lineHeight = 18;
      if (window.innerWidth > 1200) homePadding = 120;
      else if (window.innerWidth > 600) homePadding = 60;

      return (
        lineHeight +
        (parentWidth - this.goodMargin - 2 * homePadding) / this.itemsPerLine
      );
    },
    itemsPerLine: function() {
      if (window.innerWidth > 1000) {
        return 5;
      } else if (window.innerWidth > 800) {
        return 4;
      } else if (window.innerWidth > 600) {
        return 3;
      } else {
        return 2;
      }
    },
    goodMargin: function() {
      if (window.innerWidth > 1000) {
        return 80;
      } else if (window.innerWidth > 800) {
        return 55;
      } else if (window.innerWidth > 600) {
        return 25;
      } else {
        return 15;
      }
    }
  }
};
</script>

<style lang="stylus">
.home
  .pc-header
    .logo
      padding (10/16)rem 0
      width 160px
      min-height 48px
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
  .about-entry
    top (14/16)rem
    right 0
    position absolute
    border-radius (16/16)rem 0 0 (16/16)rem
    padding (8/16)rem (12/16)rem
    box-shadow 0 0 7px 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    color #fafafa
  .search-field
    @media screen and (min-width: 600px)
      margin 0 (10/16)rem 0 0
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
    width 100%
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
  .goods-list
    display flex
    flex-wrap wrap
    justify-content space-between
    .good-container
      good-margin = (15/16) rem
      height fit-content
      margin-bottom (36/16)rem
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
        
  .steps-list
    li
      padding-top 16px
  .lead
    font-size 125%
</style>
