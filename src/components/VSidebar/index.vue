<template>
  <div class="sidebar" :class="{ 'sidebar--collapse': sidebar }">
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <router-link :to="{ name: 'desktop' }">
          <img :src="require('@/assets/icons/logo.svg')" alt="" />
        </router-link>
      </div>
      <div class="sidebar__toggle">
        <v-button red @click="toggleSidebar">
          <img
            v-if="sidebar"
            :src="require('@/assets/icons/arrow_right.svg')"
            alt=""
          />
          <img v-else :src="require('@/assets/icons/arrow_left.svg')" alt="" />
        </v-button>
      </div>
      <v-left-menu />
    </div>
  </div>
</template>

<script>
import VLeftMenu from "../VLeftMenu";
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

<style lang="scss">
@import "@/styles/_variables";

.sidebar {
  background-color: $color-white;
  width: 202px;
  height: 100vh;
  position: sticky;
  z-index: 101;
  left: 0;
  top: 0;
  overflow: hidden;
  transition: width 0.5s;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__logo {
    margin-bottom: 6px;
    margin-top: 20px;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 54px;
    width: 182px;
    position: relative;

    &::after,
    &::before {
      content: "";
      height: 2px;
      width: 100%;
      display: block;
      background-color: $color-gray;
      border-radius: $border-radius;
      position: absolute;
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }

    .btn {
      width: 144px;
      height: 30px;
    }
  }

  &__menu {
    transition: width 0.5s;
  }

  &--collapse {
    width: 88px;

    .sidebar__toggle {
      width: 68px;

      .btn {
        width: 30px;
        height: 30px;
      }
    }

    .menu__title {
      transition-delay: 0s;
    }
    .menu__icon {
      min-width: 46px;
      height: 45px;
    }
  }

  .__bar-is-vertical {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    width: 5px !important;
    right: -4px !important;
  }
}
</style>
