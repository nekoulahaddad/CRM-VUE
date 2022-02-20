<template>
  <div class="list__info list-info orders-list-info">
    <div class="group__title text--blue">
      {{ $t("pages.orders.info") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("orderNumber") }}
        </div>
        <div class="group__value">{{ infoItem.number }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("profile") }}
        </div>
        <div class="group__value">{{ transformProfile(infoItem.payment) }}</div>
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
              : infoItem.client
              ? transformName(infoItem.client)
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
          {{ user ? user.phone : infoItem.client.phone }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("email") }}
        </div>
        <div class="group__value">
          {{ user ? user.email : infoItem.client.email }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("city") }}
        </div>
        <div class="group__value">
          {{ user ? user.region.title : infoItem.region.title }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("created") }}
        </div>
        <div class="group__value">{{ transformDate(infoItem.createdAt) }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("payed") }}
        </div>
        <div class="group__value">
          <span v-if="infoItem.buyed">{{ transformDate(infoItem.buyed) }}</span>
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("payedType") }}
        </div>
        <div class="group__value">
          {{ transformPayment(infoItem.payment, infoItem.acquiringNum) }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("deliveryType") }}
        </div>
        <div class="group__value">
          {{ transformDeliveryType(infoItem.typeDelivery) }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("status") }}
        </div>
        <div class="group__value">
          <div v-html="transformStatus(infoItem.status)"></div>
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("oneC") }}
        </div>
        <div class="group__value">{{ getOneCStatus(infoItem.oneC) }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("delivered") }}
        </div>
        <div class="group__value">
          {{ infoItem.deliver ? transformDate(infoItem.deliver) : "" }}
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
        <textarea class="form-textarea">
          {{ infoItem.manager_comment }}
        </textarea>
      </div>
    </div>

    <template v-if="infoItem.products.length">
      <div class="group__title text--blue">Товары:</div>
      <div class="list sub-list">
        <div class="list__header">
          <div class="list__columns">
            <div class="list__column">№:</div>
            <div class="list__column">Название товара:</div>
            <div class="list__column">Артикул:</div>
            <div class="list__column">Кол-во:</div>
            <div class="list__column">Цена за ед.:</div>
            <div class="list__column">Итог:</div>
          </div>
        </div>
        <v-spinner v-if="!products.length" small />
        <div
          v-else
          v-for="(product, index) in products"
          :key="product._id"
          class="list__row list__row--shadow list__row--white"
        >
          <div class="list__columns">
            <div class="list__column">{{ index + 1 }}</div>
            <div class="list__column bg bg--blue-light">
              {{ product.title }}
            </div>
            <div class="list__column">{{ product.article }}</div>
            <div class="list__column">{{ product.quantity }}</div>
            <div class="list__column">
              {{ product.cost.toFixed(2) + " " + infoItem.region.valute.icon }}
            </div>
            <div class="list__column">
              {{
                (product.cost * product.quantity).toFixed(2) +
                " " +
                infoItem.region.valute.icon
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-end flex-column">
        <div class="total-item" v-if="deliverySum">
          Сумма доставки:
          <span class="text text--green">
            {{ deliverySum.toFixed(2) + " " + infoItem.region.valute.icon }}
          </span>
        </div>
        <div class="total-item" v-else-if="deliveryRequest">
          Сумма доставки:
          <span class="text text--green">{{ deliveryRequest }}</span>
        </div>
        <div class="total-item">
          Сумма заказа:
          <span class="text text--green">
            {{ sum.toFixed(2) + " " + infoItem.region.valute.icon }}
          </span>
        </div>
        <div class="total-item">
          Итого:
          <span class="text text--blue-delos">
            {{
              (deliverySum + sum).toFixed(2) + " " + infoItem.region.valute.icon
            }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";
import { mapMutations } from "vuex";

export default {
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  components: { VSpinner },
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
  created() {
    this.isLoading = false;
    this.getProducts();

    axios({
      url: "/purchase/getByOrderNumber",
      params: {
        orderNumber: this.infoItem.number,
      },
      method: "GET",
    }).then((res) => {
      const result = res.data.dataList;
      result.forEach((item) => {
        for (let i = 0; i < item.products.length; i++) {
          this.sendedProductList.push(item.products[i]._id);
        }
      });
    });
  },
  computed: {
    outOfGoods: {
      get() {
        return this.products.length == this.deletedItems.length;
      },
    },
    sum: {
      get() {
        return this.infoItem.sum;
      },
    },
    deliverySum: {
      get: function () {
        return this.infoItem.deliverySum;
      },
    },
    deliveryRequest: {
      get() {
        return this.infoItem.deliveryRequest;
      },
    },
    role: {
      get() {
        let role = this.getUserRole();
        return role.role;
      },
    },
    currentUser: {
      get: function () {
        let user = this.getUserRole();

        return user;
      },
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleCancleOrder(e) {
      this.isDeclained = !this.isDeclained;
      if (e && e.cancleOrder) {
        this.editOrder("declained");
      }
    },
    toggleSendToBuyer(res) {
      this.sendToBuyer = !this.sendToBuyer;
      if (res.data && res.data.data.products.length) {
        this.selectedProductList = [];
        res.data.data.products.forEach((item) => {
          if (!this.sendedProductList.includes(item._id)) {
            this.sendedProductList.push(item._id);
          }
        });
      }
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    handleDialog(msg, callback, args) {
      this.dialog.callback = callback;
      this.dialog.args = args ? args : false;

      this.dialog.header = msg.header;
      this.dialog.message = msg.message;
    },
    async getProducts() {
      axios({
        url: `/orders/getproducts/`,
        data: {
          orderId: this.infoItem._id,
        },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.products = result.data;
          this.isLoading = true;
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
    async getUsersByFIO() {
      axios(`/user/getmanagers/${this.fio}/${this.infoItem.region._id}`).then(
        async (res) => {
          let result = await res;
          this.users = result.data;
        }
      );
    },
    updateInfoItemProducts() {
      let products = this.products;
      let deleted = this.deletedItems;
      products = products.filter((p) => !deleted.includes(p.product_id));
      return products;
    },
    cancelProductSelection() {
      this.addFormOpened = false;
      this.selectedProduct = null;
      this.productsList = [];
      this.newItem = {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
      };
      this.articleSearch = null;
    },
    deleteItem(_id) {
      if (this.deletedItems.includes(_id)) {
        this.deletedItems = this.deletedItems.filter((id) => id != _id);
      } else {
        this.deletedItems.push(_id);
      }
      this.calculateSum();
    },
    addItemToProducts(item) {
      let product = {
        _id: false,
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
      this.products.push(product);
      this.newItems.push(product);
      this.addFormOpened = false;
      this.newItem = {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
      };
      this.calculateSum();
      this.selectedProduct = null;
      this.productsList = [];
      this.articleSearch = null;
    },
    selectedProductItem(item) {
      this.articleSearch = item.article;
      this.newItem.title = item.title;
      this.newItem.article = item.article;
      this.newItem._id = item._id;
      this.newItem.product_id = item._id;
      this.newItem.club_cost = item.club_cost;
      this.newItem.cost = item.cost;
      this.newItem.quantity = 1;
    },
    findItemByTitle(title) {
      if (title.length >= 3) {
        this.isLoadingProductSearch = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          axios({
            url: `/products/getproductbysearch/`,
            data: {
              search: title,
              region: this.infoItem.region._id,
            },
            method: "POST",
          })
            .then(async (result) => {
              let res = await result;
              this.productsList = res.data.products;
              this.isLoadingProductSearch = false;
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
              //this.changeStatus(true)
            });
        }, 500);
      }
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
              region: this.infoItem.region._id,
            },
            method: "POST",
          })
            .then(async (result) => {
              let res = await result;
              if (res.data.product.length != 0) {
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
              this.changeStatus(true);
            });
        }, 500);
      }
    },
    calculateSum() {
      let total = 0;
      let type = "cost";
      for (let p of this.products) {
        if (!this.deletedItems.includes(p._id)) {
          total += p[type] * p.quantity;
        }
      }
      this.calculatedSum = total;
    },
    selectUser(user) {
      this.manager = user._id;
      this.fio = `${user.surname} ${user.name.charAt(0)}.${
        user.lastname ? user.lastname.charAt(0) + "." : ""
      }`;
      this.users = [];
    },
    sendToOneC() {
      axios({
        url: `/orders/sendtoonec/`,
        data: { orderId: this.infoItem._id },
        method: "POST",
      })
        .then(() => {
          this.$emit("refreshDates");
          this.$emit("toggleOpen");
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    editOrder(status) {
      const products = this.updateInfoItemProducts();
      this.changeStatus(false);
      let order = {
        orderId: this.infoItem._id,
        sum: this.calculatedSum,
        manager: this.manager
          ? this.manager
          : this.infoItem.manager[0]
          ? this.infoItem.manager[0]._id
          : null,
        buyed: this.infoItem.buyed,
        deliver: this.infoItem.deliver,
        deliverySum: this.deliverySum,
        status: status ? status : null,
        manager_comment: this.infoItem.manager_comment,
        declainReason: this.infoItem.declainReason,
        products: products, //this.infoItem.products
      };
      axios({
        url: `/orders/update/`,
        data: order,
        method: "POST",
      })
        .then(() => {
          this.$emit("refreshDates");
          this.$emit("toggleOpen");
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
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
@import "@/styles/_variables";

.orders-list-info {
  .group__title {
    font-size: 16px;
    font-weight: 700;
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &:before {
        content: "";
        position: absolute;
        display: flex;
        height: 2px;
        background-color: $color-gray-secondary;
        top: 0;
        left: 0;
        right: 0;
      }
    }
  }

  .sub-list {
    width: 100%;

    .list__header {
      position: relative;
      padding-bottom: 10px;
      margin-bottom: 10px;
      height: auto;

      &:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }

      .list__columns {
        background-color: $color-white;
      }
    }
    .list__columns {
      justify-content: left !important;
      grid-template-columns: 70px 650px 130px 130px 130px 130px !important;

      .page__right--full & {
        grid-template-columns: 70px 760px 170px 170px 170px 180px !important;
      }
      .page__right--middle & {
        grid-template-columns: 70px 740px 140px 140px 140px 140px !important;
      }
      .page__right--fluid & {
        grid-template-columns: 70px 800px 190px 190px 190px 190px !important;
      }

      .list__column:first-child {
        text-align: left;
        padding-left: 5px;
      }
    }
  }
  .total-item {
    font-size: 16px;
    font-weight: 700;

    & + * {
      margin-top: 10px;
    }
  }

  .form-textarea {
    width: 976px;
  }
}
</style>
