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
              placeholder="Введите номер заказа..."
            />
          </div>
        </div>

        <div class="group">
          <div class="group__title">Товары:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              maxlength="3000"
              placeholder="Введите обязаности кандидата..."
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
      </div>
    </div>

    <v-button red>Создать</v-button>
  </form>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    editedItem: {
      type: Object,
      require: false,
      default: null,
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
  data() {
    return {
      fio: "",
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
          : null,
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
      this.changeStatus(false);
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
            this.changeStatus(true);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
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
            this.changeStatus(true);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
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
}
</style>
