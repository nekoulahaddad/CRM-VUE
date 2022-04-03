<template>
  <form @submit.prevent="onCreate" class="purchase-form">
    <div class="purchase-form__title text--blue">Информация о закупке:</div>
    <div class="d-flex justify-content-between">
      <div class="flex-1 purchase-form__left" style="margin-right: 25px">
        <div class="group">
          <div class="d-flex">
            <div class="group__title" style="margin-right: 15px">
              Ф.И.О. исполнителя:
            </div>
            <div>
              <span
                @click="addExecutor = !addExecutor"
                style="border-bottom: 1px dashed; cursor: pointer"
              >
                {{ transformFIO(executor) || "Добавить" }}
              </span>
            </div>
          </div>

          <div class="group__content" v-if="addExecutor">
            <autocomplete
              class="executor"
              :search="getBuyersBySearch"
              :get-result-value="getBuyer"
              placeholder="Введите Ф.И.О. исполнителя..."
            >
              <template #result="{ result, props }">
                <li v-bind="props" @click="selectUser(result)">
                  {{ transformFIO(result) }}
                </li>
              </template>
            </autocomplete>
          </div>
        </div>
        <div class="group" v-if="editedItem">
          <div class="group__title">Ф.И.О. автора:</div>
          <div class="group__content">
            <input
              readonly
              class="form-control"
              type="text"
              placeholder="Введите Ф.И.О. автора..."
              :value="transformFIO(initiator)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">№ заказа:</div>
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              v-model="orderNumber"
              placeholder="Введите номер заказа..."
              @input="findOrderByNumber(orderNumber)"
            />
          </div>
        </div>

        <div class="group">
          <div class="group__title">Описание:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              maxlength="3000"
              placeholder="Введите описание товара..."
            />
          </div>
        </div>
      </div>
      <div class="purchase-form__right">
        <div class="group">
          <div class="group__title">Регионы:</div>
          <div class="group__content">
            <v-select
              name="region"
              :options="
                regions.map((region) => ({
                  label: region.title,
                  value: region._id,
                }))
              "
              :reduce="(item) => item.value"
              v-model="region"
            />
          </div>
        </div>

        <div class="group">
          <div class="group__title">Категория:</div>
          <div class="group__content">
            <autocomplete
              :disabled="!region"
              :search="getCategoriesBySearch"
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
        </div>

        <div class="group">
          <div class="group__title">Статус:</div>
          <div class="group__content">
            <v-select
              name="status"
              v-model="status"
              :options="
                statusList.map((item) => ({
                  label: item,
                  value: item,
                }))
              "
              :reduce="(item) => item.value"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="group" style="margin-top: 10px">
      <div class="group__title">Товары:</div>
      <div class="list sub-list">
        <div class="list__header">
          <div class="list__columns">
            <div class="list__column">№:</div>
            <div class="list__column justify-center">Название товара:</div>
            <div class="list__column justify-center">Артикул:</div>
            <div class="list__column justify-center">Кол-во:</div>
          </div>
        </div>
        <div
          v-for="(product, index) in productsList"
          :key="product._id"
          class="list__row list__row--shadow list__row--white"
          :class="{
            'list__row--delete': deletedItems.includes(product._id),
          }"
        >
          <div class="list__columns">
            <div class="list__column">
              {{ index + 1 }}
            </div>
            <div class="list__column bg bg--blue-light justify-center">
              {{ product.title }}
            </div>
            <div class="list__column justify-center">{{ product.article }}</div>
            <div class="list__column justify-center">
              {{ product.quantity }}
            </div>
            <div class="list__column d-flex justify-end">
              <VueCustomTooltip
                label="Отменить удаление"
                v-if="deletedItems.includes(product._id)"
              >
                <img
                  @click="deleteItem(product._id)"
                  src="@/assets/icons/trash_icon.svg"
                  alt=""
                />
              </VueCustomTooltip>
              <VueCustomTooltip label="Удалить" v-else>
                <img
                  @click="deleteItem(product._id)"
                  src="@/assets/icons/trash_icon.svg"
                  alt=""
                />
              </VueCustomTooltip>
            </div>
          </div>
        </div>
      </div>

      <div
        style="margin-bottom: 10px"
        class="list__row list__row--shadow list__row--white"
        v-if="addProductFormOpened"
      >
        <div class="list__columns sub-list-columns">
          <div class="list__column d-flex justify-center">
            {{ productsList.length + 1 }}
          </div>
          <div class="list__column add-good-item">
            <autocomplete
              :search="findItemByTitle"
              :get-result-value="getItemTitle"
              placeholder="Введите название товара..."
            >
              <template #result="{ result, props }">
                <li v-bind="props" @click="selectedProductItem(result)">
                  {{ result.title }}
                </li>
              </template>
            </autocomplete>
          </div>
          <div class="list__column d-flex justify-center">
            <input
              class="form-control"
              type="number"
              v-model="articleSearch"
              placeholder="000000"
              @keyup="findItemByArticle"
            />
          </div>
          <div class="list__column d-flex justify-center">
            <input
              min="1"
              class="form-control"
              type="number"
              v-model="newItem.quantity"
            />
          </div>
          <div class="list__column d-flex align-items-center justify-end">
            <VueCustomTooltip label="Добавить">
              <img
                alt=""
                src="@/assets/icons/check_black.svg"
                @click="addItemToProducts(newItem)"
              />
            </VueCustomTooltip>
            <VueCustomTooltip label="Удалить">
              <img
                alt=""
                src="@/assets/icons/trash_icon.svg"
                @click="cancelProductSelection"
              />
            </VueCustomTooltip>
          </div>
        </div>
      </div>

      <span class="good-add-btn" @click="addProductFormOpened = true"
        >Добавить</span
      >
    </div>

    <v-button red>Создать</v-button>
  </form>
</template>

<script>
import axios from "@/api/axios";
import { REGION_MOSCOW_ID } from "../../../../constants";

export default {
  props: {
    editedItem: {
      type: Object,
      require: false,
      default: null,
    },
    filtersOptions: Object,
  },
  computed: {
    currentUser: {
      get: function () {
        let user = this.getUserRole();
        return user;
      },
    },
  },
  data() {
    return {
      fio: "",
      newItem: {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
      },
      deletedItems: [],
      articleSearch: null,
      addProductFormOpened: false,
      addExecutor: false,
      currentInput: "",
      categories:
        this.editedItem && this.editedItem.categories
          ? this.editedItem.categories
          : [],
      category:
        this.editedItem && this.editedItem.category
          ? this.editedItem.category.category
          : null,
      initiator:
        this.editedItem && this.editedItem.initiator
          ? this.editedItem.initiator
          : null,
      executor:
        this.editedItem && this.editedItem.executor
          ? this.editedItem.executor
          : null,
      message:
        this.editedItem && this.editedItem.message
          ? this.editedItem.message
          : "",
      comment:
        this.editedItem && this.editedItem.comment
          ? this.editedItem.comment
          : "",
      status:
        this.editedItem && this.editedItem.status
          ? this.editedItem.status
          : null,
      statusList: [
        "отказ",
        "в обработке",
        "подтвержденный",
        "в наличии",
        "отсутствует у поставщика",
      ],
      users: [],
      regions: [],
      region:
        this.editedItem && this.editedItem.region
          ? this.editedItem.region
          : this.filtersOptions.region,
      title: this.editedItem ? "Редактировать закупку" : "Добавить закупка",
      isLoadingProductSearch: false,
      selectedProducts: [],
      productsList:
        this.editedItem && this.editedItem.products
          ? this.editedItem.products
          : [],
      orderNumber:
        this.editedItem && this.editedItem.orderNumber
          ? this.editedItem.orderNumber
          : null,
      orderId:
        this.editedItem && this.editedItem.orderId
          ? this.editedItem.orderId
          : null,
      valute: null,
      deliveryDate:
        this.editedItem && this.editedItem.deliveryDate
          ? this.editedItem.deliveryDate
          : null,
    };
  },
  methods: {
    findOrderByNumber(number) {
      this.productsList = [];
      this.selectedProducts = [];
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        axios({
          url: `/orders/getByNumber`,
          params: {
            orderNumber: number,
          },
          method: "GET",
        })
          .then(async (result) => {
            let res = await result;
            if (res.data?.order && res.data.order._id) {
              const orderRegionId = res.data.order.region._id;
              this.orderId = res.data.order._id;
              this.$toast.success("Заказ найден");
              this.valute = res.data.order.region.valute.icon;
              axios({
                url: `/orders/getproducts`,
                data: {
                  orderId: this.orderId,
                },
                method: "POST",
              }).then((res) => {
                this.productsList = res.data;
              });

              axios({
                url: `/regions/getbyid/`,
                data: {
                  regionId: orderRegionId,
                },
                method: "POST",
              }).then((res) => {
                this.region = res.data.region;
              });
            } else {
              this.$toast.warning("Заказ не найден");
              this.orderId = null;
            }
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      }, 500);
    },
    deleteItem(_id) {
      if (this.deletedItems.includes(_id)) {
        this.deletedItems = this.deletedItems.filter((id) => id !== _id);
      } else {
        this.deletedItems.push(_id);
      }
    },
    cancelProductSelection() {
      this.addProductFormOpened = false;
      this.selectedProduct = null;
      this.newItem = {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
      };
      this.articleSearch = null;
    },
    addItemToProducts(item) {
      let product = {
        full_cost: item.full_cost,
        club_cost: item.club_cost,
        cost: item.cost,
        discount_price: item.discount_price || null,
        product_id: item.product_id,
        quantity: item.quantity,
        article: item.article,
        title: item.title,
      };

      if (product.product_id === undefined) {
        this.$toast.warning(
          "Товар не найден или указан неверный артикул, пожалуйста, найдите товар по артикулу или удалите товар"
        );
        return;
      }
      this.productsList.push(product);
      this.addProductFormOpened = false;
      this.newItem = {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
        full_cost: 0,
      };
      this.selectedProduct = null;
      this.articleSearch = null;
    },
    findItemByArticle(article) {
      const articleNumber = article.target.value;
      if (!articleNumber) {
        this.$toast.warning("Артикул продукта не может быть типом строки");
        return;
      }
      if (articleNumber.length >= 4) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          axios({
            url: `/products/getproductbyarticle/`,
            data: {
              article: articleNumber,
              region: this.orderForm.region,
            },
            method: "POST",
          })
            .then(async (result) => {
              let res = await result;
              if (res.data.product.length !== 0) {
                this.selectedProduct = res.data.product;
                let product = res.data.product;
                this.newItem.title = product.title;
                this.newItem.article = product.article;
                this.newItem._id = product._id;
                this.newItem.product_id = product._id;
                this.newItem.club_cost = product.club_cost;
                this.newItem.cost = product.cost;
                this.newItem.quantity = 1;
                this.$toast.success("Продукт, найденный по вашему запросу");
              } else {
                this.$toast.warning(
                  "Товар по артику не найден, пожалуйста введите правильный артикул товара"
                );
                this.newItem = {
                  title: "Введите артикул товара",
                  quantity: 1,
                  cost: 0,
                };
                this.selectedProduct = null;
              }
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
            });
        }, 500);
      }
    },
    selectedProductItem(item) {
      this.articleSearch = item.article;
      this.newItem.title = item.title;
      this.newItem.article = item.article;
      this.newItem._id = item._id;
      this.newItem.product_id = item._id;
      this.newItem.club_cost = item.club_cost;
      this.newItem.full_cost = item.full_cost;
      this.newItem.cost = item.cost;
      this.newItem.quantity = 1;
    },
    getItemTitle(result) {
      return result.title;
    },
    findItemByTitle(title) {
      if (title.trim().length < 3) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/products/getproductbysearch/`,
          data: {
            search: title,
            region: this.filtersOptions.region || REGION_MOSCOW_ID,
          },
          method: "POST",
        })
          .then(async (result) => {
            let res = await result;
            resolve(res.data.products);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      });
    },
    getBuyersBySearch(input) {
      if (input.length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getsearch/${input}`).then(async (res) => {
          resolve(res.data);
        });
      });
    },
    selectUser(user) {
      if (user._id === this.currentUser._id) {
        this.$toast.error("Вы не можете быть исполнителем!");
        this.fio = ``;
        this.users = [];
        return;
      }
      if (this.executor === null) {
        this.executor = user;
        this.fio = ``;
        this.users = [];
        return;
      }
      this.$toast.error("При выбранном отделе исполнитель только один!");
      return;
    },
    selectCategory(category) {
      this.category = category;
      this.currentInput = "";
    },
    getBuyer(result) {
      return "";
    },
    getResultValue(result) {
      return result.categoryName;
    },
    getCategoriesBySearch(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/categories/getcategoriesbysearch/`,
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
    onCreate() {
      if (!this.region) {
        this.$toast.error("Укажите регион!", "Ошибка");
        return;
      }
      if (!this.orderId) {
        this.$toast.error("Номер заказа отсутствует", "Ошибка");
        return;
      }

      let data = {
        data: {
          initiator: this.initiator,
          executor: this.executor,
          status: this.status,
          category: this.category,
          region: this.region,
          message: this.message,
          comment: this.comment,
          orderNumber: this.orderNumber,
          orderId: this.orderId,
          products: this.editedItem
            ? this.editedItem.products
            : this.selectedProducts,
          deliveryDate: this.deliveryDate,
        },
      };

      if (
        this.editedItem &&
        !this.editedItem.type &&
        this.editedItem.type !== "fromOrder"
      ) {
        data.dataId = this.editedItem._id;
        let seen = null;
        if (this.editedItem.executor._id === this.currentUser._id) {
          seen = Date.now();
        }
        data.data.seenAt = seen;
        axios({
          url: process.env.VUE_APP_DEVELOP_URL + `/purchase/update/`,
          data: data,
          method: "POST",
        })
          .then(async () => {
            const transformedData = {
              _id: data.dataId,
              ...data.data,
              category: {
                category: {
                  ...data.data.category,
                },
              },
              createdAt: this.editedItem.createdAt,
              seenAt: seen,
            };
            this.$emit("editItem", transformedData);

            this.$toast.success("Закупка успешно обновлен!");
            this.$emit("toggleOpen", transformedData);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      } else {
        data.data.initiator = this.currentUser;
        axios({
          url: process.env.VUE_APP_DEVELOP_URL + `/purchase/post/`,
          data: data,
          method: "POST",
        })
          .then(async (res) => {
            const createdData = await res;
            this.$emit("createItem", {
              ...data.data,
              category: {
                category: {
                  ...data.data.category,
                },
              },
              _id: createdData.data.data._id,
              number: createdData.data.data.number,
              createdAt: createdData.data.data.createdAt,
            });
            this.$toast.success("Закупка успешно добавлен!");
            this.$emit("toggleOpen", createdData);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      }
    },
  },
  async created() {
    await axios({
      url: "/regions/get",
    }).then(async (res) => {
      let result = await res;
      this.regions = result.data.regions;
    });
    if (this.editedItem) {
      await axios({
        url: `/categories/get/`,
        data: {
          options: {
            nesting: 0,
            region: this.region._id,
          },
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        this.editedItem.categories = result.data.categories;
        this.categories = result.data.categories;
        this.tempViews = result.data.categories;
      });
    }
  },
  watch: {
    currentInput: function () {
      if (this.region === null) {
        this.$toast.warning("Укажите регион!", "Ошибка");
      }
    },
    region: async function () {
      if (this.region !== null) {
        this.currentInput = "";
        await axios({
          url: process.env.VUE_APP_DEVELOP_URL + `/categories/get/`,
          data: {
            options: {
              nesting: 0,
              region: this.region._id,
            },
          },
          method: "POST",
        }).then(async (res) => {
          let result = await res;
          this.category = null;
          this.categories = result.data.categories;
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.purchase-form {
  &__left {
    .executor,
    .autocomplete,
    .autocomplete-input {
      width: 100%;
    }
  }
  &__right {
    .autocomplete-input {
      width: 401px;
      &[disabled] {
        opacity: 0.7;
      }
    }
  }
  .form-control {
  }
  .form-textarea {
    height: 150px;
  }
  .form-select {
    max-width: 401px;
  }
  button {
    width: 230px;
    height: 37px;
    margin-top: 10px;
  }
  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .good-add-btn {
    width: 230px;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    background-color: $color-red;
    color: $color-white;
    cursor: pointer;
    font-size: 17px;
    font-weight: 700;
    border-radius: $border-radius;
  }
  .sub-list {
    width: 100%;

    .list__header {
      height: auto;
      position: relative;

      &:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #f6f6f6;
        border-radius: 5px;
      }
    }

    .list__columns {
      background-color: transparent;

      .list__column {
        font-size: 13px;
        display: flex;
      }
    }
  }
  .sub-list .list__columns,
  .sub-list-columns {
    grid-template-columns: 50px 700px 220px 100px 1fr !important;

    .list__column {
      font-size: 13px !important;
    }

    span[role="tooltip"] + * {
      margin-left: 20px;
    }
  }
  .form-control[type="number"] {
    width: 100px;
  }
  span[role="tooltip"] {
    &:after {
      background-color: $color-black;
      color: $color-white;
      border-radius: $border-radius;
    }

    & + * {
      margin-left: 20px;
    }
  }
  .list__row--delete {
    text-decoration: line-through;
  }
}
</style>
