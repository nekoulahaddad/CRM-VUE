<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-order-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить новый заказ
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addOrder',
            })
          "
          class="add-order-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-order-row__inner">
      <form @submit.prevent="createOrder">
        <div class="add-order-row__title text--blue">Заказ:</div>

        <div class="add-order__wrapper d-flex justify-content-between">
          <div class="add-order__left">
            <div class="add-order-row__title text--blue" style="display: none">
              Профиль:
            </div>
            <!-- Физическое лицо -->
            <template v-if="orderForm.clientType === 'physical'">
              <div class="group">
                <div class="group__title">
                  Фамилия: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    maxlength="50"
                    class="form-control"
                    type="text"
                    placeholder="Введите фамилию..."
                    v-model="clientForm.physicalUser.lastname"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Имя: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    maxlength="50"
                    class="form-control"
                    type="text"
                    placeholder="Введите имя..."
                    v-model="clientForm.physicalUser.name"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">Почта:</div>
                <div class="group__content">
                  <input
                    class="form-control"
                    type="email"
                    maxlength="100"
                    placeholder="Введите почту..."
                    v-model="clientForm.physicalUser.email"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Телефон: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <phone-mask-input
                    required
                    inputClass="form-control"
                    placeholder="Введите телефон..."
                    v-model="clientForm.physicalUser.phone"
                    @input="getClientByPhone"
                    @onValidate="onValidatePhysical"
                  />
                </div>
              </div>
            </template>
            <!-- Юридическое лицо -->
            <template v-else>
              <div class="group">
                <div class="group__title">
                  Фамилия: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите фамилию..."
                    v-model="clientForm.legalUser.lastname"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Имя: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите имя..."
                    v-model="clientForm.legalUser.name"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  ИНН: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control hide-arrows"
                    type="number"
                    placeholder="Введите ИНН..."
                    v-model="clientForm.legalUser.inn"
                    :readonly="clientForm.isOldUser"
                    onkeydown="return event.keyCode !== 69"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Почта: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="email"
                    placeholder="Введите почту..."
                    v-model="clientForm.legalUser.email"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Телефон: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <phone-mask-input
                    required
                    inputClass="form-control"
                    placeholder="Введите телефон..."
                    v-model="clientForm.legalUser.phone"
                    @input="getClientByPhone"
                    @onValidate="onValidateLegal"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Название организации: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите название организации..."
                    v-model="clientForm.legalUser.organisation"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Форма собственности: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите форму собственности..."
                    v-model="clientForm.legalUser.ownership"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Фактический адрес: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите фактический адрес..."
                    v-model="clientForm.legalUser.ur_actualAddress"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Юридический адрес: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите юридический адрес..."
                    v-model="clientForm.legalUser.ur_address"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">ОКПО:</div>
                <div class="group__content">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Введите ОКПО..."
                    v-model="clientForm.legalUser.okpo"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  БИК: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите БИК..."
                    v-model="clientForm.legalUser.bik"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">Наименование банка:</div>
                <div class="group__content">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Введите наименование банка..."
                    v-model="clientForm.legalUser.bank"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">Расчетный счет:</div>
                <div class="group__content">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Введите расчетный счет..."
                    v-model="clientForm.legalUser.account_number"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">
                  Корр. счет: <span class="required">*</span>
                </div>
                <div class="group__content">
                  <input
                    required
                    class="form-control"
                    type="text"
                    placeholder="Введите корр. счет..."
                    v-model="clientForm.legalUser.ur_corScore"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">КПП:</div>
                <div class="group__content">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Введите КПП..."
                    v-model="clientForm.legalUser.kpp"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
              <div class="group">
                <div class="group__title">Генеральный директор:</div>
                <div class="group__content">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Введите генерального директора..."
                    v-model="clientForm.legalUser.director"
                    :readonly="clientForm.isOldUser"
                  />
                </div>
              </div>
            </template>
          </div>
          <div class="add-order__right">
            <!-- Лицо заказа -->
            <div class="group">
              <div class="group__title">Лицо заказа:</div>
              <div class="group__content">
                <v-select
                  :options="[
                    { label: 'Физическое лицо', value: 'physical' },
                    { label: 'Юридическое лицо', value: 'legal' },
                  ]"
                  :reduce="(item) => item.value"
                  name="clientType"
                  v-model="orderForm.clientType"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="add-order-row__title text--blue" style="margin-top: 10px">
          Основная информация:
        </div>

        <div class="add-order__wrapper d-flex justify-content-between">
          <div class="add-order__left">
            <div class="group">
              <div class="group__title">Адрес доставки:</div>
              <div class="group__content">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Введите город..."
                  v-model="orderForm.delivery.city"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__content">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Введите улицу..."
                  v-model="orderForm.delivery.street"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__content">
                <input
                  class="form-control hide-arrows"
                  type="number"
                  placeholder="Введите дом..."
                  v-model="orderForm.delivery.house"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__content">
                <input
                  class="form-control hide-arrows"
                  type="number"
                  placeholder="Введите здание..."
                  v-model="orderForm.delivery.building"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__content">
                <input
                  class="form-control hide-arrows"
                  type="number"
                  placeholder="Введите квартиру..."
                  v-model="orderForm.delivery.appt"
                />
              </div>
            </div>

            <div class="group">
              <div class="group__title">Дополнительная информация:</div>
              <div class="group__content">
                <textarea
                  class="form-textarea"
                  maxlength="1000"
                  placeholder="Введите дополнительную информацию..."
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Менеджер:</div>
              <div class="manager">
                <autocomplete
                  :search="getUsersByFIO"
                  placeholder="Введите менеджера..."
                  :get-result-value="getResultValue"
                >
                  <template #result="{ result, props }">
                    <li @click="selectManager(result)" v-bind="props">
                      {{ transformFIO(result) }}
                    </li>
                  </template>
                </autocomplete>
              </div>
            </div>
          </div>
          <div class="add-order__right">
            <!-- Способ оплаты -->
            <div class="group" v-if="orderForm.clientType === 'physical'">
              <div class="group__title">
                Способ оплаты: <span class="required">*</span>
              </div>
              <div class="group__content">
                <v-select
                  :options="[
                    { label: 'Оплата наличными при получении', value: 'cash' },
                    {
                      label: 'Оплата банковской картой при получении',
                      value: 'cartReceiving',
                    },
                  ]"
                  :reduce="(item) => item.value"
                  name="payment__cash"
                  v-model="orderForm.payment"
                />
              </div>
            </div>
            <div class="group" v-else>
              <div class="group__title">
                Способ оплаты: <span class="required">*</span>
              </div>
              <div class="group__content">
                <v-select
                  required
                  :options="[
                    {
                      label: 'Оплата по выставленному счёту',
                      value: 'bankTransfer',
                    },
                  ]"
                  name="payment__cash"
                  v-model="orderForm.payment"
                  :reduce="(item) => item.value"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">
                Способ доставки: <span class="required">*</span>
              </div>
              <div class="group__content">
                <v-select
                  :options="[
                    { label: 'Самовывоз', value: 'pickup' },
                    { label: 'Доставка транспортом', value: 'transport' },
                    { label: 'Доставка курьером', value: 'courier' },
                  ]"
                  name="delivery-type__pickup"
                  v-model="orderForm.typeDelivery"
                  :reduce="(item) => item.value"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">
                Регион: <span class="required">*</span>
              </div>
              <div class="group__content">
                <v-select
                  :options="
                    regions.map((region) => ({
                      label: region.title,
                      value: region._id,
                    }))
                  "
                  :reduce="(item) => item.value"
                  v-model="orderForm.region"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Дата доставки:</div>
              <div class="group__content">
                <datetime
                  type="datetime"
                  input-class="forms__container--input"
                  :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
                  v-model="orderForm.deliver"
                />
              </div>
            </div>
          </div>
        </div>

        <template v-if="orderForm.region">
          <div class="add-order-row__title text--blue" style="margin-top: 15px">
            Товары:
          </div>

          <div class="sub-list">
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

            <div
              v-for="(product, index) in orderForm.products"
              :key="index"
              class="list__row list__row--shadow list__row--white"
              :class="{
                'list__row--delete': deletedItems.includes(index),
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
                    :disabled="deletedItems.includes(index)"
                    @change="calculateSum"
                  />
                </div>
                <div class="list__column d-flex justify-center">
                  <input
                    type="number"
                    class="form-control no-arrow"
                    min="0.01"
                    step="0.01"
                    :disabled="deletedItems.includes(index)"
                    v-model="product.cost"
                    @keyup="calculateSum"
                  />
                </div>
                <div class="list__column">
                  {{ (product.cost * product.quantity).toFixed(2) }}
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

            <div
              class="list__row list__row--shadow list__row--white"
              v-if="addFormOpened"
            >
              <div class="list__columns">
                <div class="list__column">
                  {{ orderForm.products.length + 1 }}
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
          </div>

          <span class="good-add-btn" @click="addFormOpened = true">
            Добавить
          </span>

          <div class="d-flex align-items-end flex-column">
            <div class="total-item d-flex align-items-center">
              Сумма доставки:
              <input
                class="form-control"
                type="number"
                step="0.01"
                style="margin-left: 10px"
                v-model.number="orderForm.deliverySum"
              />
            </div>
            <div class="total-item">
              Сумма заказа:
              <span class="text text--green">
                {{ orderForm.calculatedSum.toFixed(2) }} ₽
              </span>
            </div>
            <div class="total-item">
              Итого:
              <span class="text text--blue-delos">
                {{
                  (orderForm.deliverySum + orderForm.calculatedSum).toFixed(2)
                }}
                ₽
              </span>
            </div>
          </div>
        </template>

        <v-button red>Создать</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VButton from "@/components/VButton";
import PhoneMaskInput from "vue-phone-mask-input";

export default {
  components: { VButton, PhoneMaskInput },
  data() {
    return {
      timer: null,
      managers: [],
      addFormOpened: false,
      productTitleSearch: null,
      productsList: [],
      deletedItems: [],
      selectedProduct: null,
      articleSearch: null,
      regions: [],
      orderForm: {
        buyed: null,
        status: "5fb37d9e87b38ebe6c815647",
        clientType: "physical",
        number: null,
        region: null,
        comment: "",
        deliver: null,
        payment: "",
        typeDelivery: "",
        delivery: {
          city: "",
          street: "",
          house: "",
          building: "",
          appt: "",
        },
        products: [],
        calculatedSum: 0,
        deliverySum: 0,
        client: null,
        sum: null,
        manager: [],
      },
      clientForm: {
        isOldUser: false,
        physicalUser: {
          name: "",
          lastname: "",
          phone: "",
          email: "",
        },
        legalUser: {
          name: "",
          lastname: "",
          email: "",
          organisation: "",
          phone: "",
          ownership: "",
          ur_actualAddress: "",
          okpo: "",
          ur_address: "",
          bik: "",
          bank: "",
          account_number: "",
          ur_corScore: "",
          inn: "",
          kpp: "",
          director: "",
        },
      },
      isValidPhysicalNumber: false,
      isValidLegalNumber: false,
      date: new Date().toString(),
      isLoading: false,
      isLoadingProductSearch: false,
      newItem: {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
      },
      newItems: [],
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
  methods: {
    onValidatePhysical({ isValidByLibPhoneNumberJs }) {
      this.isValidPhysicalNumber = isValidByLibPhoneNumberJs;
    },
    onValidateLegal({ isValidByLibPhoneNumberJs }) {
      this.isValidLegalNumber = isValidByLibPhoneNumberJs;
    },
    async getClientByPhone(phone) {
      try {
        if (phone.target.value.length < 11) return;
        await axios({
          url: "/clients/getclientbyphone/" + phone.target.value,
        }).then(async (res) => {
          let result = await res;
          if (result && result.data[0]) {
            this.clientForm.isOldUser = true;
            this.orderForm.client = result.data[0]._id;
            if (result.data[0].inn) {
              this.clientForm.legalUser = result.data[0];
              this.orderForm.clientType = "legal";
            } else {
              this.clientForm.physicalUser = result.data[0];
              this.orderForm.clientType = "physical";
            }
            await axios({
              url: "/regions/getbyid",
              method: "POST",
              data: {
                regionId: result.data[0].region,
              },
            }).then((res) => {
              this.orderForm.region = res.data.region;
              this.clientForm.isOldUser = false;
              this.orderForm.client = null;
              delete this.clientForm.physicalUser._id;
              delete this.clientForm.legalUser._id;
            });
          }
        });
      } catch (e) {}
    },
    getResultValue(result) {
      return this.transformFIO(result);
    },
    createNewOrder() {
      axios({
        url: "/orders/post",
        method: "POST",
        data: this.orderForm,
      }).then(async () => {
        this.$toast.success("Заказ успешно создан!");
        this.$emit("afterAddOrder");
      });
      this.$emit("toggleOpen");
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
      this.orderForm.products.push(product);
      this.addFormOpened = false;
      this.newItem = {
        title: "Введите артикул товара",
        quantity: 1,
        cost: 0,
        full_cost: 0,
      };
      this.calculateSum();
      this.selectedProduct = null;
      this.productsList = [];
      this.articleSearch = null;
    },
    deleteItem(_id) {
      if (this.deletedItems.includes(_id)) {
        this.deletedItems = this.deletedItems.filter((id) => id !== _id);
      } else {
        this.deletedItems.push(_id);
      }
      this.calculateSum();
    },
    getItemTitle(result) {
      return result.title;
    },
    calculateSum() {
      let total = 0;
      let type = "full_cost";
      for (let p of this.orderForm.products) {
        total += p[type] * p.quantity;
      }
      this.orderForm.calculatedSum = total;
      this.orderForm.sum = this.orderForm.calculatedSum;
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
              this.changeStatus(true);
            });
        }, 500);
      }
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
            region: this.orderForm.region,
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
    async getUsersByFIO(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios(`/user/getmanagers/${input}`).then((result) => {
          resolve(result.data);
        });
      });
    },
    selectManager(manager) {
      this.orderForm.manager = manager;
    },
    async createOrder() {
      if (
        (this.orderForm.clientType === "legal" && !this.isValidLegalNumber) ||
        (this.orderForm.clientType !== "legal" && !this.isValidPhysicalNumber)
      ) {
        this.$toast.error("Неверный формат номера телефона");
        return;
      }

      if (this.clientForm.isOldUser) {
        this.createNewOrder();
      } else {
        const physica = {
          ...this.clientForm.physicalUser,
          region: this.orderForm.region,
        };
        const lega = {
          ...this.clientForm.legalUser,
          region: this.orderForm.region,
        };
        axios({
          url: "/clients/create",
          method: "POST",
          data: this.orderForm.clientType === "legal" ? lega : physica,
        })
          .then(async (res) => {
            console.log(res);
            const result = await res;
            this.orderForm.client = result.data.id;
            this.createNewOrder();
          })
          .catch((e) => {
            this.$toast.error(e.response.data.message);
          });
      }
    },
  },
  created() {
    axios({
      url: "/regions/get",
    }).then(async (res) => {
      this.regions = res.data.regions;
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.add-order-row {
  max-width: 1704px;
}

.add-order-row .sub-list .list__header {
  height: auto;
  padding-bottom: 10px;
  .list__columns {
    background-color: $color-white !important;
  }
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
.add-order-row .sub-list .list__columns {
  grid-template-columns: 70px 500px 160px 160px 160px 150px 1fr !important;
}

.page__right--fluid .add-order-row .sub-list .list__columns {
  grid-template-columns: 70px 700px 200px 200px 200px 200px 1fr !important;
}

.page__right--full .add-order-row .sub-list .list__columns {
  grid-template-columns: 70px 700px 220px 160px 160px 170px 1fr !important;
}

.page__right--middle .add-order-row .sub-list .list__columns {
  grid-template-columns: 70px 550px 190px 170px 170px 150px 1fr !important;
}
.add-order-row .sub-list .list__columns .list__column:last-child {
  text-align: right;
}

.add-order-row {
  & > .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      position: relative;
    }
  }

  .list__column--title {
    font-size: 16px;
  }

  &__inner {
    padding: 10px;
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
  }

  button {
    width: 230px;
    height: 37px;
  }

  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__inner {
    padding: 10px;
  }
  .form-textarea,
  .form-control {
  }
  .form-textarea {
    min-height: 150px;
  }

  .autocomplete-input,
  .vdatetime-input,
  .form-select {
    width: 401px;
  }
  .manager .autocomplete {
    width: 100%;
    .autocomplete-input {
      width: 100%;
    }
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
  .form-control[type="number"] {
    width: 100px;
  }
  .form-control[type="number"].no-arrow {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
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
  .total-item {
    font-size: 16px;
    font-weight: 700;

    & + * {
      margin-top: 10px;
    }
  }
  .add-order__left {
    flex: 1;
    margin-right: 25px;
  }
  .required {
    color: #db1f35;
  }
  .phone-mask-wrapper-lib {
    width: 100%;
  }
  button {
    margin-top: 10px;
  }
  input[type="number"].hide-arrows::-webkit-outer-spin-button,
  input[type="number"].hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"].hide-arrows {
    -moz-appearance: textfield;
    width: 100%;
  }
  .vs__selected {
    width: 94%;
  }
  .add-good-item {
    .autocomplete-input {
      width: 100%;
    }
  }
  .sub-list {
    display: grid;
    grid-template-rows: 1fr;
    grid-row-gap: 10px;
    margin-bottom: 10px;
  }
}
</style>
