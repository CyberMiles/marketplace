<template>
  <div>
    <LoadingMask v-if="loading"></LoadingMask>
    <div class="buy">
      <div class="pay-header">
        <div class="title">
          {{ goodTitle }}
        </div>
        <div class="price">
          <span class="price-tag">price</span>
          <span class="price-value"> $ {{ USDprice }} </span>
        </div>
      </div>
      <div>
        <p>You need to pay</p>
      </div>
      <ul id="prices-select" class="form-control">
        <li
          v-for="token in sortToken(tokenSet)"
          :key="token.id"
          v-bind:value="token.token_crc20"
          @click="selectToken(token)"
        >
          <span>
            {{ token.token_amount + " " + token.token_name }}
          </span>
          <div v-if="isSufficient(token)" class="right">
            <span
              v-if="
                (selectedCRC20 == null && token.token_crc20 == USDaddr) ||
                  (selectedCRC20 != null &&
                    selectedCRC20.addr == token.token_crc20)
              "
            >
              <img class="selected" src="../assets/imgs/checked.svg" />
            </span>
          </div>
          <div class="right" v-else>
            <span class="insufficient">
              insufficient
            </span>
          </div>
          <div class="USD-tip-container">
            <span class="USD-tip" v-if="token.token_crc20 == USDaddr"
              >1 {{ USDunit }} ≈ 1 USD</span
            >
          </div>
        </li>
      </ul>
      <a :href="USDBuyLink" class="recharge" @click="loading = true">
        Recharge {{ USDunit }} with a credit card
      </a>
      <div class="form-group">
        <label for="contact">Contact Info</label>
        <input
          autocorrect="off"
          autocapitalize="off"
          type="text"
          class="form-control"
          id="contact"
          placeholder="Email. Seller contacts you."
          v-model="contact"
        />
      </div>
      <div class="form-group">
        <label for="remark">Remark</label>
        <textarea
          rows="3"
          type="text"
          class="form-control"
          id="remark"
          placeholder="Note information"
          v-model="remark"
        />
      </div>
      <a class="buy-btn" @click="buy"><span>Buy</span></a>
      <div style="text-align:center;margin-top:20px;">
        <router-link :to="`/listing/${contractAddr}`">Cancel</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Contracts from "@/contracts.js";
import global from "@/global.js";
import LoadingMask from "@/components/LoadingMask.vue";
import { web3Pass } from "@/global.js";

export default {
  name: "Buy",
  components: {
    LoadingMask
  },
  data() {
    return {
      loading: true,
      contractAddr: null,
      tokenSet: [],
      selectedCRC20: null,
      instance: null,
      remark: "",
      contact: "",
      USDprice: null,
      USDRealPrice: null,
      goodTitle: "",
      balance: {
        USD: "",
        CMT: ""
      }
    };
  },
  created() {
    if (!web3Pass(this)) {
      return;
    }
    this.initBuyPage();
    this.$ga.page("/buy");
  },
  computed: {
    USDaddr: function() {
      return global.USDaddr;
    },
    USDunit: function() {
      return global.USDunit;
    },
    USDBuyLink: function() {
      return (
        global.USDBuyLink + this.contractAddr + "&amount=" + this.USDRealPrice
      );
    }
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
          if (!window.web3.isAddress(contract_address)) {
            that.$router.push(`/`);
          }
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
                  that.$router.push(`/`);
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
                        } else if (token_crc20 == global.USDaddr) {
                          token_name = global.USDunit;
                          token_amount = (
                            parseInt(tokens[token_crc20]) / 100
                          ).toString();
                          that.selectedCRC20 = {
                            addr: global.USDaddr,
                            amount: tokens[token_crc20]
                          };
                          that.USDprice = token_amount;
                          that.USDRealPrice = tokens[token_crc20];
                        }
                        that.tokenSet.push({
                          token_name,
                          token_crc20,
                          token_amount,
                          token_real_amount: tokens[token_crc20]
                        });
                        that.loading = false;
                        console.log(that.tokenSet);
                      }
                    });
                  }
                }
              });

              instance.info(function(e, info) {
                if (e) {
                  console.log(e);
                } else {
                  that.goodTitle = info[1];
                  if (info[0].toNumber() !== 1) {
                    that.$router.push(`/listing/${that.contractAddr}`);
                  }
                }
              });

              //check balance
              var contractUSD = window.web3.cmt.contract(Contracts.ERC20.abi);
              var instanceUSD = contractUSD.at(that.USDaddr);
              instanceUSD.balanceOf(
                userAddress,
                {
                  gas: "200000",
                  gasPrice: 0
                },
                function(e, USDbalance) {
                  if (e) {
                    console.log(e);
                  } else {
                    that.balance.USD = USDbalance;
                  }
                }
              );
              window.web3.cmt.getBalance(userAddress, function(e, CMTbalance) {
                if (e) {
                  console.log(e);
                } else {
                  that.balance.CMT = CMTbalance;
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
    selectToken(token) {
      if (this.isSufficient(token))
        this.selectedCRC20 = {
          addr: token.token_crc20,
          amount: token.token_real_amount
        };
    },
    buy() {
      if (
        this.selectedCRC20.addr == this.USDaddr &&
        this.selectedCRC20.amount.toNumber() > this.balance.USD.toNumber()
      ) {
        this.$swal("Please select one payment.");
        return;
      }
      var crc20 = this.selectedCRC20.addr;
      var amount = this.selectedCRC20.amount;
      var that = this;
      console.log(crc20, amount);
      if (crc20 == "0x0000000000000000000000000000000000000000") {
        this.instance.buyWithCMT(
          "",
          this.contact,
          this.remark,
          {
            gas: "400000",
            gasPrice: 0,
            value: amount
          },
          function(e, txhash) {
            if (e) {
              console.log(e);
            } else {
              that.$router.replace(`/complete/${that.contractAddr}/${txhash}`);
            }
          }
        ); // buyWithCMT
      } else {
        var contract_crc20 = window.web3.cmt.contract(Contracts.ERC20.abi);
        var instance_crc20 = contract_crc20.at(crc20);
        instance_crc20.approve(
          this.contractAddr,
          parseInt(amount),
          {
            gas: "200000",
            gasPrice: 0
          },
          function(error, txhash) {
            if (error) {
              console.log(error);
            } else {
              var getReceipt = function() {
                try {
                  window.web3.cmt.getTransactionReceipt(txhash, function(
                    e,
                    receipt
                  ) {
                    if (e) {
                      console.log(e);
                    } else {
                      if (receipt == null) setTimeout(getReceipt, 100);
                      else {
                        if (receipt.status == 0x1) {
                          that.instance.buyWithCRC20(
                            crc20,
                            "",
                            that.contact,
                            that.remark,
                            {
                              gas: "400000",
                              gasPrice: 0
                            },
                            function(e, txhash) {
                              if (e) {
                                console.log(e);
                              } else {
                                that.$router.replace(
                                  `/complete/${that.contractAddr}/${txhash}`
                                );
                              }
                            }
                          ); // buyWithCRC20
                        } else {
                          console.log("Approve Tx Failed.");
                        }
                      }
                    }
                  });
                } catch (e) {
                  setTimeout(getReceipt, 100);
                  console.log("wait");
                }
              };
              getReceipt();
            }
          }
        ); // approve
      }
    },
    isSufficient: function(token) {
      if (token.token_crc20 == this.USDaddr)
        return (
          this.balance.USD.toNumber() >= token.token_real_amount.toNumber()
        );
      else if (
        token.token_crc20 == "0x0000000000000000000000000000000000000000"
      )
        return (
          this.balance.CMT.toNumber() >= token.token_real_amount.toNumber()
        );
      else return true;
    },
    sortToken: function(tokenSet) {
      var tokenCopy = [];
      var that = this;
      tokenSet.forEach(function(token) {
        if (token.token_crc20 == that.USDaddr) {
          tokenCopy.push(token);
        }
      });
      tokenSet.forEach(function(token) {
        if (token.token_crc20 !== that.USDaddr) {
          tokenCopy.push(token);
        }
      });
      return tokenCopy;
    }
  }
};
</script>

<style lang="stylus">
.buy
  padding 0 (15/16)rem (60/16)rem
  .pay-header
    margin-right -(15/16)rem
    margin-left -(15/16)rem
    background #ffffff
    box-shadow 0 0.5px 0 0 #e5e5e5
    .title
      padding (15/16)rem
      font-size (15/16)rem
      border-bottom solid 0.5px #e5e5e5
    .price
      height (45/16)rem
      align-items center
      display flex
      .price-tag
        color #999999
        padding-left (15/16)rem
      .price-value
        display iblock
        position absolute
        right (15/16)rem
        font-size (17/16)rem
  #prices-select
    list-style none
    padding 0
    margin-right -(15/16)rem
    margin-left -(15/16)rem
    margin-top 0
    margin-bottom 0
    background #ffffff
    li
      padding 0 (15/16)rem
      width 100%
      height (67/16)rem
      align-items center
      display flex
      box-shadow 0 0.5px 0 0 #f0f0f0
      span
        color #191919
        font-weight 500
        font-size (17/16)rem
      .right
        position absolute
        display block
        right (15/16)rem
        .selected
          width (17/16)rem
        .insufficient
          font-size (13/16)rem
          color red
      .USD-tip-container
        position absolute
        left (15/16)rem
        .USD-tip
          color #999999
          font-size (10/16)rem
          position relative
          top (20/16)rem
  .recharge
    color #00a0ff
    font-size (15/16)rem
    text-decoration none
    display block
    padding (10/16)rem 0 (20/16)rem 0
  .form-group
    padding 0 0 (20/16)rem
    label
      font-size (15/16)rem
    input
      width 100%
      padding 0 (10/16)rem
      height (40/16)rem
      line-height (38/16)rem
      border-radius (4/16)rem
      border solid 0.5px #e5e5e5
      background-color #ffffff
      margin (10/16)rem 0 0 0
    textarea
      width 100%
      padding (10/16)rem
      line-height (22/16)rem
      border-radius (4/16)rem
      border solid 0.5px #e5e5e5
      background-color #ffffff
      margin (10/16)rem 0 0 0
  .buy-btn
    display flex
    border-radius 4px;
    box-shadow 0 0 7px 0 rgba(255, 63, 15, 0.3)
    background-image linear-gradient(to left, #ff7777, #ff3f0f)
    height (44/16)rem
    text-decoration none
    align-items center
    justify-content center
    span
      font-size (17/16)rem
      color #ffffff
</style>
