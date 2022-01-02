<template>
  <div class="sidebar" :class="{ 'sidebar--collapse': sidebar }">
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <router-link to="/">
          <img src="/icons/logo.svg" alt="" />
        </router-link>
      </div>
      <div class="sidebar__toggle">
        <v-button red @click="toggleSidebar">
          <img v-if="sidebar" src="/icons/arrow_right.svg" alt="" />
          <img v-else src="/icons/arrow_left.svg" alt="" />
        </v-button>
      </div>
      <v-left-menu />
    </div>
  </div>
</template>

<script>
import VLeftMenu from "@/components/VLeftMenu";
import VButton from "@/components/VButton";
import { mapGetters } from "vuex";

export default {
  components: {
    VButton,
    VLeftMenu,
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar");
    },
  },
};
</script>
