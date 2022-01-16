<template>
  <div class="top-products">
    <div class="top-products__inner">
      <div class="top-products__title">{{ $t("topProducts") }}</div>
      <div class="top-products__body">
        <div v-for="i in 9" class="top_products__item product">
          <img
            src="https://i.picsum.photos/id/529/131/83.jpg?hmac=ND-mojdfluwBJNlDA-FTYr_uMh2ZqHwT_rCIi8eWPaY"
            alt=""
            class="product__image"
          />
          <div class="product__title">Ламинат Kronostep АС4 Сосна Кантри</div>
          <div class="product__price">750 ₽</div>
        </div>
      </div>
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
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
    padding: 20px 10px;
  }

  &__body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 21px;
  }

  .product {
    width: 131px;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 20px;
    text-align: center;

    &:nth-last-child(-n + 3) {
      margin-bottom: 0;
    }

    &__image {
      border-radius: 5px;
      margin-bottom: 10px;
    }

    &__title {
      font-weight: 500;
    }

    &__price {
      color: #003ad2;
      font-weight: 700;
      margin-top: 10px;
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      width: 100%;
      background-color: $color-gray;
      border-radius: $border-radius;
    }
  }
}
</style>
