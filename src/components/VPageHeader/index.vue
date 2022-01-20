<template>
  <div class="page__header">
    <div class="page__icon">
      <simple-svg :src="getIconUrl(icon)" />
    </div>
    <h1 class="page__title">{{ title }}</h1>
    <v-filter-toggle />
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
  },
  methods: {
    getIconUrl(key) {
      return require(`@/assets/icons/${key}.svg`);
    },
  },
};
</script>
