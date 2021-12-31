<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <img src="/icons/logo.svg" alt="" />
      </div>
      <div class="sidebar__toggle">
        <button class="btn btn--red">
          <img src="/icons/arrow_left.svg" alt="" />
        </button>
      </div>
      <v-left-menu />
    </div>
  </div>
</template>

<script>
import VLeftMenu from "@/components/VLeftMenu";

export default {
  components: {
    VLeftMenu,
  },
};
</script>
