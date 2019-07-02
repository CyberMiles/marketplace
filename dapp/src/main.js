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

console.log(Contracts);
window.Contracts = Contracts;

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
