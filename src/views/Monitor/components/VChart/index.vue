<template>
  <div class="chart">
    <div class="chart__inner">
      <div class="chart__title">Проданное количество товаров за декабрь:</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.chart {
  background-color: $color-white;
  max-width: 924px;
  width: 100%;
  box-shadow: 0 3.5px 5.5px rgba(0, 0, 0, 0.02);
  margin-top: 7px;
  margin-left: 7px;
  border-radius: $border-radius;

  &__inner {
    width: 100%;
    padding: 28px 22.5px 28px 21px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
