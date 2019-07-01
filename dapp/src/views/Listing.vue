<template>
    <div class="listing">
        <ListingInfo v-on:isSeller="isSeller"/>  
        <component
            v-bind="{contractAddr: contractAddr}"
            :is="footerComponent"
            class="nav"
        ></component>
    </div>
</template>
<script>
import ListingInfo from "@/components/ListingInfo.vue";
import SellerNav from "@/components/SellerNav.vue";
import BuyerNav from "@/components/BuyerNav.vue";

export default {
    name: "listing",
    components: {
        ListingInfo,
        SellerNav,
        BuyerNav
    },
    data(){
        return {
            FooterNav: null,
            contractAddr: this.$route.params.contractAddr
        }
    },
    methods: {
        isSeller: function(isSeller) {
            if (isSeller) {
                this.FooterNav = "SellerNav"
            } else {
                this.FooterNav = "BuyerNav"
            }
        },
    },
    computed: {
        footerComponent: function () {
            return this.FooterNav
        }
    }
};
</script>
