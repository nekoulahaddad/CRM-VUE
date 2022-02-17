<template>
  <div class="top-products">
    <div class="top-products__inner">
      <div class="top-products__title">{{ $t("topProducts") }}</div>
      <div class="top-products__body">
        <div
          class="top_products__item product"
          v-for="(item, index) in items"
          :key="index"
        >
          <img
            alt=""
            class="product__image"
            :src="`${serverAddr + item.path + item.images[0]}`"
          />
          <div class="product__title">{{ item.title }}</div>
          <div class="product__price">{{ item.cost }} ₽</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      serverAddr: "https://xn--j1ano.com",
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.top-products {
  margin-top: 7px;
  margin-bottom: 5px;

  &__inner {
    width: 493px;
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
    padding: 20px 10px 18px;
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
      margin-bottom: 8px;
      max-width: 131px;
      max-height: 100px;
    }

    &__title {
      font-weight: 500;
      line-height: 17.07px;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
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
