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
  width: 924px;
  box-shadow: 0 3.5px 5.5px rgba(0, 0, 0, 0.02);
  margin-top: 7px;
  margin-left: 10px;
  border-radius: $border-radius;
  flex: 1;

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
