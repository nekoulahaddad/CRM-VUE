import Vue from "vue";
import VueI18n from "vue-i18n";
import Cookies from "js-cookie";

Vue.use(VueI18n);

const messages = {
  en: {
    ...require("./locales/en.json"),
  },
  ru: {
    ...require("./locales/ru.json"),
  },
};

export default new VueI18n({
  locale: Cookies.get("locale") || "ru-RU",
  fallbackLocale: Cookies.get("locale") || "ru-RU",
  messages,
});
