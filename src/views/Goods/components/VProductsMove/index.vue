<template>
  <v-modal
    :adaptive="true"
    :minHeight="500"
    :minWidth="976"
    name="moveProducts"
    @before-close="$store.commit('toggleMoveProducts', false)"
  >
    <div class="move-products-modal">
      <div class="vm--modal__title">
        Перенос товаров
        <img
          @click="cancel"
          class="close"
          src="@/assets/icons/close_icon.svg"
          alt=""
        />
      </div>
      <div class="vm--modal__inner">
        <form @submit.prevent="confirm">
          <div class="group">
            <div class="group__title">Выбор категории:</div>
            <autocomplete
              :search="searchCategory"
              :get-result-value="getResultValue"
              placeholder="Введите название категории..."
            >
              <template #result="{ result, props }">
                <li v-bind="props" @click="selectCategory(result)">
                  {{ result.categoryName }}
                </li>
              </template>
            </autocomplete>
          </div>
          <div class="group">
            <div class="group__title">Выбранные товары:</div>
            <div class="group__products" :style="{ height: height }">
              <vue-scroll>
                <div
                  class="group__product"
                  v-if="movedProducts.length"
                  v-for="(product, index) in movedProducts"
                >
                  {{ product.title }}
                </div>
              </vue-scroll>
            </div>
          </div>
        </form>
        <div class="vm--modal__buttons">
          <v-button @click="confirm" red>Перенести</v-button>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    region: {
      type: String,
    },
    movedProducts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentCategory: {},
      category: "",
      currentInput: "",
      tempCategories: [],
      title: "",
    };
  },
  computed: {
    height() {
      if (this.movedProducts.length < 3) {
        return `${this.movedProducts.length * 44}px`;
      }
      return "129px";
    },
  },
  methods: {
    cancel() {
      this.$modal.hide("moveProducts");
    },
    async confirm() {
      for (let i = 0; i < this.movedProducts.length; i++) {
        const product = this.movedProducts[i];
        await axios({
          url: `/products/transfer`,
          data: {
            id: this.category._id,
            type: "category",
            region: this.region,
            productId: product._id,
          },
          method: "POST",
        })
          .then(async () => {
            if (i + 1 === this.movedProducts.length) {
              const msg =
                this.movedProducts.length > 1
                  ? "Товары успешно перенесены!"
                  : "Товар успешно перенесен!";
              this.$emit("refreshGoods");
              this.$toast.success(msg);
              this.cancel();
            }
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      }
    },
    searchCategory(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/categories/getcategoriesandbrandsbysearch/`,
          data: {
            title: input,
            region: this.region,
          },
          method: "POST",
        }).then((res) => {
          resolve(res.data.views);
        });
      });
    },
    getResultValue(result) {
      return result.categoryName;
    },
    selectCategory(category) {
      this.category = category;
    },
  },
};
</script>

<style lang="scss">
.move-products-modal {
  position: relative;
  height: 100%;

  .close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
  }
  .group__product {
    display: flex;
    justify-content: space-between;
    height: 33px;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    border-radius: 5px;
    align-items: center;
    padding-left: 4px;
    padding-right: 10px;
    width: 917px;
    margin: 5px 4px 10px;
  }
  .vm--modal__buttons {
    position: absolute;
    bottom: 15px;
    left: 20px;
  }
}
</style>
