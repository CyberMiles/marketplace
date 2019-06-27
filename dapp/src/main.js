import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Contracts from "./contracts";

Vue.config.productionTip = false;

console.log(Contracts);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
