<template>
  <div>
    <div class="remark-page">
      <div class="all-remark">
        <div class="empty-remark-tips" v-if="sortedMessageBoard.length == 0">
          No remarks yet.
        </div>
        <dl v-for="msg in sortedMessageBoard" v-bind:key="msg.id">
          <dt>{{ recognizeSpeaker(msg.party) }}, {{ msg.time }}</dt>
          <dd>{{ msg.words }}</dd>
        </dl>
      </div>

      <div class="remark-field">
        <textarea
          placeholder="Remarks will be stored in the contract"
          v-model="remarks"
          :disabled="processing == true"
        ></textarea>
      </div>
      <span class="count-words">{{ remarks.length }}/120</span>

      <button class="new-remark" @click="remark" :disabled="processing == true">
        <span>Add A New Remark</span>
      </button>
    </div>
    <ProcessingMask v-if="processing"></ProcessingMask>
  </div>
</template>

<script>
import Contracts from "@/contracts.js";
import ProcessingMask from "@/components/ProcessingMask.vue";
import { setTimeout } from "timers";
import { compare, remarkHandler } from "@/global.js";

export default {
  data() {
    return {
      messageBoard: [],
      remarks: "",
      processing: false,
      order: {
        seller: {
          addr: ""
        },
        buyer: {
          addr: ""
        }
      },
      instance: null
    };
  },
  components: {
    ProcessingMask
  },
  created() {
    this.contractAddr = this.$route.params.orderId;
    var that = this;
    var instance = "";
    var checkWeb3 = function() {
      try {
        var contract = window.web3.cmt.contract(Contracts.Listing.abi);
        instance = contract.at(that.contractAddr);
        that.instance = instance;
        instance.info(function(e, r) {
          if (e) {
            console.log(e);
          } else {
            that.order.seller = {
              addr: r[8]
            };
          }
        });
        instance.buyerInfo(function(e, b_r) {
          if (e) {
            console.log(e);
          } else {
            that.order.buyer = {
              addr: b_r[0]
            };
          }
        });
        instance.getMessagesCount(function(e, r) {
          if (e) {
            console.log(e);
          } else {
            for (let i = 0; i < r; i++) {
              instance.showMessageBoard(i, function(e, msg) {
                if (e) {
                  console.log(e);
                } else {
                  that.messageBoard.push({
                    id: i,
                    party: msg[0],
                    time: new Date(1000 * msg[1]).toLocaleString(),
                    words: msg[2]
                  });
                }
              });
            }
          }
        });
      } catch (e) {
        setTimeout(checkWeb3, 50);
      }
    };
    checkWeb3();
  },
  computed: {
    sortedMessageBoard: function() {
      return this.messageBoard.slice(0).sort(compare("id"));
    }
  },
  methods: {
    recognizeSpeaker: function(addr) {
      var speaker = addr;
      if (addr == this.order.seller.addr) speaker = "seller";
      else if (addr == this.order.buyer.addr) speaker = "buyer";
      return speaker;
    },
    remark() {
      if (this.remarks) {
        remarkHandler(this.instance, this.remarks);
        this.processing = true;
      }
    }
  },
  watch: {
    remarks: function(newVal, oldVal) {
      console.log(newVal.length, oldVal.length);
      if (newVal.length > 120) {
        this.remarks =
          oldVal + newVal.slice(oldVal.length, 120 - oldVal.length);
      }
    }
  }
};
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
  .count-words
    float right
    padding (10/16)rem
    font-size (12/16)rem
    color gray
</style>
