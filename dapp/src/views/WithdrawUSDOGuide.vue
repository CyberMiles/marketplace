<template>
  <div class="container">
    <img
      src="../assets/imgs/usdoicon.png"
      srcset="
        ../assets/imgs/usdoicon@2x.png 2x,
        ../assets/imgs/usdoicon@3x.png 3x
      "
      class="usdo-logo"
    />
    <p class="instruction">How to withdraw USDO as dollars</p>
    <div class="step">
      <div class="step-seq">
        Step1
      </div>
      <div class="step-items">
        <div class="step-item">
          1, Prepare the following KYC information: The signature page of your
          passport
        </div>
        <div class="step-item">
          2, Photo taken with handheld passport and a paper with the date and
          USDO amount
        </div>
        <div class="step-item">
          3, Details of a bank account to receive dollars
        </div>
        <div class="step-item">
          4, Withdrawal services for users in the following countries will not
          be provided: North Korea, Iran
        </div>
      </div>
    </div>
    <div class="step">
      <div class="step-items">
        <div class="step-seq">
          Step2
        </div>
        <div class="step-item">
          1, Send the above information to {{ USDOsupportEmail }} using the
          email template below.
        </div>
      </div>
      <span class="left" @click="showEmailFormat = true">
        View Email format
      </span>
      <div class="right">
        Copy
        <span
          class="icon-copy"
          v-clipboard="() => EmailFormat"
          v-clipboard:success="copySuccess"
        >
        </span>
      </div>
    </div>
    <div class="step">
      <div class="step-items">
        <div class="step-seq">
          Step3
        </div>
        <div class="step-item">
          1, After receiving the email application, your withdrawal will be
          processed within 3 working days.
        </div>
      </div>
    </div>
    <div class="step">
      <div class="step-items">
        <div class="step-seq">
          Step4
        </div>
        <div class="step-item">
          1, The staff will notify you via email the KYC review results.
        </div>
      </div>
    </div>
    <div class="step">
      <div class="step-items">
        <div class="step-seq">
          Step5
        </div>
        <div class="step-item">
          1, After receiving the email, you will need to transfer the USDO to
          the specified address within the specified time as instructed in
          email. After we receive the USDO, we will arrange the USD transfer to
          your bank card
        </div>
        <div class="step-item">
          2, We will charge a 4+15% processing fee for each withdrawal ({{
            USDOsupportEmail
          }})
        </div>
      </div>
    </div>
    <div class="step">
      <div class="step-items">
        <div class="step-seq">
          Step6
        </div>
        <div class="step-item">
          1, Bank account receives dollars
        </div>
      </div>
    </div>
    <span class="btn" @click="showContact()">Ask Us</span>
    <div class="mask" @click="showEmailFormat = false" v-if="showEmailFormat">
      <img class="emailFormat" src="../assets/imgs/emailFormat.jpg" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Clipboard from "v-clipboard";
import Toast from "@/components/Toast.vue";
import Global from "@/global.js";

Vue.use(Clipboard);
Vue.use(Toast);

export default {
  data() {
    return {
      EmailFormat:
        "Email body:\n\nUSDO address: 0xxxxxxxxx...xxxx\nThe USDO withdrawal amount: xxx\nBank account to receive USD: xxxx\n\nEmail Attachment:\n\n1. Frontand back of the passport\n2. Hand-held passport front photo + paper shooting date and USDO",
      showEmailFormat: false
    };
  },
  computed: {
    USDOsupportEmail: function() {
      return Global.USDOsupportEmail;
    }
  },
  methods: {
    showContact() {
      var that = this;
      this.$swal({
        title:
          "<div style='font-size: 60%'>Please send your questions to:" +
          that.USDOsupportEmail +
          "</div>",
        showCancelButton: false,
        customClass: {
          confirmButton: "confirm-button-class"
        },
        animation: false,
        reverseButtons: true,
        confirmButtonText: "Ok"
      });
    },
    copySuccess() {
      this.$toast("copied");
    }
  }
};
</script>

<style lang="stylus">
.container
  padding 0 (15/16)rem
  .usdo-logo
    margin (20/16)rem auto
  .instruction
    font-size (18/16)rem
    text-align center
    font-weight 500
  .step
    margin (44/16)rem 0
    .step-seq
      font-size (22/16)rem
      font-weight 500
    .step-items
      .step-item
        margin (10/16)rem 0
        font-size (15/16)rem
    .left
      color #00a0ff
    .right
      color #00a0ff
      float right
      padding-right (40/16)rem
.btn
  display block
  padding 0
  margin (20/16)rem 0
  border 0
  width 100%
  height (50/16)rem
  line-height (50/16)rem
  font-size (17/16)rem
  font-weight 500
  text-align center
  text-decoration none
  color #ffffff
  box-shadow 0 0 (7/16)rem 0 rgba(255, 63, 15, 0.3)
  background-image linear-gradient(to left, #ff7777, #ff3f0f)
.confirm-button-class
  border-radius 18px  !important
  box-shadow 0 0 7px 0 rgba(255, 63, 15, 0.3)  !important
  font-size (15/16)rem !imporatant
  background-image linear-gradient(to left, #ff7777, #ff3f0f) !important
.mask
  position fixed
  top 0
  left 0
  background rgba(1, 1, 1, 0.2)
  height 100%
  width 100%
  z-index 998
  .emailFormat
    max-height 95%
    margin 5% auto
    z-index 999
</style>
