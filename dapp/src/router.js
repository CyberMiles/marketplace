import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import CreatePage from "./views/Create.vue";
import ListingPage from "./views/Listing.vue";
import EditPage from "./views/Edit.vue";
import BuyPage from "./views/Buy.vue";
import CatalogPage from "./views/Catalog.vue";
import ProfilePage from "./views/Profile.vue";
import SellOrdersPage from "./views/SellOrders.vue";
import OrderDetailPage from "./views/OrderDetail.vue";
import SellGoodsPage from "./views/SellGoods.vue";
import RemarkPage from "./views/Remark.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: "Market Place"
      }
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
      component: CreatePage,
      meta: {
        title: "Create Trading"
      }
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
    },
    {
      path: "/edit/:contractAddr",
      name: "edit",
      component: EditPage
    },
    {
      path: "/tag/:tag",
      name: "tag",
      component: CatalogPage
    },
    {
      path: "/cata/:cata",
      name: "cata",
      component: CatalogPage
    },
    {
      path: "/search/:search",
      name: "search",
      component: CatalogPage
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage
    },
    {
      path: "/sell-orders/:type",
      name: "sell-orders",
      component: SellOrdersPage
    },
    {
      path: "/order/:role/:orderId",
      name: "order",
      component: OrderDetailPage
    },
    {
      path: "/sell-goods/:type",
      name: "sell-goods",
      component: SellGoodsPage
    },
    {
      path: "/remark",
      name: "remark",
      component: RemarkPage
    }
  ]
});
