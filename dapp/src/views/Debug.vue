<template>
  <div>
    <div class="wrong-tip">
      <img
        src="./../assets/imgs/error.png"
        srcset="
          ./../assets/imgs/error@2x.png 2x,
          ./../assets/imgs/error@3x.png 3x
        "
        class="wrong-logo"
      />
      <span>Oops!</span>
      <span>Something went wrong!</span>
    </div>
    <div class="detected-error" v-if="networkMismatched">
      Important: Network Mismatched! (Mistmatch Type {{ mismatchType }} )
      <a :href="`/faq.html#1-a-` + mismatchType" class="fix-href">
        How to fix it?
      </a>
    </div>
    <div class="error-info markdown-body">
      <vue-markdown v-bind:source="ErrorDesc"> </vue-markdown>
    </div>
  </div>
</template>

<script>
// Eg URL: https://cybermiles.github.io/marketplace/#/debug?errorURL=https%3A%2F%2Fabd&txHash=0x123&error=null&callMethod=null
import Global from "@/global.js";
import VueMarkdown from "vue-markdown";
import { setTimeout } from "timers";

export default {
  components: {
    VueMarkdown
  },
  data() {
    return {
      errorParams: "",
      chainId: "",
      networkMismatched: false,
      web3Version: "",
      web3CmtVersion: "",
      web3Provider: Object(),
      mismatchType: 0
    };
  },
  created() {
    var that = this;
    let searchs = new URLSearchParams(window.location.href.split("debug?")[1]);
    var entries = searchs.entries();
    for (let pair of entries) {
      console.log(pair[0], pair[1]);
      this.errorParams += "- " + pair[0] + ":  " + pair[1] + "\n";
    }
    //make sure web3 has been injected
    let checkWeb3 = function() {
      try {
        window.web3.version.getNetwork(function(e, currentNetId) {
          if (!e) {
            that.chainId = currentNetId;
            var Web3 = require("web3-cmt");
            new Web3(
              new Web3.providers.HttpProvider(that.rpcEndpoint)
            ).version.getNetwork(function(e, netId) {
              if (currentNetId !== netId) {
                that.networkMismatched = true;
                if (netId === "18" && currentNetId === "19") {
                  that.mismatchType = 1;
                } else if (netId === "18" && currentNetId !== "19") {
                  that.mismatchType = 2;
                } else if (netId === "19" && currentNetId === "18") {
                  that.mismatchType = 3;
                } else if (netId === "19" && currentNetId !== "18") {
                  that.mismatchType = 4;
                }
              }
            });
            that.web3Version = window.web3.version.api;
            that.web3CmtVersion = window.web3.cmt.version;
            that.web3Provider = window.web3.currentProvider;
          }
        });
      } catch (e) {
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3();
  },
  computed: {
    abiShaList: function() {
      return Global.abiShaList;
    },
    DAOaddr: function() {
      return Global.DAOaddr;
    },
    errorMsg: function() {
      return decodeURIComponent(
        window.location.href.split("error=")[1].split("&")[0]
      );
    },
    rpcEndpoint: function() {
      return Global.HttpProvider;
    },
    esEndpoint: function() {
      return Global.eeEndpoint;
    },
    userAgent: function() {
      return navigator.userAgent;
    },
    ErrorDesc: function() {
      return `### More Information:

#### Error Info
${this.errorParams}

#### DApp Info
- rpc endpoint: ${this.rpcEndpoint}
- es endpoint: ${this.esEndpoint}
- abiSha: ${this.abiShaList}
- DAOaddr: ${this.DAOaddr}

#### Web3 Info
- web3.current.provider
  + host: ${this.web3Provider.host}
  + selected address: ${this.web3Provider.selectedAddress}
  + network version: ${this.chainId}
  + isMetaMask: ${this.web3Provider.isMetaMask}

- web3 version: ${this.web3Version}
- web3.cmt version: ${this.web3CmtVersion}


#### Network Info
- User agent: ${this.userAgent}`;
    }
  }
};
</script>

<style lang="stylus">
.wrong-tip
  padding-top (64/16)rem
  span
    padding (12/16)rem
    font-size (22/16)rem
    font-weight bold
    display flex
    justify-content center
  .wrong-logo
    display block
    margin (12/16)rem auto
.detected-error
  font-size (20/16)rem
  font-weight bold
  border solid 1px red
  width fit-content
  margin 0 auto
  padding (12/16)rem
  .fix-href
    font-size (12/16)rem
    color #0366d6
.error-info
  padding (64/16)rem
  @media screen and (max-width: 767px)
    padding (15/16)rem
</style>
