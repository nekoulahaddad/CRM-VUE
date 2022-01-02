import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VueNumberFormat from "vue-number-format";
import Paginate from "vuejs-paginate";
import VueMoment from "vue-moment";
import i18n from "./i18n";
import "moment/locale/ru";
import "./styles/index.scss";

Vue.config.productionTip = false;
Vue.use(VueMoment);
Vue.use(VueNumberFormat, {
  prefix: "",
  suffix: " ₽",
  thounsand: ".",
  precision: 0,
  isInteger: true,
});
Vue.component("paginate", Paginate);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
