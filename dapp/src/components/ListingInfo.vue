<template>
  <div class="listing-info">
    <div v-for="image in ProductInfo.images" :key="image.key">
      <div>
        <img class="preview" v-bind:src="image" />
      </div>
    </div>
    <div>
      <p id="image-img"></p>
      <div>
        <p id="price-desc">$ {{ ProductInfo.USDprice }}</p>
      </div>
    </div>
    <h3 id="title-div">{{ ProductInfo.title }}</h3>
    <ul id="tags">
      <li v-for="tag in ProductInfo.tags" :key="tag.id">
        {{ tag.trim() }}
      </li>
    </ul>

    <div>
      <p>Description:</p>
      <div id="desc-panel">
        {{ ProductInfo.desc }}
      </div>
    </div>

    <dl class="row" style="margin-top: 20px;">
      <dt class="col-sm-3">Seller</dt>
      <dd class="col-sm-9" id="creator">{{ ProductInfo.seller }}</dd>
      <dt class="col-sm-3">Contact Info</dt>
      <dd class="col-sm-9" id="contact">{{ ProductInfo.contact }}</dd>
    </dl>
    <hr />
  </div>
</template>
<script>
import Contracts from "@/contracts.js";

export default {
  name: "ListingInfo",
  data() {
    return {
      isSeller: false,
      ProductInfo: {
        images: [],
        title: null,
        tags: null,
        desc: null,
        seller: null,
        contact: null,
        USDprice: null
      }
    };
  },
  mounted() {
    this.initProductInfo();
  },
  methods: {
    initProductInfo() {
      var contract_address = this.$route.params.contractAddr;
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

              var contract = window.web3.cmt.contract(Contracts.Listing.abi);
              var instance = contract.at(contract_address);

              instance.info(function(e, r) {
                if (e) {
                  console.log(e);
                } else {
                  console.log(r[3]);
                  that.ProductInfo = {
                    status: r[0],
                    title: r[1],
                    desc: r[2],
                    tags: r[3].split(","),
                    escrowDuration: r[5],
                    images: r[6].split(","),
                    USDprice: (parseInt(r[7]) / 100).toString(),
                    seller: r[8].toString(),
                    buyerAddress: r[9].toString(),
                    contact: r[4]
                  };
                  console.log(that.ProductInfo);
                  that.isSeller = userAddress == that.ProductInfo.seller;
                  that.$emit("tradingInfo", {
                    isSeller: that.isSeller,
                    status: that.ProductInfo.status
                  });
                }
              });
            }
          });
        } catch (e) {
          setTimeout(checkWeb3, 50);
        }
      };
      checkWeb3(); //immediate first run
    }
  }
};
</script>
