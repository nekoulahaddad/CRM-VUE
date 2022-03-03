<template>
  <div class="list__info list-info product-move">
    <div class="group__title text--blue">
      Переместить товар в другую категорию:
    </div>
    <template v-if="movedProduct && movedProduct._id">
      <form @submit.prevent="onProductTransfer">
        <div class="group">
          <div class="group__title">Выберите категорию:</div>
          <div class="group__content">
            <autocomplete
              ref="executors"
              :search="searchByExecutor"
              :get-result-value="getResultValue"
              placeholder="Введите исполнителя задачи..."
            >
              <template #result="{ result, props }">
                <li v-bind="props" @click="selectCategory(result)">
                  {{ result.categoryName }}
                </li>
              </template>
            </autocomplete>
          </div>
        </div>
        <v-spinner v-if="isLoading" small />
        <v-button v-else red>Сохранить</v-button>
      </form>
    </template>
  </div>
</template>

<script>
import VSpinner from "@/components/VSpinner";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: { VSpinner },
  props: {
    movedProduct: {
      type: Object,
      default: () => {},
    },
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
      isLoading: false,
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange() {
      this.tempCategories = [];
    },
    getResultValue(result) {
      return result.categoryName;
    },
    selectCategory(category) {
      this.category = category;
    },
    searchByExecutor(input) {
      if (input.length < 1) {
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
        }).then((result) => {
          resolve(result.data.views);
        });
      });
    },
    deleteChip() {
      this.category = null;
    },
    async onProductTransfer() {
      if (this.movedProduct && this.movedProduct._id) {
        if (!this.category) {
          this.$toast.error("Категория или бренд не заполнены!");
          return;
        }

        this.isLoading = true;

        axios({
          url: `/products/transfer`,
          data: {
            id: this.category._id,
            type: "category",
            region: this.region,
            productId: this.movedProduct._id,
          },
          method: "POST",
        })
          .then(() => {
            this.isLoading = false;
            this.$emit("refreshGoods");
            this.$toast.success(`Товар успешно перенесен!`);
            this.$emit("toggleMoveProduct", this.movedProduct);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.isLoading = false;
          });
      }

      if (this.movedProducts.length) {
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
            .then(() => {
              this.$toast.success(`Товар ${product.titile} успешно перенесен!`);
              if (i + 1 === this.movedProducts.length) {
                this.$emit("clearSelectedProducts");
              }
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
            });
        }
      }
    },
  },
  created() {
    axios({
      url: `/categories/getbyid`,
      data: {
        categoryId:
          this.movedProduct.category_id || this.movedProducts[0].category_id,
        region: this.region,
      },
      method: "POST",
    })
      .then(async (res) => {
        let result = await res;
        this.currentCategory = result.data.category;
        this.title = `Перенести товар из категории ${result.data.category.categoryName}`;
        this.changeStatus(true);
      })
      .catch((err) => {
        this.$toast.error(err.response.data.message);
        this.changeStatus(true);
      });
  },
};
</script>

<style lang="scss">
.product-move {
  .autocomplete-input {
    width: 401px;
  }
}
</style>
