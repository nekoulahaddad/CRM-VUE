<template>
  <div class="list__info list-info orders-edit-form">
    <!-- Модальное окно для подтверждения отклонения заказа -->
    <v-declained-modal
      @toggleOpen="toggleCancelOrder"
      :editedItem="editedItem"
    />

    <form @submit.prevent>
      <div class="group__title text--blue">Редактировать заказ:</div>
      <div class="d-flex">
        <div class="flex-1">
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
                {{ $t("payedType") }}
              </div>
              <div class="group__value">
                {{
                  transformPayment(editedItem.payment, editedItem.acquiringNum)
                }}
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
              <div class="group__value">
                {{ getOneCStatus(editedItem.oneC) }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div class="list-info__group group">
            <div class="group__content">
              <div class="group__item text--bold-700">
                {{ $t("manager") }}
              </div>
              <div class="group__value">
                <span
                  class="manager"
                  @click="showManagerInput = !showManagerInput"
                >
                  {{ fio ? fio : "Добавить менеджера" }}
                </span>
              </div>
            </div>
            <div class="group__content">
              <autocomplete
                v-if="showManagerInput"
                :search="getUsersByFIO"
                :get-result-value="getResultValue"
                placeholder="Введите менеджера..."
              >
                <template #result="{ result, props }">
                  <li v-bind="props" @click="selectUser(result)">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
            </div>
          </div>
          <div class="group">
            <div class="group__title">{{ $t("payed") }}</div>
            <div class="group__content">
              <datetime
                v-model="editedItem.buyed"
                input-class="forms__container--input"
                type="date"
                :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">{{ $t("delivered") }}</div>
            <div class="group__content">
              <datetime
                v-model="editedItem.deliver"
                input-class="forms__container--input"
                type="date"
                :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
              />
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
        </div>
      </div>

      <template v-if="products.length">
        <div class="group__title text--blue" style="margin-top: 20px">
          Товары:
        </div>
        <div class="list sub-list">
          <div class="list__header">
            <div class="list__columns">
              <div class="list__column">№:</div>
              <div class="list__column">Название товара:</div>
              <div class="list__column">Артикул:</div>
              <div class="list__column">Кол-во:</div>
              <div class="list__column">Цена за ед.:</div>
              <div class="list__column">Итог:</div>
              <div class="list__column"></div>
            </div>
          </div>
          <template>
            <template v-if="editedItem.status.value !== 'processing'">
              <div
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
                    {{
                      product.cost.toFixed(2) +
                      " " +
                      editedItem.region.valute.icon
                    }}
                  </div>
                  <div class="list__column">
                    {{
                      (product.cost * product.quantity).toFixed(2) +
                      " " +
                      editedItem.region.valute.icon
                    }}
                  </div>
                  <div class="list__column">
                    <template
                      v-if="
                        type === 'edit' &&
                        editedItem.manager.length &&
                        editedItem.status.value === 'completed'
                      "
                    >
                      <input
                        v-if="!sendedProductList.includes(product._id)"
                        type="checkbox"
                        :value="{
                          ...product,
                          valute: editedItem.region.valute.icon,
                        }"
                        v-model="selectedProductList"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                v-for="(product, index) in products"
                :key="product._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--delete': deletedItems.includes(product._id),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">{{ index + 1 }}</div>
                  <div class="list__column bg bg--blue-light">
                    {{ product.title }}
                  </div>
                  <div class="list__column">{{ product.article }}</div>
                  <div class="list__column d-flex justify-center">
                    <input
                      min="1"
                      class="form-control"
                      type="number"
                      v-model="product.quantity"
                      :disabled="deletedItems.includes(product._id)"
                      @change="calculateSum"
                    />
                  </div>
                  <div class="list__column d-flex justify-center">
                    <input
                      type="number"
                      class="form-control no-arrow"
                      min="0.01"
                      step="0.01"
                      :disabled="deletedItems.includes(product._id)"
                      v-model="product.cost"
                      @keyup="calculateSum"
                    />
                  </div>
                  <div class="list__column">
                    {{
                      (product.cost * product.quantity).toFixed(2) +
                      " " +
                      editedItem.region.valute.icon
                    }}
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
            </template>

            <!-- Добавление нового товара -->
            <div
              class="list__row list__row--shadow list__row--white"
              v-if="addFormOpened"
            >
              <div class="list__columns">
                <div class="list__column">{{ products.length + 1 }}</div>
                <div class="list__column good-name-group">
                  <autocomplete
                    :search="findItemByTitle"
                    :get-result-value="getResultValue"
                    placeholder="Введите название товара..."
                  >
                    <template #result="{ result, props }">
                      <li v-bind="props" @click="selectedProductItem(result)">
                        {{ result.title }}
                      </li>
                    </template>
                  </autocomplete>
                </div>
                <div class="list__column d-flex justify-center article-group">
                  <input
                    type="number"
                    placeholder="000000"
                    style="width: 100px"
                    class="form-control hide-arrows"
                    @input="findItemByArticle"
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
                <div class="list__column d-flex justify-center">
                  <input
                    type="number"
                    class="form-control no-arrow"
                    min="0.01"
                    v-model="newItem.cost"
                  />
                </div>
                <div class="list__column">
                  {{ (newItem.cost * newItem.quantity).toFixed(2) || 0 }}
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

            <div class="orders-edit-form__add-product">
              <v-button
                @click="addFormOpened = true"
                v-if="
                  editedItem.status.value === 'processing' && !addFormOpened
                "
                red
              >
                Добавить
              </v-button>
            </div>
          </template>
        </div>

        <div class="d-flex align-items-end flex-column">
          <div
            class="total-item"
            v-if="deliverySum && editedItem.status.value !== 'processing'"
          >
            Сумма доставки:
            <span class="text text--green">
              {{ deliverySum.toFixed(2) + " " + editedItem.region.valute.icon }}
            </span>
          </div>

          <div
            class="total-item"
            v-if="editedItem.status.value === 'processing'"
          >
            Сумма доставки:
            <input
              step="0.01"
              type="number"
              class="form-control"
              v-model.number="deliverySum"
            />
            <span>{{ editedItem.region.valute.icon }}</span>
          </div>

          <div class="total-item" v-if="deliveryRequest">
            Сумма доставки:
            <span class="text text--green">{{ deliveryRequest }}</span>
          </div>
          <div class="total-item">
            Сумма заказа:
            <span class="text text--green">
              {{
                calculatedSum &&
                calculatedSum.toFixed(2) + " " + editedItem.region.valute.icon
              }}
            </span>
          </div>
          <div class="total-item">
            Итого:
            <span class="text text--blue-delos">
              {{
                (deliverySum + calculatedSum).toFixed(2) +
                " " +
                editedItem.region.valute.icon
              }}
            </span>
          </div>
        </div>
      </template>

      <div class="orders-edit-form__buttons">
        <template
          v-if="
            type === 'edit' &&
            editedItem.manager.length &&
            editedItem.status.value === 'completed'
          "
        >
          <v-button red @click="editOrder">Сохранить</v-button>
          <v-button
            redWhite
            :disabled="!selectedProductList.length"
            @click="toggleSendToBuyer"
          >
            Отправить закупщику
          </v-button>
          <v-button
            redWhite
            v-if="!editedItem.oneC.requested"
            @click="
              handleDialog(sendToOneC, [false], {
                title: 'Отправка заказа в 1С',
                msg: 'Подтвердите действие. Заказ будет отправлен в 1С.',
              })
            "
          >
            Отправить в 1С
          </v-button>
        </template>

        <v-button
          red
          v-if="
            type === 'edit' &&
            editedItem.manager.length &&
            editedItem.status.value === 'awaiting'
          "
          @click="editOrder('processing')"
        >
          Взять в работу
        </v-button>

        <template
          v-if="
            type === 'edit' &&
            editedItem.manager.length &&
            editedItem.status.value === 'processing'
          "
        >
          <v-button
            red
            :disabled="outOfGoods"
            @click="
              handleDialog(editOrder, ['completed'], {
                title: 'Подтверждение заказа',
                msg: 'Вы уверены? Подтвердите действие',
              })
            "
          >
            Подтвердить заказ
          </v-button>
          <v-button redWhite @click="$modal.show('declainderOrder')">
            Отклонить заказ
          </v-button>
          <v-button white @click="editOrder('nocall')">
            Нет связи с клиентом
          </v-button>
        </template>
        <v-button red @click="editOrder"> Сохранить </v-button>
      </div>
    </form>
  </div>
</template>

<script>
import VDeclainedModal from "../VDeclainedModal";
import VButton from "@/components/VButton";
import VSpinner from "@/components/VSpinner";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    type: {
      type: String,
      default: "",
    },
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
    VSpinner,
    VDeclainedModal,
  },
  computed: {
    sum: {
      get() {
        return this.editedItem.sum;
      },
    },
    deliveryRequest: {
      get() {
        return this.editedItem.deliveryRequest;
      },
    },
    currentUser: {
      get: function () {
        let user = this.getUserRole();

        return user;
      },
    },
    outOfGoods: {
      get() {
        return this.products.length === this.deletedItems.length;
      },
    },
  },
  data() {
    return {
      showManagerInput: false,
      isDeclained: false,
      editManager: false,
      sendToBuyer: false,
      productTitleSearch: null,
      productsList: [],
      selectedProductList: [],
      sendedProductList: [],
      selectedProduct: null,
      isLoadingProductSearch: false,
      isLoadingForm: false,
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
      this.editedItem && this.editedItem.manager && this.editedItem.manager[0]
        ? this.transformFIO(this.editedItem.manager[0])
        : "";
    this.editManager = !(
      this.editedItem &&
      this.editedItem.manager &&
      this.editedItem.manager[0]
    );
    this.calculatedSum = this.editedItem.sum;
    this.deliverySum = this.editedItem.deliverySum;
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    getResultValue(result) {
      return result.title;
    },
    toggleCancelOrder(e) {
      if (e && e.cancelOrder) {
        this.editOrder("declained");
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
    addItemToProducts(item) {
      console.log(item);
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
    findItemByTitle(title) {
      if (title.trim().length < 3) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/products/getproductbysearch/`,
          data: {
            search: title,
            region: this.editedItem.region._id,
          },
          method: "POST",
        })
          .then(async (result) => {
            let res = await result;
            this.productsList = res.data.products;
            this.isLoadingProductSearch = false;
            resolve(res.data.products);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      });
    },
    getArticleValue(result) {
      return result.article;
    },
    findItemByArticle(e) {
      const article = e.target.value;

      if (article.trim().length < 3) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/products/getproductbyarticle/`,
          data: {
            article,
            region: this.editedItem.region._id,
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
              this.addItemToProducts(this.newItem);
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
      });
    },
    handleDialog(callback, args, data = {}) {
      if (!this.editedItem.products.length && args.includes("completed")) {
        this.$toast.error("В заказе нет товаров!");
        return;
      }
      this.dialog.data = data;
      this.dialog.callback = callback;
      this.dialog.args = args ? args : false;
      this.$emit("setDialog", this.dialog);
    },
    async getUsersByFIO(input) {
      if (input.trim().length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getmanagers/${input}/${this.editedItem.region._id}`).then(
          (result) => {
            resolve(result.data);
          }
        );
      });
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
        data: { orderId: this.editedItem._id },
        method: "POST",
      })
        .then(() => {
          this.$modal.hide("orderActionModal");
          this.$toast.success("Заказ успешно отправлен в 1С");
          this.$emit("toggleEdit", this.editedItem);
          this.$emit("refreshDates");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    deleteItem(_id) {
      if (this.deletedItems.includes(_id)) {
        this.deletedItems = this.deletedItems.filter((id) => id !== _id);
      } else {
        this.deletedItems.push(_id);
      }
      this.calculateSum();
    },
    updateInfoItemProducts() {
      let products = this.products;
      let deleted = this.deletedItems;
      products = products.filter((p) => !deleted.includes(p.product_id));
      return products;
    },
    toggleSendToBuyer() {
      this.$emit("toggleSendDelivery", {
        type: "fromOrder",
        initiator: this.currentUser,
        _id: this.editedItem._id,
        orderId: this.editedItem._id,
        region: this.editedItem.region,
        products: this.selectedProductList,
        orderid: this.editedItem._id,
        orderNumber: this.editedItem.number,
        comment: "",
      });
    },
    async getProducts() {
      axios({
        url: `/orders/getproducts/`,
        data: {
          orderId: this.editedItem._id,
        },
        method: "POST",
      })
        .then((res) => {
          this.products = res.data;
          this.isLoading = true;
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    editOrder(status) {
      const products = this.updateInfoItemProducts();

      let order = {
        orderId: this.editedItem._id,
        sum: this.calculatedSum,
        manager: this.manager
          ? this.manager
          : this.editedItem.manager[0]
          ? this.editedItem.manager[0]._id
          : null,
        buyed: this.editedItem.buyed,
        deliver: this.editedItem.deliver,
        deliverySum: this.deliverySum,
        status: status ? status : null,
        manager_comment: this.editedItem.manager_comment,
        declainReason: this.editedItem.declainReason,
        products,
      };

      axios({
        url: `/orders/update/`,
        data: order,
        method: "POST",
      })
        .then(() => {
          this.$modal.hide("orderActionModal");
          this.$emit("refreshDates");
          this.$emit("toggleEdit", this.editedItem);
          this.$toast.success("Заказ успешно изменен");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
  created() {
    this.isLoading = false;
    this.getProducts();

    axios({
      url: "/purchase/getByOrderNumber",
      params: {
        orderNumber: this.editedItem.number,
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
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.orders-edit-form .sub-list .list__columns {
  grid-template-columns: 70px 500px 160px 160px 160px 150px 1fr !important;
}

.page__right--fluid .orders-edit-form .sub-list .list__columns {
  grid-template-columns: 70px 700px 200px 200px 200px 200px 1fr !important;
}

.page__right--full .orders-edit-form .sub-list .list__columns {
  grid-template-columns: 70px 700px 220px 160px 160px 170px 1fr !important;
}

.page__right--middle .orders-edit-form .sub-list .list__columns {
  grid-template-columns: 70px 550px 190px 170px 170px 150px 1fr !important;
}
.orders-edit-form .sub-list .list__columns .list__column:last-child {
  text-align: right;
}

.orders-edit-form {
  .form-textarea {
  }
  .group__title {
    font-size: 14px;
    &.text--blue {
      font-size: 16px;
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

      .list__column:first-child {
        text-align: left;
        padding-left: 5px;
      }
    }
  }
  .total-item {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;

    .form-control {
      width: 116px;
      margin-left: 10px;
      box-shadow: none;
      border: 1px solid rgba(0, 0, 0, 0.3);
    }

    span {
      margin-left: 10px;
    }

    & + * {
      margin-top: 10px;
    }
  }
  .vdatetime-input {
    width: 401px;
  }
  &__buttons {
    display: flex;
  }
  &__add-product {
    margin-bottom: 10px;
    margin-top: 15px;
  }
  .autocomplete-input {
    width: 401px;
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

  .manager {
    border-bottom: 1px dashed #000;
    cursor: pointer;
    user-select: none;
  }

  .group__content--hidden {
    opacity: 0.1;
  }

  input[type="checkbox"] {
    width: 24px;
    height: 24px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: $color-white !important;
    cursor: pointer;
    position: relative;

    &:before {
      width: 24px;
      height: 24px;
      content: "";
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    &:checked:before {
      background: url("../../../../assets/icons/check_black.svg") no-repeat 2px
        4px;
    }
  }
  .form-control[type="number"].no-arrow {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
  }
  .good-name-group .autocomplete-input {
    width: 100%;
  }
  .article-group .autocomplete-input {
    width: 100px;
    .autocomplete-result-list {
      width: 401px;
      text-align: left;
    }
  }
}
</style>
