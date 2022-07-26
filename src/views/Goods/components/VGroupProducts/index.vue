<template>
  <div class="sub-products">
    <div class="sub-products__inner">
      <div
        style="margin-bottom: 15px"
        v-for="(product, index) in products"
        :key="index"
      >
        <div class="sub-products__item item">
          <div class="item__title">
            <a
              v-if="product.visible"
              target="_blank"
              :href="`https://tdcsk.com/products/region/${regionValue}/${product.slug}`"
            >
              {{ product.title }}
            </a>
            <span v-else class="none">
              {{ product.title }}
            </span>
          </div>
          <div class="item__action">
            <div class="table__actions">
              <div class="table__icon">
                {{ product.article }}
              </div>
              <div class="table__icon">
                <!-- Видимость товара -->
                <template
                  v-if="
                    role === 'superadmin' ||
                    role === 'content' ||
                    role === 'director' ||
                    role === 'manager'
                  "
                >
                  <v-spinner
                    extraSmall
                    v-if="changeVisible._id === product._id"
                  />
                  <VueCustomTooltip
                    v-else
                    :label="product.visible ? 'Скрыть товар' : 'Показать товар'"
                  >
                    <img
                      alt=""
                      :src="
                        product.visible
                          ? require('@/assets/icons/eye_close.svg')
                          : require('@/assets/icons/eye.svg')
                      "
                      @click="
                        changeProductVisibility(
                          product._id,
                          product.visible,
                          product
                        )
                      "
                    />
                  </VueCustomTooltip>
                </template>
                <img
                  alt=""
                  v-else
                  class="opacity-30"
                  :src="
                    product.visible
                      ? require('@/assets/icons/eye_close.svg')
                      : require('@/assets/icons/eye.svg')
                  "
                />
              </div>
              <div class="table__icon" style="min-width: 28px">
                <template
                  v-if="
                    role === 'superadmin' ||
                    role === 'content' ||
                    role === 'director' ||
                    role === 'manager'
                  "
                >
                  <VueCustomTooltip
                    label="Изменить"
                    v-if="editedItem._id !== product._id"
                  >
                    <img
                      alt=""
                      @click="toggleEdit(product)"
                      src="@/assets/icons/write_icon.svg"
                    />
                  </VueCustomTooltip>
                  <img
                    alt=""
                    v-else
                    @click="toggleEdit(product)"
                    src="@/assets/icons/arrow_top_icon.svg"
                  />
                </template>
                <img
                  alt=""
                  v-else
                  class="opacity-30"
                  src="@/assets/icons/write_icon.svg"
                />
              </div>
              <div class="table__icon">
                <img
                  v-if="
                    role === 'superadmin' ||
                    role === 'content' ||
                    role === 'director' ||
                    role === 'manager'
                  "
                  @click="$emit('toggleDeleteGroupProduct', group, product)"
                  src="@/assets/icons/trash_icon.svg"
                  alt=""
                />
                <img
                  alt=""
                  v-else
                  class="opacity-30"
                  src="@/assets/icons/trash_icon.svg"
                />
              </div>
            </div>
          </div>
        </div>

        <v-product-edit
          :region="region"
          :editedProduct="product"
          @refreshGoods="$emit('refreshGoods')"
          @toggleEdit="toggleEdit"
          v-if="product._id === editedItem._id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";
import VProductEdit from "../VProductEdit";

export default {
  props: {
    role: String,
    group: Object,
    products: Array,
    region: String,
    visible: Boolean,
  },
  data() {
    return {
      editedItem: {},
      changeVisible: {},
    };
  },
  computed: {
    regionValue() {
      try {
        return JSON.parse(localStorage.getItem("region")).value;
      } catch (e) {
        return "moscow";
      }
    },
  },
  components: { VProductEdit, VSpinner },
  methods: {
    toggleEdit(item) {
      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
    changeProductVisibility(id, visible, item) {
      this.changeVisible = item;
      let productData = {
        region: this.region,
        productId: id,
        visible: !visible,
      };
      axios({
        url: `/products/updatevisibility/`,
        data: productData,
        method: "POST",
      })
        .then((res) => {
          item.visible = res.data.product.visible;
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
        })
        .finally(() => {
          this.changeVisible = {};
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
    &:hover {
      box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    }
    &__title {
      font-size: 14px;
      font-weight: 700;
    }
  }
  .none {
    opacity: 0.3;
  }
}
</style>
