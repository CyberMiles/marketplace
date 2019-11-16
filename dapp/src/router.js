import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Listings from "./views/Listings.vue";
import CreatePage from "./views/Create.vue";
import Create2Page from "./views/Create2.vue";
import ListingPage from "./views/ForwardListing.vue";
import SEOFriendlyListingPage from "./views/Listing.vue";
import SafeListingPage from "./views/SafeListing.vue";
import EditPage from "./views/Edit.vue";
import Edit2Page from "./views/Edit2.vue";
import BuyPage from "./views/Buy.vue";
import CatalogPage from "./views/Catalog.vue";
import ProfilePage from "./views/Profile.vue";
import SellOrdersPage from "./views/SellOrders.vue";
import OrderDetailPage from "./views/OrderDetail.vue";
import SellGoodsPage from "./views/SellGoods.vue";
import RemarkPage from "./views/Remark.vue";
import BuyCompletePage from "./views/BuyComplete.vue";
import CreatingPage from "./views/Creating.vue";
import DownloadPage from "./views/Download.vue";
import DisputePage from "./views/DisputeBoard.vue";
import WithdrawUSDOGuidePage from "./views/WithdrawUSDOGuide.vue";
import DebugPage from "./views/Debug.vue";
import AboutPage from "./views/About.vue";
import Global from "@/global.js";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/", redirect: "/default.html"
    },
    {
      path: "/market",
      name: "home",
      component: Home,
      meta: {
        title: `${Global.ProductName}`
      }
    },
    {
      path: "/listings",
      name: "listings",
      component: Listings
    },
    {
      path: "/about",
      name: "about",
      component: AboutPage
    },
    {
      path: "/create",
      name: "create",
      component: CreatePage,
      meta: {
        title: "New Listing for Sale",
        transitionName: "slideY"
      }
    },
    {
      path: "/create2",
      name: "create2",
      component: Create2Page,
      meta: {
        title: "New Listing for Sale",
        transitionName: "slideY"
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
        title: ":title"
      }
    },
    {
      path: "/safelisting/:contractAddr",
      name: "safelisting",
      component: SafeListingPage,
      meta: {
        title: ":title"
      }
    },
    {
      path: "/:title/listing/:contractAddr",
      name: "SEOlisting",
      component: SEOFriendlyListingPage,
      meta: {
        title: ":title"
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
        title: "Edit Listing"
      }
    },
    {
      path: "/edit2/:contractAddr",
      name: "edit2",
      component: Edit2Page,
      meta: {
        title: "Edit Listing"
      }
    },
    {
      path: "/tag/:tag",
      name: "tag",
      component: CatalogPage,
      meta: {
        transitionName: "slideX",
        title: "Buy and Sell {tag} on Market Place"
      }
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
      path: "/all/:all",
      name: "all",
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
      path: "/remark/:orderId",
      name: "remark",
      component: RemarkPage,
      meta: {
        title: "Remark"
      }
    },
    {
      path: "/download/:reloc",
      name: "download",
      component: DownloadPage,
      meta: {
        title: "CyberMiles"
      }
    },
    {
      path: "/withdraw-usdo-guide",
      component: WithdrawUSDOGuidePage,
      meta: {
        title: "Withdraw USDO as dollars"
      }
    },
    {
      path: "/dispute-board",
      name: "dispute-board",
      component: DisputePage,
      meta: {
        title: "Dispute Board"
      }
    },
    {
      path: "/debug",
      name: "debug",
      component: DebugPage,
      meta: {
        title: "Error"
      }
    }
  ]
});
