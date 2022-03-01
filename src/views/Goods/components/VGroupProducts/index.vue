<template>
  <div class="sub-products">
    <div class="sub-products__inner">
      <div
        class="sub-products__item item"
        v-for="(product, index) in products"
        :key="index"
      >
        <div class="item__title">{{ product.title }}</div>
        <div class="item__action">
          <div class="table__actions">
            <div class="table__icon">
              <img src="@/assets/icons/write_icon.svg" alt="" />
            </div>
            <div class="table__icon">
              <img src="@/assets/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: Array,
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.sub-products {
  &__inner {
    padding: 15px;
  }

  &__item {
    background-color: $color-gray-secondary;
    border-radius: $border-radius;
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    justify-content: space-between;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

    & + * {
      margin-top: 10px;
    }
  }
  .item {
    &__title {
      font-size: 14px;
      font-weight: 700;
    }
  }
}
</style>
