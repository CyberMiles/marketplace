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
import BuyCompletePage from "./views/BuyComplete.vue";
import CreatingPage from "./views/Creating.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
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
      path: "/creating/:txHash",
      name: "creating",
      component: CreatingPage,
      meta: {
        title: "Creating"
      }
    },
    {
      path: "/listing/:contractAddr",
      name: "listing",
      component: ListingPage,
      meta: {
        title: "Market Place"
      }
    },
    {
      path: "/buy/:contractAddr",
      name: "buy",
      component: BuyPage,
      meta: {
        title: "Pay"
      }
    },
    {
      path: "/complete/:contractAddr/:txHash",
      name: "complete",
      component: BuyCompletePage,
      meta: {
        title: "Complete"
      }
    },
    {
      path: "/edit/:contractAddr",
      name: "edit",
      component: EditPage,
      meta: {
        title: "Edit"
      }
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
      component: CatalogPage,
      meta: {
        title: "Search Result"
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
      meta: {
        title: "Profile"
      }
    },
    {
      path: "/sell-orders/:type",
      name: "sell-orders",
      component: SellOrdersPage
    },
    {
      path: "/order/:role/:orderId",
      name: "order",
      component: OrderDetailPage,
      meta: {
        title: "Detail"
      }
    },
    {
      path: "/sell-goods/:type",
      name: "sell-goods",
      component: SellGoodsPage
    },
    {
      path: "/remark",
      name: "remark",
      component: RemarkPage,
      meta: {
        title: "Remark"
      }
    }
  ]
});
