<template>
    <div id="buyer-nav">
        <router-link to="/">Contact Seller</router-link> |
        <router-link :to="`/buy/${contractAddr}`">Buy Now</router-link>
    </div>
</template>
<script>
export default {
    name: "BuyerNav",
    props: {
        contractAddr: String
    }
}
</script>
