<template>
  <div class="sell-goods">
    <div class="goods-items">
      <div class="sell-goods-item" v-for="g in goods" :key="g.id">
        <div class="goods-info">
          <RespImg v-bind:src="g.image" alt="" />
          <div class="goods-price">
            <span>$ {{ g.price }}</span>
          </div>
          <div class="sold" v-if="sold">
            <span>Sold</span>
          </div>
        </div>
        <div class="goods-actions">
          <div v-if="g.status === 'listed'">
            <button><span>Unlist</span></button>
            <button><span>Edit</span></button>
          </div>
          <div v-if="g.status === 'unlisted'">
            <button><span>Relist</span></button>
            <button><span>Edit</span></button>
          </div>
          <div v-if="g.status === 'sold'">
            <button class="long"><span>Relist</span></button>
          </div>
        </div>
      </div>
    </div>

    <div class="end">~ No More ~</div>
  </div>
</template>

<script>
import RespImg from "@/components/RespImg.vue";

export default {
  components: {
    RespImg
  },
  data() {
    return {
      goods: [
        {
          id: 1,
          image: "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562151181/eyp0y34ypb3nxasvb1yw.png",
          price: 11,
          status: "listed"
        },
        {
          id: 2,
          image: "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562151181/eyp0y34ypb3nxasvb1yw.png",
          price: 11,
          status: "unlisted"
        },
        {
          id: 3,
          image: "https://res.cloudinary.com/dgvnn4efo/image/upload/v1562151181/eyp0y34ypb3nxasvb1yw.png",
          price: 11,
          status: "sold"
        },
      ]
    }
  }
}
</script>

<style lang="stylus">
.sell-goods
  padding (15/16)rem
  .goods-items
    display flex
    flex-wrap wrap
    justify-content space-between
    .sell-goods-item
      margin-bottom (15/16)rem
      border-radius (8/16)rem
      overflow hidden
      .goods-info
        position relative
        width (165/16)rem
        height (165/16)rem
        background-color #f0f0f0
        img
          width (165/16)rem
          height (165/16)rem
        .goods-price
          display flex
          align-items center
          position absolute
          left (5/16)rem
          bottom (5/16)rem
          height (24/16)rem
          line-height 1
          padding 0 (5/16)rem
          border-radius (12/16)rem
          background-color #ff3f0f
          font-size (14/16)rem
          color #ffffff
        .sold
          position absolute
          left 0
          right 0
          top 0
          bottom 0
          background-color rgba(0, 0, 0, 0.5)
          span
            position absolute
            top 50%
            margin-top (-16/16)rem
            height (32/16)rem
            line-height (32/16)rem
            left 50%
            margin-left (-67/2/16)rem
            width (67/16)rem
            border-radius (16/16)rem
            border solid 1px rgba(255, 255, 255, 0.2)
            background-color rgba(255, 255, 255, 0.2)
            color rgba(255, 255, 255, 0.8)
            font-size (17/16)rem
            text-align center
  .goods-actions
    > div
      background-color #ffffff
      height (40/16)rem
      display flex
      padding 0 (18/16)rem
      justify-content space-between
      align-items center
      button
        width (56/16)rem
        height (24/16)rem
        border-radius (4/16)rem
        border solid 0.5px #e5e5e5
        background-color transparent
        display flex
        align-items center
        justify-content center
        &.long
          width (130/16)rem
  .end
    font-size (12/16)rem
    color #999999
    text-align center
</style>
