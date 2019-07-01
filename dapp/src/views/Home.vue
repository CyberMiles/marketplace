<template>
  <div>
    <Header>Marketplace</Header>
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
      <div class="good-list">
        <GoodListItem>
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
        <GoodListItem>
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
        <GoodListItem>
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
        <GoodListItem>
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
      </div>
      <div class="cate-title">
        <h2>Just Sold</h2>
        <a class="more">View all (109)></a>
      </div>
      <div class="good-list">
        <GoodListItem sold="true">
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
        <GoodListItem sold="true">
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
        <GoodListItem sold="true">
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
        <GoodListItem sold="true">
          <img
            srcset="
              https://via.placeholder.com/165x165,
              https://via.placeholder.com/330x330 2x
            "
            src="https://via.placeholder.com/330x330"
            alt="blabla"
          />
          <template v-slot:price>
            $110.00
          </template>
        </GoodListItem>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import GoodListItem from "@/components/GoodListItem.vue";

export default {
  name: "home",
  components: {
    Header,
    Footer,
    GoodListItem
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
  .good-list
    display flex
    flex-wrap wrap
    justify-content space-between
</style>
