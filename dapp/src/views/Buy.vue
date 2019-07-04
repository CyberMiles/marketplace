<template>
  <!-- WARNING: a temporay page! -->
  <div class="buy">
    <ul id="prices-select" class="form-control">
      <li
        v-for="token in tokenSet"
        :key="token.id"
        v-bind:value="{
          addr: token.token_crc20,
          amount: token.token_real_amount
        }"
      >
        {{ token.token_amount + token.token_name }}
      </li>
    </ul>
    <button @click="buy">BUY</button>
  </div>
</template>

<script>
import Contracts from "@/contracts.js";

export default {
  name: "Buy",
  data() {
    return {
      contractAddr: null,
      tokenSet: [],
      selectedCRC20: null,
      instance: null
    };
  },
  mounted() {
    this.initBuyPage();
  },
  methods: {
    initBuyPage() {
      var contract_address = this.$route.params.contractAddr;
      this.contractAddr = contract_address;
      console.log(contract_address);
      var that = this;
      //set timeout to check web3, because sometimes once mounted, the web3 hasn't been injected
      var checkWeb3 = function() {
        try {
          window.web3.cmt.getAccounts(function(e, address) {
            if (e) {
              console.log(e);
            } else {
              var userAddress = address.toString();
              console.log(userAddress);
              var contract = window.web3.cmt.contract(Contracts.Listing.abi);
              var instance = contract.at(contract_address);
              that.instance = instance;

              instance.getPricesCount(function(e, pricesCount) {
                if (e) {
                  console.log(e);
                } else {
                  for (let i = 0; i < pricesCount; i++) {
                    instance.getPrice(i, function(e_price, r_price) {
                      if (e_price) {
                        console.log(e_price);
                      } else {
                        var token_name = "Unknown";
                        var tokens = {};
                        var token_crc20 = r_price[0].toString();
                        tokens[token_crc20] = r_price[1];
                        var token_amount = "";
                        if (
                          token_crc20 ==
                          "0x0000000000000000000000000000000000000000"
                        ) {
                          token_name = "CMT";
                          token_amount = window.web3.fromWei(
                            tokens[token_crc20]
                          );
                        } else if (
                          token_crc20 ==
                          "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a"
                        ) {
                          token_name = "OPB";
                          token_amount = (
                            parseInt(tokens[token_crc20]) / 100
                          ).toString();
                        }
                        that.tokenSet.push({
                          token_name,
                          token_crc20,
                          token_amount,
                          token_real_amount: tokens[token_crc20]
                        });
                        console.log(that.tokenSet);
                      }
                    });
                  }
                }
              });
            }
          });
        } catch (e) {
          setTimeout(checkWeb3, 50);
        }
      };
      checkWeb3(); //immediate first run
    },
    buy() {
      var crc20 = this.selectedCRC20.addr;
      var amount = this.selectedCRC20.amount;
      console.log(crc20, amount);
      if (crc20 == "0x0000000000000000000000000000000000000000") {
        this.instance.buyWithCMT(
          "",
          "contact@123.com",
          "mesg",
          {
            gas: "400000",
            gasPrice: 0,
            value: amount
          },
          function(e) {
            if (e) {
              console.log(e);
            } else {
              setTimeout(function() {
                window.location.reload(true);
              }, 20 * 1000);
            }
          }
        ); // buyWithCMT
      } else {
        var contract_crc20 = window.web3.cmt.contract(Contracts.ERC20.abi);
        var instance_crc20 = contract_crc20.at(crc20);
        var that = this;
        instance_crc20.approve(
          this.contractAddr,
          parseInt(amount),
          {
            gas: "200000",
            gasPrice: 0
          },
          function(error) {
            if (error) {
              console.log(error);
            } else {
              that.instance.buyWithCRC20(
                crc20,
                "",
                "contact",
                "mesg",
                {
                  gas: "400000",
                  gasPrice: 0
                },
                function(e) {
                  if (e) {
                    console.log(error);
                  } else {
                    setTimeout(function() {
                      window.location.reload(true);
                    }, 20 * 1000);
                  }
                }
              ); // buyWithCRC20
            }
          }
        ); // approve
      }
    }
  }
};
</script>

<style lang="stylus">
.buy
  #prices-select
    width 100%
    height (67/16)rem
</style>
