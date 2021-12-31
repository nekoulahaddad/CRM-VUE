import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import i18n from "./i18n";
import "./styles/index.scss";

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
