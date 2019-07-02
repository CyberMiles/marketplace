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
        <a class="more">View all (109)></a>
      </div>
      <div class="goods-list">
        <GoodsListItem>
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
        <GoodsListItem>
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
        <GoodsListItem>
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
        <GoodsListItem>
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
      </div>
      <div class="cate-title">
        <h2>Just Sold</h2>
        <a class="more">View all (109)></a>
      </div>
      <div class="goods-list">
        <GoodsListItem sold="true">
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
        <GoodsListItem sold="true">
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
        <GoodsListItem sold="true">
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
        <GoodsListItem sold="true">
          <RespImg
            src="https://res.cloudinary.com/dgvnn4efo/image/upload/v1562052108/uhuuafn7ubeodsrg4qsv.jpg"
            alt=""
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodsListItem>
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

export default {
  name: "home",
  components: {
    Footer,
    GoodsListItem,
    RespImg
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
