<template>
  <div class="listing">
    <LoadingMask></LoadingMask>
  </div>
</template>

<script>
import Contracts from "@/contracts.js";
import LoadingMask from "@/components/LoadingMask.vue";
import Global from "@/global.js";
import { goDebug, refactorListingTitle } from "@/global.js";

export default {
  components: {
    LoadingMask
  },
  created() {
    try {
      window.web3.cmt;
    } catch (e) {
      var Web3 = require("web3-cmt");
      window.web3 = new Web3(
        new Web3.providers.HttpProvider(Global.HttpProvider)
      );
    }
    var contract_address = this.$route.params.contractAddr;
    var that = this;
    //set timeout to check web3, because sometimes once mounted, the web3 hasn't been injected
    var checkWeb3 = function() {
      try {
        if (!window.web3.isAddress(contract_address)) {
          that.$router.push(`/`);
        }
        var contract = window.web3.cmt.contract(Contracts.Listing.abi);
        var instance = contract.at(contract_address);
        instance.info(function(e, r) {
          if (e) {
            that.$router.replace(`/safelisting/${contract_address}`);
            // goDebug({
            //   callMethod: "instance.info",
            //   error: e
            // });
          } else {
            let title = r[1];
            document.title = `${title} — ${Global.ProductName}`;
            title = refactorListingTitle(title);
            that.$router.replace(`/${title}/listing/${contract_address}`);
          }
        });
      } catch (e) {
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3(); //immediate first run
  }
};
</script>
