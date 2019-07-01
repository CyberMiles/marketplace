import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import CreatePage from "./views/Create.vue";
import ListingPage from "./views/Listing.vue";
import BuyPage from "./views/Buy.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/create",
      name: "create",
      component: CreatePage
    },
    {
      path: "/listing/:contractAddr",
      name: "listing",
      component: ListingPage
    },
    {
      path: "/buy/:contractAddr",
      name: "buy",
      component: BuyPage
    }
  ]
});
