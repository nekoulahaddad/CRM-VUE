<template>
  <div class="list__info purchase-edit">
    <div class="group__title text--blue">Редактировать закупку</div>
    <form @submit.prevent="onEdit">
      <div class="list-info__group group">
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
        <div class="group">
          <div class="group__title">Статус:</div>
          <div class="group__content">
            <select class="form-select" name="status" v-model="status">
              <option selected disabled :value="null">Выбрать статус</option>
              <option
                v-for="(item, index) in statusList"
                :value="item"
                :key="index"
              >
                {{ item }}
              </option>
            </select>
          </div>
        </div>

        <div class="group__content">
          <div class="group__item text--bold-700">ФИО исполнителя:</div>
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
              placeholder="Введите ФИО исполнителя..."
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
      <v-spinner v-if="isLoading" small />
      <v-button v-else red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";

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
    };
  },
  methods: {
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
};
</script>

<style lang="scss">
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
    width: 967px;
  }
  button {
    width: 230px;
  }
  .category,
  .executor {
    border-bottom: 1px dashed;
    cursor: pointer;
  }
}
</style>
