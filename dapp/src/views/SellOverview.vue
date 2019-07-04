<template>
  <div class="sell-overview">
    <h3>Items</h3>
    <div class="entries">
      <div class="entry">
        <label>Listed</label>
        <span class="count">2</span>
      </div>
      <div class="entry">
        <label>Unlisted</label>
        <span class="count">2</span>
      </div>
      <div class="entry">
        <label>Sold</label>
        <span class="count">2</span>
      </div>
    </div>

    <h3>Orders</h3>
    <div class="entries">
      <div class="entry">
        <label>Buyer has paid</label>
        <span class="count">2</span>
      </div>
      <div class="entry">
        <label>Completed</label>
        <span class="count">2</span>
      </div>
      <div class="entry">
        <label>Dispute</label>
        <span class="count">2</span>
      </div>
      <div class="entry">
        <label>Refund to buyer</label>
        <span class="count">2</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="stylus">
.sell-overview
  h3
    margin (22/16)rem 0 (15/16)rem
  .entries
    background-color #ffffff
    border-radius (8/16)rem
    box-shadow 0 (3/16)rem (9/16)rem 0 rgba(0, 0, 0, 0.03)
    padding 0 (15/16)rem
    .entry
      position relative
      height (44/16)rem
      line-height (44/16)rem
      display flex
      justify-content space-between
      border-bottom solid 0.5px #e5e5e5
      font-size (15/16)rem
      &:last-child
        border 0
      &:after
        content "⌃"
        position absolute
        right 0
        color #c7c7c7
        transform rotate(90deg)
      .count
        color #c7c7c7
        margin-right (20/16)rem
</style>
