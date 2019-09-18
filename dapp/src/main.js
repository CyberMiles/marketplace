import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Contracts from "./contracts";
import VueSweetalert2 from "vue-sweetalert2";

const options = {
  confirmButtonColor: "#41b882",
  cancelButtonColor: "#ff7674"
};

Vue.use(VueSweetalert2, options);
Vue.config.productionTip = false;

// Register a global custom directive called `v-focus`
Vue.directive("focus", {
  // When the bound element is inserted into the DOM...
  inserted: function(el) {
    // Focus the element
    el.focus();
  }
});

window.Contracts = Contracts;

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);
  if (nearestWithTitle) {
    let title = nearestWithTitle.meta.title;
    for (let k in to.params) {
      title = title.replace(`{${k}}`, to.params[k]);
    }
    document.title = title;
  }
  next();
});

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
