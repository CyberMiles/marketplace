<template>
    <div class="listing">
        <ListingInfo/>
         <div id="nav">
            <router-link to="/">Contact Seller</router-link> |
            <router-link to="/buy">Buy Now</router-link>
        </div>
    </div>
</template>
<script>
import ListingInfo from "@/components/ListingInfo.vue";

export default {
    name: "listing",
    components: {
        ListingInfo
    },
};
</script>
