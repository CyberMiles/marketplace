<template>
  <div class="about">
    <div class="head1">How to complete a deal on {{ productName }}</div>
    <div class="head2">Zero commission fee</div>
    <img class="intro-tree" src="../assets/imgs/IntroTree.svg" />
    <ul>
      <li>
        When the buyer pays, the fund is frozen in the smart contract for
        {{ escrowDuration }} days and released to the seller if the buyer has
        not taken any action.
      </li>
      <li>
        Within the {{ escrowDuration }} days if the buyer has any problems (like
        the seller fails to deliver or the product is problematic), the buyer
        can raise a dispute. A third party comes into mediation with the buyers’
        interests in mind.
      </li>
      <li>
        The {{ USDunit }}s are frozen and secured in the smart contract and
        cannot be accessed by anymore.
      </li>
    </ul>
  </div>
</template>

<style lang="stylus">
.about
  .head1
    font-size (17/16)rem
    font-weight 500
    text-align center
    margin (50/16)rem 0 (5/16)rem 0
  .head2
    font-size 20px
    text-align center
    font-weight bold
    margin-bottom (32/16)rem
  .intro-tree
    margin 0 auto
  ul
    padding 0 (20/16)rem 0 (41/16)rem
    @media screen and (min-width: 600px)
      padding 0 (200/16)rem
    li
      padding (10/16)rem 0
      font-size (12/16)rem
      color #666666
</style>

<script>
import Global from "@/global.js";

export default {
  computed: {
    productName: function() {
      return Global.ProductName;
    },
    escrowDuration: function() {
      return Global.escrowPeriod / (60 * 60 * 24);
    },
    USDunit: function() {
      return Global.USDunit;
    }
  }
};
</script>
