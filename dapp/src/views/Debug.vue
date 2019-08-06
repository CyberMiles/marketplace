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
      <span>something went wrong!</span>
    </div>
    <div class="error-info markdown-body">
      <vue-markdown>
### More Information:

#### Error Info
- url: {{ errorURL }}
- error: {{ errorMsg }}
- web3 call tx: {{ txHash }}
- web3 call method: {{ callMethod }}

#### DApp Info
- url: {{ errorURL }}
- rpc endpoint: {{ rpcEndpoint }}
- es endpoint: {{ esEndpoint }}
- abiSha: {{ abiShaList }}
- DAOaddr: {{ DAOaddr  }}

#### Web3 Info
- web3.current.provider
  + host: {{ web3Provider.host }}
  + selected address: {{ web3Provider.selectedAddress }}
  + network version: {{ web3Provider.networkVersion }}
  + isMetaMask: {{ web3Provider.isMetaMask }}

- web3 version: {{ web3Version }}
- web3.cmt version: {{ web3CmtVersion }}


#### Network Info
- User agent: {{ userAgent }}
      </vue-markdown>
    </div>
  </div>
</template>

<script>
// Eg URL: http://localhost:8080/#/debug?errorURL=https%3A%2F%2Fdfd&txHash=0x123
import Global from "@/global.js";
import VueMarkdown from "vue-markdown";

export default {
  components: {
    VueMarkdown
  },
  computed: {
    errorURL: function() {
      return decodeURIComponent(
        window.location.href.split("errorURL=")[1].split("&")[0]
      );
    },
    txHash: function() {
      return decodeURIComponent(
        window.location.href.split("txHash=")[1].split("&")[0]
      );
    },
    callMethod: function() {
      return decodeURIComponent(
        window.location.href.split("callMethod=")[1].split("&")[0]
      );
    },
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
    web3Version: function() {
      return window.web3 === undefined ? "web3NotDefined" : window.web3.version.api;
    },
    web3CmtVersion: function() {
      return window.web3 === undefined ? "web3NotDefined" : window.web3.cmt.version;
    },
    web3Provider: function() {
      return window.web3 === undefined ? "web3NotDefined" : window.web3.currentProvider;
    },
    userAgent: function() {
      return navigator.userAgent;
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
.error-info
  padding (64/16)rem
  @media screen and (max-width: 767px)
    padding (15/16)rem
</style>
