<template>
  <div class="language-switcher" @click="toggleSwitcher">
    <div class="language-switcher__flag">
      <img src="@/assets/icons/flag_ru.svg" alt="" />
    </div>
    <div class="language-switcher__flag">
      <img src="@/assets/icons/flag_en.svg" alt="" />
    </div>
    <div
      class="language-switcher__button"
      :class="{ 'language-switcher__button--toggle': toggle }"
    />
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      currentLocale: "",
      locales: {
        en: "en-En",
        ru: "ru-Ru",
      },
    };
  },
  methods: {
    toggleSwitcher() {
      Cookies.set("locale", this.toggle ? "en-En" : "ru-Ru");
      this.$i18n.locale = this.toggle ? "en-En" : "ru-Ru";
    },
  },
  computed: {
    toggle() {
      return Cookies.get("locale") === "en-En";
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.language-switcher {
  width: 37px;
  height: 15.42px;
  background-color: $color-red;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding-left: 2px;
  padding-right: 2px;
  position: relative;

  &__flag img {
    width: 16.65px;
    height: 11.68px;
    position: relative;
    top: -0.5px;
  }

  &__button {
    background-color: $color-white;
    width: 14.65px;
    height: 11.68px;
    top: 2px;
    left: 2px;
    transition: left 0.1s ease-in-out;
    position: absolute;
    will-change: left;

    &--toggle {
      left: 19px;
    }
  }
}
</style>
