<template>
  <div class="top-products">
    <div class="top-products__inner">
      <div class="top-products__title">{{ $t("topProducts") }}</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.top-products {
  margin-top: 7px;

  &__inner {
    width: 493px;
    height: 668px;
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
    padding: 20px 10px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 21px;
  }
}
</style>
