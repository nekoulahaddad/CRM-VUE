<template>
  <div
    class="page__header page-header"
    :class="{ 'page-header--collapse': sidebar }"
  >
    <div class="page-header__inner">
      <div class="page-header__left">
        <div class="page__icon">
          <simple-svg :src="getIconUrl(icon)" />
        </div>
        <h1 class="page__title">{{ title }}</h1>
      </div>
      <v-filter-toggle
        @toggleFilter="$emit('toggleFilter')"
        v-if="filterToggle"
        :active="showFilter"
        :showCurrentRegion="showCurrentRegion"
      />
    </div>
  </div>
</template>

<script>
import VFilter from "../VFilter";
import VFilterToggle from "../VFilterToggle";

import { mapGetters } from "vuex";

export default {
  components: { VFilter, VFilterToggle },
  props: {
    showFilter: Boolean,
    icon: {
      type: String,
      required: true,
    },
    type: String,
    title: String,
    filterToggle: {
      type: Boolean,
      default: true,
    },
    showCurrentRegion: {
      type: Boolean,
      default: false,
    },
  },
  computed: { ...mapGetters(["sidebar"]) },
  methods: {
    getIconUrl(key) {
      return require(`@/assets/icons/${key}.svg`);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.page-header {
  padding-left: 20px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 777;
  background-color: $color-gray;
  padding-top: 20px;
  transition: left 0.5s;
  max-width: 1817px;

  &__left {
    display: flex;
    align-items: center;
  }

  &__inner {
    align-items: center;
    justify-content: space-between;
    display: flex;
    padding-left: 202px;
    margin-bottom: 10px;
    transition: padding 0.5s;
  }

  &--collapse {
    .page-header__inner {
      padding-left: 90px;
    }
  }
}
</style>
