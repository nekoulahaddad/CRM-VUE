<template>
  <div class="page-actions">
    <div class="page-actions__inner">
      <a href="" class="page-actions__button">
        <img src="@/assets/icons/clear_cache.svg" alt="" />
      </a>
      <template v-if="name === 'education'">
        <a href="" class="page-actions__button">
          <img src="@/assets/icons/education_add.svg" alt="" />
        </a>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    name() {
      return this.$route.name;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.page-actions {
  &__inner {
  }

  &__button {
    position: relative;
    top: 2px;

    & + * {
      margin-left: 20px;
    }
  }
}
</style>
