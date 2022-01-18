<template>
  <div class="top-blocks">
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">{{ $t("sales_today") }}</div>
        <div class="top-block__value">₽ 70.000</div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/card.svg" alt="" />
      </div>
    </div>
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">Количество посетителей сегодня:</div>
        <div class="top-block__value">₽ 70.000</div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/world.svg" alt="" />
      </div>
    </div>
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">{{ $t("sales_today") }}</div>
        <div class="top-block__value">₽ 70.000</div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/doc.svg" alt="" />
      </div>
    </div>
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">{{ $t("sales_today") }}</div>
        <div class="top-block__value">₽ 70.000</div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/cart_big.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.top-blocks {
  display: flex;

  &__item {
    background: $color-white;
    border-radius: $border-radius;
    height: 80px;
    min-width: 349px;
    display: flex;
    align-items: center;
    padding-left: 13px;
    padding-right: 7px;
    justify-content: space-between;
  }

  .top-block {
    font-weight: 600;

    & + * {
      margin-left: 10px;
    }

    &__title {
      color: #c4c4c4;
      margin-bottom: 5px;
    }
  }
}
</style>
