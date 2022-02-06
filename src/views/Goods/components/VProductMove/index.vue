<template>
  <div class="list__info list-info product-list-info">
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
                <li v-bind="props">
                  {{ transformFIO(result) }}
                </li>
              </template>
            </autocomplete>
          </div>
        </div>
        <v-button red>Сохранить</v-button>
      </form>
    </template>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: { VButton },
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
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange() {
      this.tempCategories = [];
    },
    getResultValue() {
      return "";
    },
    searchByExecutor(input) {
      if (input.length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios({
          url: `/categories/getcategoriesandbrandsbysearch/`,
          data: {
            title: this.currentInput,
            region: this.region,
          },
          method: "POST",
        }).then(async (res) => {
          let result = await res;
          if (!result.data.views.length) {
            this.$toast.error("Категория не найдена", "Ошибка");
            return;
          }
          if (result.data.views.length === 1) {
            if (result.data.views[0].name) {
              this.$toast.success("Бренд успешно выбран!");
            } else {
              this.$toast.success("Категория успешно выбрана!");
            }
            this.category = result.data.views[0];
            this.currentInput = "";
            return;
          }
          this.tempCategories = result.data.views;
        });
      });
    },
    deleteChip() {
      this.category = null;
    },
    async onProductTransfer() {
      if (this.movedProduct && this.movedProduct._id) {
        this.changeStatus(false);
        if (!this.category) {
          this.$toast.error("Категория или бренд не заполнены!");
          this.changeStatus(true);
          return;
        }
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
          .then(async () => {
            this.$toast.success("Товар успешно перенесен!");
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          })
          .finally(() => {
            this.changeStatus(true);
          });
      }
      if (this.movedProducts.length) {
        for (let i = 0; i < this.movedProducts.length; i++) {
          this.changeStatus(false);
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
              this.$toast.success(`Товар ${product.titile} успешно перенесен!`);
              if (i + 1 === this.movedProducts.length) {
                this.$emit("clearSelectedProducts");
                this.$emit("toggleOpen");
              }
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
            })
            .finally(() => {
              this.changeStatus(true);
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
