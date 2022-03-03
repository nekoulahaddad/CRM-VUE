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
              <!-- Видимость товара -->
              <VueCustomTooltip
                :label="product.visible ? 'Скрыть товар' : 'Показать товар'"
              >
                <img
                  alt=""
                  :src="
                    product.visible
                      ? require('@/assets/icons/eye_close.svg')
                      : require('@/assets/icons/eye.svg')
                  "
                  :class="{ none: product.visible }"
                  @click="
                    changeProductVisibility(
                      product._id,
                      product.visible,
                      product
                    )
                  "
                />
              </VueCustomTooltip>
            </div>
            <div class="table__icon">
              <img src="@/assets/icons/write_icon.svg" alt="" />
            </div>
            <div class="table__icon">
              <img
                @click="$emit('toggleDeleteGroupProduct', group, product)"
                src="@/assets/icons/trash_icon.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    group: Object,
    products: Array,
  },
  methods: {
    changeProductVisibility(id, visible, item) {
      let productData = {
        region: this.$parent.filtersOptions.region,
        productId: id,
        visible: !visible,
      };
      axios({
        url: `/products/updatevisibility/`,
        data: productData,
        method: "POST",
      })
        .then((res) => {
          this.item.visible = res.data.product.visible;
          this.$emit("editProduct", res.data.product, item);
          this.$toast.success(
            `Товар ${
              res.data.product.visible
                ? "будет отображаться"
                : "не будет отображаться"
            }`
          );
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
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
