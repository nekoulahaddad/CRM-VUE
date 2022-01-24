<template>
  <div class="list__info list-info orders-edit-form">
    <form>
      <div class="group__title text--blue">Редактировать заказ:</div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("orderNumber") }}
          </div>
          <div class="group__value">{{ editedItem.number }}</div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("profile") }}
          </div>
          <div class="group__value">
            {{ transformProfile(editedItem.payment) }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("customer") }}
          </div>
          <div class="group__value">
            {{
              user
                ? transformName(user)
                : editedItem.client
                ? transformName(editedItem.client)
                : ""
            }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("phone") }}
          </div>
          <div class="group__value">
            {{ user ? user.phone : editedItem.client.phone }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("email") }}
          </div>
          <div class="group__value">
            {{ user ? user.email : editedItem.client.email }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("city") }}
          </div>
          <div class="group__value">
            {{ user ? user.region.title : editedItem.region.title }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("created") }}
          </div>
          <div class="group__value">
            {{ transformDate(editedItem.createdAt) }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("payed") }}
          </div>
          <div class="group__value">
            <span v-if="editedItem.buyed">{{
              transformDate(editedItem.buyed)
            }}</span>
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("payedType") }}
          </div>
          <div class="group__value">
            {{ transformPayment(editedItem.payment, editedItem.acquiringNum) }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("deliveryType") }}
          </div>
          <div class="group__value">
            {{ transformDeliveryType(editedItem.typeDelivery) }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("status") }}
          </div>
          <div class="group__value">
            <div v-html="transformStatus(editedItem.status)"></div>
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("oneC") }}
          </div>
          <div class="group__value">{{ getOneCStatus(editedItem.oneC) }}</div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("delivered") }}
          </div>
          <div class="group__value">
            {{ editedItem.deliver ? transformDate(editedItem.deliver) : "" }}
          </div>
        </div>
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("manager") }}
          </div>
          <div class="group__value">{{ fio }}</div>
        </div>
      </div>

      <div class="group">
        <div class="group__title">{{ $t("managerComment") }}</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            name="manager_comment"
            v-model="editedItem.manager_comment"
          />
        </div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    VButton,
  },
  data() {
    return {
      isDeclained: false,
      editManager: false,
      sendToBuyer: false,
      productTitleSearch: null,
      productsList: [],
      selectedProductList: [],
      sendedProductList: [],
      selectedProduct: null,
      isLoadingProductSearch: false,
      users: [],
      date: new Date().toString(),
      title: "",
      fio: "",
      description: "",
      manager: "",
      products: [],
      isLoading: false,
      deletedItems: [],
      newItems: [],
      calculatedSum: 0,
      deliverySum: 0,
      addFormOpened: false,
      articleSearch: null,
      timer: null,
      numInputStep: 0.01,
      newItem: {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
      },
      confirmMsg: {
        header: "Вы уверены?",
        message: "Подтвердите действие.",
      },
      confirmOneCMsg: {
        header: "Вы уверены?",
        message: "Подтвердите действие. Заказ будет отправлен в 1С.",
      },
      dialog: {
        header: "",
        message: "",
        callback: null,
        args: [],
      },
    };
  },
  beforeMount() {
    this.fio =
      this.infoItem && this.infoItem.manager && this.infoItem.manager[0]
        ? this.transformFIO(this.infoItem.manager[0])
        : "";
    this.editManager =
      this.infoItem && this.infoItem.manager && this.infoItem.manager[0]
        ? false
        : true;
    this.calculatedSum = this.infoItem.sum;
    this.deliverySum = this.infoItem.deliverySum;
  },
};
</script>

<style lang="scss">
.orders-edit-form {
  .form-textarea {
    width: 976px;
  }
}
</style>
