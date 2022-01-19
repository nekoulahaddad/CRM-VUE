<template>
  <div class="list">
    <div
      v-for="document in documents"
      class="list__row list__row--shadow list__row--white"
    >
      <div class="list__columns list__columns--shadow list__columns--white">
        <div class="list__column">{{ document.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    documents: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_variables";

.list {
  margin-top: 10px !important;

  &__columns {
    background-color: $color-white;
    border-radius: $border-radius;
  }
}
</style>
