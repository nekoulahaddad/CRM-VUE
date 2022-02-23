<template>
  <div class="list__info purchase-edit">
    <div class="group__title text--blue">Редактировать закупку</div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">ФИО инициатора:</div>
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
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("goods") }}
        </div>
        <div class="group__value">
          <div
            v-for="product in item.products"
            class="group__goods group-goods"
          >
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("name") }}</div>
              <div class="group-goods__value">{{ product.title }}</div>
            </div>
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("article") }}</div>
              <div class="group-goods__value">{{ product.article }}</div>
            </div>
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("quantity") }}</div>
              <div class="group-goods__value">{{ product.quantity }}</div>
            </div>
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("total") }}</div>
              <div class="group-goods__value">
                {{ product.cost }} {{ product.valute }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="group">
        <div class="group__title">Описание:</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            placeholder="Введите описание..."
            v-model="message"
          />
        </div>
      </div>
    </div>
    <v-button red>Сохранить</v-button>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fio: "",
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
        "отказ",
        "в обработке",
        "подтвержденный",
        "в наличии",
        "отсутствует у поставщика",
      ],
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
    };
  },
  methods: {
    selectCategory(category) {
      this.category = category;
    },
    searchCategory(search) {
      if (search.trim().length < 3) {
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
      return result.categoryName;
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
};
</script>

<style lang="scss">
.purchase-edit {
  .group__title {
    font-size: 16px;
  }
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
    width: 967px;
  }
  button {
    width: 230px;
  }
}
</style>
