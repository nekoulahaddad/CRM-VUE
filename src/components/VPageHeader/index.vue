<template>
  <div class="page__header page-header">
    <div class="page-header__inner">
      <div class="page-header__left">
        <div class="page__icon">
          <simple-svg :src="getIconUrl(icon)" />
        </div>
        <h1 class="page__title">{{ title }}</h1>
      </div>
      <v-filter-toggle v-if="filterToggle" />
    </div>
  </div>
</template>

<script>
import VFilterToggle from "../VFilterToggle";

export default {
  components: { VFilterToggle },
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    filterToggle: {
      type: Boolean,
      default: true,
    },
  },
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
  padding-right: 20px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 777;
  background-color: $color-gray;
  padding-top: 20px;
  transition: left 0.5s;

  &__left {
    display: flex;
    align-items: center;
  }

  &__inner {
    align-items: center;
    justify-content: space-between;
    display: flex;
    margin-bottom: 10px;
  }
}
</style>
