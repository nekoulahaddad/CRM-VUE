<template>
  <v-modal
    :adaptive="true"
    :minHeight="750"
    :minWidth="1010"
    name="sendDelivery"
  >
    <div class="vm--modal__title">Отправка закупщику</div>
    <div class="vm--modal__inner vm--modal-send-delivery">
      <div class="group__content">
        {{ category }}
        <div class="group__item text--bold-700">ФИО инициатора:</div>
        <div class="group__value">
          {{ transformFIO(editedItem.initiator) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">№ заказа:</div>
        <div class="group__value">{{ editedItem.orderNumber }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">Регион:</div>
        <div class="group__value">
          {{ editedItem && editedItem.region && editedItem.region.title }}
        </div>
      </div>

      <div class="group">
        <div class="group__title">Категория:</div>
        <div class="group__content">
          <autocomplete
            required
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
          <textarea class="form-textarea" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Товары:</div>
        <div class="group__content">
          <div class="list">
            <div class="list__header">
              <div class="list__columns">
                <div class="list__column">Наименование:</div>
                <div class="list__column">Артикул:</div>
                <div class="list__column">Количество:</div>
                <div class="list__column">Итого:</div>
              </div>
            </div>
            <div
              class="group__goods"
              v-for="(product, index) in editedItem.products"
              :key="index"
            >
              <div class="group__good">
                {{ product.title }}
              </div>
              <div class="group__good">
                {{ product.article }}
              </div>
              <div class="group__good">
                {{ product.quantity }}
              </div>
              <div class="group__good">
                {{ product.cost }}
                {{ product.valute ? product.valute : valute }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="vm--modal__buttons">
        <v-button @click="confirm" red>Отправить</v-button>
        <v-button @click="cancel" white>Отмена</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    editedItem: Object,
  },
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
    selectCategory(category) {
      this.category = category;
    },
    getResultValue(result) {
      return result.categoryName;
    },
    cancel() {
      this.$modal.hide("sendDelivery");
    },
    confirm() {},
    searchCategory(search) {
      if (search.trim().length < 3) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/categories/getfromsearch`,
          data: {
            search,
            region: this.editedItem.region._id,
          },
          method: "POST",
        }).then(async (res) => {
          resolve(res.data.categories);
        });
      });
    },
  },
  async created() {
    await axios({
      url: "/regions/get",
    }).then(async (res) => {
      let result = await res;
      this.regions = result.data.regions;
    });
  },
  watch: {
    currentInput: function () {
      if (this.region === null) {
        this.$toast.warning("Укажите регион!", "Ошибка");
      }
    },
  },
};
</script>

<style lang="scss">
.vm--modal {
  &__text {
    margin-bottom: 20px;
  }
  &__buttons {
  }
  .group__goods {
    text-align: left;
    display: grid;
    grid-template-columns: 650px 100px 110px 100px;

    .group__good {
      margin-bottom: 10px;
    }
  }
  .vm--modal-send-delivery {
    .form-textarea {
      width: 967px;
    }
    .vm--modal__buttons {
      justify-content: flex-start;
    }
    .autocomplete-input {
      width: 401px;
    }
    .list__header {
      height: auto;

      .list__columns {
        grid-template-columns: 650px 100px 110px 100px;

        padding-left: 0;

        .list__column {
          text-align: left;
        }
      }
    }
  }
}
</style>
