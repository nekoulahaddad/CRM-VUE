import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuescroll from "vuescroll";
import VueNumberFormat from "vue-number-format";
import VueSocketIOExt from "vue-socket.io-extended";
import VueCustomTooltip from "@adamdehaven/vue-custom-tooltip";
import Popover from "vue-js-popover";
import io from "socket.io-client";
import VModal from "vue-js-modal";
import VueScrollTo from "vue-scrollto";
import Paginate from "vuejs-paginate";
import Toast from "vue-toastification";
import VueMoment from "vue-moment";
import i18n from "./i18n";
import dateMixins from "@/mixins/date";
import fioMixins from "@/mixins/fio";
import nameMixins from "@/mixins/name";
import markMixins from "@/mixins/mark";
import oneCMixins from "@/mixins/oneC";
import roleMixins from "@/mixins/role";
import statusMixins from "@/mixins/status";
import "moment/locale/ru";
import "vue-toastification/dist/index.css";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import "vue-js-modal/dist/styles.css";
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

Vue.use(VueCustomTooltip, {
  name: "VueCustomTooltip",
  color: "#1a1a25",
  background: "#E8F9EF",
  borderRadius: 16,
  fontWeight: 400,
});
Vue.use(VModal, { componentName: "v-modal" });
Vue.use(Popover);
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
Vue.use(vuescroll, {
  ops: {
    bar: {
      background: "#db1f35",
      keepShow: true,
    },
    scrollPanel: {
      maxHeight: 600,
    },
    rail: {
      background: "#db1f35",
      size: "5px",
    },
  },
});
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 6,
  newestOnTop: true,
  position: "bottom-left",
  timeout: 3500,
});
Vue.component("paginate", Paginate);

Vue.mixin(dateMixins);
Vue.mixin(oneCMixins);
Vue.mixin(fioMixins);
Vue.mixin(nameMixins);
Vue.mixin(markMixins);
Vue.mixin(roleMixins);
Vue.mixin(statusMixins);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
