import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VueNumberFormat from "vue-number-format";
import VueSocketIOExt from "vue-socket.io-extended";
import VueAutosuggest from "vue-autosuggest";
import io from "socket.io-client";
import VueScrollTo from "vue-scrollto";
import Paginate from "vuejs-paginate";
import Toast from "vue-toastification";
import VueMoment from "vue-moment";
import i18n from "./i18n";
import "moment/locale/ru";
import "vue-toastification/dist/index.css";
import "./styles/index.scss";

const token = localStorage.getItem("token");

const socket = io(process.env.VUE_APP_DEVELOP_URL, {
  query: { token },
  autoConnect: true,
  reconnection: true,
  transports: ["websocket"],
  maxReconnectionAttempts: Infinity,
});

socket.on("disconnect", () => {
  socket.open();
});

if (token) {
  Vue.use(VueSocketIOExt, socket, { store });
}

Vue.config.productionTip = false;
Vue.use(VueAutosuggest);
Vue.use(VueMoment);
Vue.use(VueScrollTo, {
  container: "body",
  duration: 0,
  offset: 0,
  force: true,
});
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
