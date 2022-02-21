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
        <div class="group">
          <div class="group__title">Лицо заказа:</div>
          <div class="group__content">
            <select class="form-select">
              <option value="physical">Физическое лицо</option>
              <option value="legal">Юридическое лицо</option>
            </select>
          </div>
        </div>
        <div class="add-order-row__title text--blue">Профиль:</div>
        <div class="group">
          <div class="group__title">Фамилия:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите фамилию..."
              v-model="clientForm.physicalUser.lastname"
              :readonly="clientForm.isOldUser"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Имя:</div>
          <div class="group__content">
            <input
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
              type="text"
              placeholder="Введите почту..."
              v-model="clientForm.physicalUser.email"
              :readonly="clientForm.isOldUser"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Телефон:</div>
          <div class="group__content">
            <phone-mask-input
              inputClass="form-control"
              placeholder="Введите телефон..."
              v-model="clientForm.physicalUser.phone"
              @input="getClientByPhone"
            />
          </div>
        </div>
        <div class="add-order-row__title text--blue">Основная информация:</div>
        <div class="group">
          <div class="group__title">Способ оплаты:</div>
          <div class="group__content">
            <select class="form-select">
              <option value="">Выберите способ оплаты</option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Способ доставки:</div>
          <div class="group__content">
            <select class="form-select">
              <option value="">Выберите способ доставки</option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Регион:</div>
          <div class="group__content">
            <select class="form-select" v-model="orderForm.region">
              <option
                v-for="region in regions"
                :key="region._id"
                :value="region._id"
              >
                {{ region.title }}
              </option>
            </select>
          </div>
        </div>
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
              class="form-control"
              type="text"
              placeholder="Введите дом..."
              v-model="orderForm.delivery.house"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите здание..."
              v-model="orderForm.delivery.building"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите квартиру..."
              v-model="orderForm.delivery.appt"
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
        <div class="group">
          <div class="group__title">Дополнительная информация:</div>
          <div class="group__content">
            <textarea
              class="form-textarea"
              placeholder="Введите дополнительную информацию..."
            />
          </div>
        </div>

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
      date: new Date().toString(),
      isLoading: false,
      isLoadingProductSearch: false,
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
  methods: {
    async getClientByPhone(phone) {
      this.isLoading = true;
      this.clientForm.isOldUser = false;
      this.orderForm.client = null;
      delete this.clientForm.physicalUser._id;
      delete this.clientForm.legalUser._id;
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
            });
          }

          this.isLoading = false;
        });
      } catch (e) {
        this.orderForm.region = null;
        this.clientForm.physicalUser = {
          ...this.clientForm.physicalUser,
          name: "",
          lastname: "",
        };
        this.clientForm.legalUser = {
          ...this.clientForm.legalUser,
          name: "",
          lastname: "",
          email: "",
          organisation: "",
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
        };
        this.clientForm.isOldUser = false;
        this.isLoading = false;
      }
    },
    createNewOrder() {
      axios({
        url: "/orders/post",
        method: "POST",
        data: this.orderForm,
      }).then(async () => {
        await this.getOrdersFromPage({
          page: +this.$route.params.page,
          filtersOptions: {
            dates: "all",
            client: "all",
            created: -1,
            deliver: null,
            buyed: null,
            number: null,
            status: "all",
            region: null,
            executor: null,
            search: "",
            type: "all",
          },
        });
      });
      this.$emit("toggleOpen");
    },
    async createOrder() {
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
          url: process.env.VUE_APP_DEVELOP_URL + "/clients/create",
          method: "POST",
          data: this.orderForm.clientType === "legal" ? lega : physica,
        })
          .then(async (res) => {
            const result = await res;
            this.orderForm.client = result.data.id;
            this.createNewOrder();
          })
          .catch((e) => {
            this.$toast.warning(e.message);
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
.add-order-row {
  .list__columns {
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
    width: 976px;
  }
  .form-textarea {
    min-height: 218px;
  }
  .vdatetime-input,
  .form-select {
    width: 401px;
  }
}
</style>
