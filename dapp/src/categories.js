import Vue from "vue";
import router from "./router";
import CategoryList from "./CategoryList.vue";
import Contracts from "./contracts";

Vue.config.productionTip = false;

// Register a global custom directive called `v-focus`
Vue.directive("focus", {
  // When the bound element is inserted into the DOM...
  inserted: function(el) {
    // Focus the element
    el.focus();
  }
});
 
console.log(Contracts);
window.Contracts = Contracts;

new Vue({
  el: "#app",
  router,
  render: h => h(CategoryList)
});
