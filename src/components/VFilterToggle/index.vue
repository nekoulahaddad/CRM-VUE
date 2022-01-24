<template>
  <div v-if="!active" class="filter-toggle" @click="toggleFilter">
    <div class="filter-toggle__inner">
      <div class="filter-toggle__icon">
        <img src="@/assets/icons/filter.svg" alt="" />
      </div>
      <div class="filter-toggle__text">Фильтр</div>
    </div>
  </div>
  <img
    v-else
    src="@/assets/icons/filter_active.svg"
    @click="toggleFilter"
    alt=""
  />
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
  methods: {
    toggleFilter() {
      this.$emit("toggleFilter");
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.filter-toggle {
  cursor: pointer;

  &__inner {
    width: 124px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 14px;
    padding-right: 14px;
    border-radius: $border-radius;
    border: 2px solid #db1f35;
    background-color: $color-white;
  }

  &__text {
    color: $color-red;
    font-size: 16px;
    font-weight: bold;
  }
}

img {
  cursor: pointer;
}
</style>
