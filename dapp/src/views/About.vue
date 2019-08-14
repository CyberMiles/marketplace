<template>
  <div class="about">
    <h2>How to complete a deal on {{ productName }}</h2>
    <h1>Zero commission fee</h1>
    <img src="../assets/imgs/IntroTree.svg" />
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
        cannot be accessed by any one.
      </li>
    </ul>
  </div>
</template>

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
