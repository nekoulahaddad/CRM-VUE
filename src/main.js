import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VueNumberFormat from "vue-number-format";
import Paginate from "vuejs-paginate";
import Toast from "vue-toastification";
import VueMoment from "vue-moment";
import i18n from "./i18n";
import "moment/locale/ru";
import "vue-toastification/dist/index.css";
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
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 6,
  newestOnTop: true,
  position: "bottom-left",
  timeout: 3500,
});
Vue.component("paginate", Paginate);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
