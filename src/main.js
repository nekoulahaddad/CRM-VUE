import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VueNumberFormat from "vue-number-format";
import i18n from "./i18n";
import "./styles/index.scss";

Vue.config.productionTip = false;
Vue.use(VueNumberFormat, {
  prefix: "",
  suffix: " ₽",
  thounsand: ".",
  precision: 0,
  isInteger: true,
});

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
