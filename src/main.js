import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuescroll from "vuescroll";
import { Menu } from "floating-vue";
import vSelect from "vue-select";
import VCalendar from "v-calendar";
import VueNumberFormat from "vue-number-format";
import VueCustomTooltip from "@adamdehaven/vue-custom-tooltip";
import Popover from "vue-js-popover";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import VueTheMask from "vue-the-mask";
import VModal from "vue-js-modal";
import VueScrollTo from "vue-scrollto";
import Paginate from "vuejs-paginate";
import VueSimpleSVG from "vue-simple-svg";
import moment from "moment-timezone";
import Toast from "vue-toastification";
import ToggleButton from "vue-js-toggle-button";
import VueMoment from "vue-moment";
import Vuelidate from "vuelidate";

import { Settings } from "luxon";
import i18n from "./i18n";
import VButton from "@/components/VButton";
import dateMixins from "@/mixins/date";
import dragMixins from "@/mixins/drag";
import fioMixins from "@/mixins/fio";
import nameMixins from "@/mixins/name";
import markMixins from "@/mixins/mark";
import oneCMixins from "@/mixins/oneC";
import paymentMixins from "@/mixins/payment";

import phoneMixins from "@/mixins/phone";
import profileMixins from "@/mixins/profile";
import ratingMixins from "@/mixins/rating";
import roleMixins from "@/mixins/role";
import deliveryMixins from "@/mixins/delivery";
import VueInputDropdown from "vue-input-dropdown";
import transformRoleMixins from "@/mixins/transformRole";
import statusMixins from "@/mixins/status";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import "floating-vue/dist/style.css";

import "moment/locale/ru";
Settings.defaultLocale = "RU";
import "vue-toastification/dist/index.css";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import "vue-js-modal/dist/styles.css";
import "vue-datetime/dist/vue-datetime.css";
import "./styles/index.scss";
import "vue-select/dist/vue-select.css";

moment.tz.guess();

Vue.config.productionTip = false;

Vue.use(VueCustomTooltip, {
  name: "VueCustomTooltip",
  color: "#1a1a25",
  background: "#E8F9EF",
  borderRadius: 16,
  fontWeight: 400,
});
Vue.use(VCalendar, {
  componentPrefix: "vc",
});
Vue.use(Vuelidate);
Vue.use(Autocomplete);
Vue.use(VueSimpleSVG);
Vue.use(VModal, { componentName: "v-modal" });
Vue.use(Popover);
Vue.use(VueInputDropdown);
Vue.use(VueMoment);
Vue.use(VueTheMask);
Vue.component("v-select", vSelect);
Vue.use(VueScrollTo, {
  container: "body",
  duration: 0,
  offset: 0,
  force: true,
});
import { Datetime } from "vue-datetime";
Vue.component("datetime", Datetime);
Vue.use(VueNumberFormat, {
  prefix: "",
  suffix: " ₽",
  thounsand: ".",
  precision: 0,
  isInteger: true,
});
Vue.use(ToggleButton);
Vue.use(vuescroll, {
  ops: {
    bar: {
      background: "#db1f35",
      keepShow: true,
    },
    scrollPanel: {
      //maxHeight: 600,
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
  position: "bottom-right",
  timeout: 3500,
});
Vue.component("VMenu", Menu);
Vue.component("paginate", Paginate);

Vue.mixin(dateMixins);
Vue.mixin(dragMixins);
Vue.mixin(deliveryMixins);
Vue.mixin(oneCMixins);
Vue.mixin(fioMixins);
Vue.mixin(nameMixins);
Vue.mixin(markMixins);
Vue.mixin(paymentMixins);
Vue.mixin(phoneMixins);
Vue.mixin(profileMixins);
Vue.mixin(ratingMixins);
Vue.mixin(roleMixins);
Vue.mixin(statusMixins);
Vue.mixin(transformRoleMixins);

Vue.component("VButton", VButton);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
