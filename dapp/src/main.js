import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Contracts from "./contracts";

Vue.config.productionTip = false;

console.log(Contracts);
window.Contracts = Contracts;

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
