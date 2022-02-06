<template>
  <form @submit.prevent="onCreate">
    <div class="add-vacancy-row__title text--blue">Информация о закупке:</div>
    <div class="group">
      <div class="group__title">ФИО автора:</div>
      <div class="group__content">
        <input
          required
          class="form-control"
          type="text"
          placeholder="Введите автора..."
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
      <div class="group__title">Регионы:</div>
      <div class="group__content">
        <select
          required
          class="form-select"
          name="region"
          v-model="region"
          @change="onChange($event)"
        >
          <option selected disabled :value="null">Выберите регион</option>
          <option v-for="region in regions" :value="region._id">
            {{ region.title }}
          </option>
        </select>
      </div>
    </div>
    <div class="group">
      <div class="group__title">Категория:</div>
      <div class="group__content">
        <input
          required
          class="form-control"
          type="text"
          placeholder="Введите название категории..."
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Товары:</div>
      <div class="group__content">
        <textarea
          required
          class="form-textarea"
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
          placeholder="Введите описание товара..."
        />
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
  components: { VForm },
  data() {
    return {
      fio: "",
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
