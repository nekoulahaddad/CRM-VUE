<template>
  <div class="wrapper">
    <v-mobile-header />
    <v-mobile-sidebar />
    <v-sidebar />
    <main class="main">
      <router-view />
    </main>
    <v-footer />
  </div>
</template>

<script>
import VSidebar from "../components/VSidebar";
import VMobileHeader from "../components/VMobileHeader";
import VMobileSidebar from "../components/VMobileSidebar";
import VFooter from "../components/VFooter";

export default {
  components: {
    VMobileHeader,
    VMobileSidebar,
    VFooter,
    VSidebar,
  },
  mounted() {
    const body = document.querySelector("body");
    const menu = document.querySelector(".menu");

    menu.onmouseover = function () {
      body.style.overflow = "hidden";
    };

    menu.onmouseout = function () {
      body.style.overflow = "auto";
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

body {
  background-color: $color-gray;
}
</style>
