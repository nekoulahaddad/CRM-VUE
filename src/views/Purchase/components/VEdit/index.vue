<template>
  <div class="list__info purchase-edit">
    <div class="group__title text--blue">Редактировать закупку</div>
    <form @submit.prevent="onEdit">
      <div class="list-info__group group">
        <div class="d-flex justify-content-between">
          <div class="flex-1" style="margin-right: 25px">
            <div class="group__content">
              <div class="group__item text--bold-700">Автор:</div>
              <div class="group__value">{{ transformFIO(item.initiator) }}</div>
            </div>
            <div class="group__content">
              <div class="group__item text--bold-700">№ заказа:</div>
              <div class="group__value">{{ item.orderNumber }}</div>
            </div>
            <div class="group__content">
              <div class="group__item text--bold-700">Регион:</div>
              <div class="group__value">{{ item.region.title }}</div>
            </div>
            <div class="group__content">
              <div class="group__item text--bold-700">Категория:</div>
              <div
                class="group__value category"
                @click="changeCategory = !changeCategory"
              >
                {{ category.categoryName }}
              </div>
            </div>
            <div class="group" v-if="changeCategory">
              <div class="group__content">
                <autocomplete
                  :search="searchCategory"
                  :get-result-value="getResultValue"
                  placeholder="Введите категорию..."
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
              <div class="group__title">Описание:</div>
              <div class="group__content">
                <textarea
                  class="form-textarea"
                  placeholder="Введите описание..."
                  v-model="message"
                  maxlength="3000"
                />
              </div>
            </div>
            <div class="group__content">
              <div class="group__item text--bold-700">Ф.И.О. исполнителя:</div>
              <div
                class="group__value executor"
                @click="changeBuyer = !changeBuyer"
              >
                {{ transformFIO(executor) }}
              </div>
            </div>
            <div class="group" v-if="changeBuyer">
              <div class="group__content">
                <autocomplete
                  :search="getBuyersBySearch"
                  :get-result-value="getBuyer"
                  placeholder="Введите Ф.И.О. исполнителя..."
                >
                  <template #result="{ result, props }">
                    <li v-bind="props" @click="selectBuyer(result)">
                      {{ transformFIO(result) }}
                    </li>
                  </template>
                </autocomplete>
              </div>
            </div>
            <div class="group">
              <div class="group__title">Комментарий:</div>
              <div class="group__content">
                <textarea
                  class="form-textarea"
                  placeholder="Введите комментарий..."
                  v-model="comment"
                  maxlength="3000"
                />
              </div>
            </div>
          </div>
          <div>
            <div class="group">
              <div class="group__title">Статус:</div>
              <div class="group__content">
                <v-select
                  :options="
                    statusList.map((status, index) => ({
                      label: status,
                      value: status,
                    }))
                  "
                  :reduce="(item) => item.value"
                  name="status"
                  v-model="status"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Дата поставки:</div>
              <div class="group__content">
                <datetime
                  type="datetime"
                  input-class="forms__container--input"
                  :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
                  v-model="deliveryDate"
                />
              </div>
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
              <div class="list__column justify-center">
                {{ product.article }}
              </div>
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

        <span class="good-add-btn" @click="addProductFormOpened = true">
          Добавить
        </span>
      </div>

      <v-spinner v-if="isLoading" small />
      <v-button v-else red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";
import { REGION_MOSCOW_ID } from "../../../../constants";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: { VSpinner },
  data() {
    return {
      fio: "",
      deletedItems: [],
      articleSearch: null,
      addProductFormOpened: false,
      changeBuyer: false,
      changeCategory: false,
      currentInput: "",
      categories: this.item && this.item.categories ? this.item.categories : [],
      category:
        this.item && this.item.category ? this.item.category.category : null,
      initiator: this.item && this.item.initiator ? this.item.initiator : null,
      executor: this.item && this.item.executor ? this.item.executor : null,
      message: this.item && this.item.message ? this.item.message : "",
      comment: this.item && this.item.comment ? this.item.comment : "",
      status: this.item && this.item.status ? this.item.status : null,
      statusList: [
        "Отказ",
        "В обработке",
        "Подтвержденный",
        "В наличии",
        "Отсутствует у поставщика",
      ],
      isLoading: false,
      users: [],
      regions: [],
      region: this.item && this.item.region ? this.item.region : null,
      title: this.item ? "Редактировать закупку" : "Добавить закупка",
      isLoadingProductSearch: false,
      selectedProducts: [],
      productsList: this.item && this.item.products ? this.item.products : [],
      orderNumber:
        this.item && this.item.orderNumber ? this.item.orderNumber : null,
      orderId: this.item && this.item.orderId ? this.item.orderId : null,
      valute: null,
      deliveryDate:
        this.item && this.item.deliveryDate ? this.item.deliveryDate : null,
      newItem: {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
      },
    };
  },
  methods: {
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
              region: this.region,
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
            region: this.item.region._id,
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
    selectCategory(category) {
      this.category = category;
      this.changeCategory = false;
    },
    getBuyer(result) {
      return "";
    },
    selectBuyer(user) {
      if (user._id === this.currentUser._id) {
        this.$toast.error("Вы не можете быть исполнителем!");
        return;
      }
      this.executor = user;
      this.changeBuyer = false;
    },
    async getBuyersBySearch(search) {
      if (search.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios(`/user/getsearch/${search}`).then((res) => {
          resolve(res.data);
        });
      });
    },
    searchCategory(search) {
      if (search.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/categories/getfromsearch`,
          data: {
            search,
            region: this.item.region._id,
          },
          method: "POST",
        }).then(async (res) => {
          resolve(res.data.categories);
        });
      });
    },
    getResultValue(result) {
      return "";
    },
    onEdit() {
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
          products: this.item ? this.item.products : this.selectedProducts,
          deliveryDate: this.deliveryDate,
        },
      };

      data.dataId = this.item._id;
      let seen = null;
      if (this.item.executor._id === this.currentUser._id) {
        seen = Date.now();
      }
      data.data.seenAt = seen;

      this.isLoading = true;

      axios({
        url: `/purchase/update/`,
        data: data,
        method: "POST",
      })
        .then(() => {
          this.$emit("toggleEdit", this.item);
          this.$emit("fetchData");
          this.$toast.success("Закупка успешно изменена!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  computed: {
    currentUser: {
      get: function () {
        let user = this.getUserRole();
        return user;
      },
    },
  },
  created() {
    console.log(this.item);
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.purchase-edit {
  & > .group__title {
    font-size: 16px;
  }
  .form-select,
  .vdatetime-input,
  .autocomplete-input {
    width: 401px;
  }
  .group-goods__item {
    display: flex;

    & + * {
      margin-top: 5px;
    }
  }
  .group-goods__title {
    font-weight: 600;
  }

  .form-textarea {
  }
  button {
    width: 230px;
  }
  .category,
  .executor {
    border-bottom: 1px dashed;
    cursor: pointer;
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
}
</style>
