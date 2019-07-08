<template>
  <div class="remark-page">
    <div class="all-remark">
      <dl>
        <dt>Seller, 19:59 Jun 01th</dt>
        <dd>I Know!</dd>
      </dl>
      <dl>
        <dt>Seller, 19:59 Jun 01th</dt>
        <dd>I hope you can deliver the goods as soon as possible</dd>
      </dl>
    </div>

    <div class="remark-field">
      <textarea placeholder="Remarks will be stored in the contract"></textarea>
    </div>

    <button class="new-remark">
      <span>Add A New Remark</span>
    </button>
  </div>
</template>

<script>
</script>

<style lang="stylus">
.remark-page
  padding (15/16)rem
  .all-remark
    padding (20/16)rem (15/16)rem
    border-radius (8/16)rem
    box-shadow 0 (3/16)rem (9/16)rem 0 rgba(0, 0, 0, 0.03)
    background-color #ffffff
    font-size (13/16)rem
    min-height calc(100vh - 12rem)
    dl
      margin (15/16)rem 0 0
      dt
        color #999999
      dd
        margin (7/16)rem 0 0
        word-break break-all
      &:first-child
        margin-top 0
  .remark-field
    position relative
    margin-top (15/16)rem
    height (88/16)rem
    border-radius (8/16)rem
    border solid 0.5px #e5e5e5
    background-color #ffffff
    overflow hidden
    textarea
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      width 100%
      border 0
      padding (15/16)rem
      resize none
  .new-remark
    display block
    width 100%
    margin (15/16)rem 0
    height (44/16)rem
    display flex
    align-items center
    justify-content center
    border-radius (4/16)rem
    border 0
    box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    font-size (17/16)rem
    color #ffffff
</style>
