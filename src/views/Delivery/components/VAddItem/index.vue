<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-delivery-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить поставщика
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addDelivery',
            })
          "
          class="add-delivery-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-delivery-row__inner">
      <form @submit.prevent="onProvidersAdd">
        <div class="add-delivery-row__title text--blue">
          Основная информация о поставщике:
        </div>
        <div class="group">
          <div class="group__title">Название компании:</div>
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              placeholder="Введите название о компании..."
              name="name"
              v-model="name"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Сайт:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Вставьте ссылку на сайт..."
              name="site"
              v-model="site"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">ИНН:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите ИНН"
              name="inn"
              v-model="inn"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Адрес офиса:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите адрес офиса..."
              name="office_address"
              v-model="office_address"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Адрес склада:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите адрес склада..."
              name="warehouse_address"
              v-model="warehouse_address"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Регион:</div>
          <div class="group__content">
            <select class="form-select" name="region" v-model="region">
              <option :value="null">Выбрать регион</option>
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
        <div class="group" v-if="false">
          <div class="group__title">Статус поставщика:</div>
          <div class="group__content">
            <select class="form-select">
              <option>Выберите статус</option>
            </select>
          </div>
        </div>
        <div class="group" v-if="false">
          <div class="group__title">Вариант поставки:</div>
          <div class="group__content">
            <select class="form-select">
              <option>Выберите вариант поставки</option>
            </select>
          </div>
        </div>
        <div class="add-delivery-row__title text--blue">Директор:</div>
        <div class="group">
          <div class="group__title">ФИО:</div>
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              placeholder="Введите ФИО..."
              v-model="director.name"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Дата рождения:</div>
          <div class="group__content">
            <datetime
              type="datetime"
              input-class="forms__container--input"
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
              v-model="specialist.birth"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Телефон:</div>
          <div class="group__content">
            <phone-mask-input
              name="phone"
              inputClass="form-control"
              v-model="director.phone"
              placeholder="Номер телефона"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Email:</div>
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              placeholder="Введите email"
              v-model="director.email"
            />
          </div>
        </div>
        <div class="add-delivery-row__title text--blue">Мессенджеры:</div>
        <div
          class="group messengers"
          v-if="specialist.messengers"
          v-for="(messenger, index) in specialist.messengers"
          :key="messenger.name"
        >
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              name="name"
              placeholder="Введите название мессенджера..."
              :value="messenger.name"
              @input="changeMessenger($event, index)"
            />
            <phone-mask-input
              name="phone"
              inputClass="form-control"
              placeholder="Введите номер мессенджера..."
              :value="messenger.phone"
              @onValidate="onValidate($event, index)"
              @change="changeMessenger($event, index)"
            />
          </div>
        </div>

        <span class="add-messenger" @click="addMessenger">Добавить</span>
        <div class="add-delivery-row__title text--blue">Категории:</div>
        <div class="group">
          <div class="group__title">Категории:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите название категории..."
              v-model="currentInput"
            />
          </div>
        </div>
        <v-button red>Сохранить</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import axios from "@/api/axios";
import PhoneMaskInput from "vue-phone-mask-input";

export default {
  components: { VButton, PhoneMaskInput },
  data() {
    return {
      categories:
        this.editedItem && this.editedItem.categories
          ? this.editedItem.categories
          : [],
      currentInput: "",
      tempViews: [],
      regions: [],
      name: this.editedItem && this.editedItem.name ? this.editedItem.name : "",
      site: this.editedItem && this.editedItem.site ? this.editedItem.site : "",
      inn: this.editedItem && this.editedItem.inn ? this.editedItem.inn : "",
      office_address:
        this.editedItem && this.editedItem.office_address
          ? this.editedItem.office_address
          : "",
      warehouse_address:
        this.editedItem && this.editedItem.warehouse_address
          ? this.editedItem.warehouse_address
          : "",
      specialist: {
        name:
          this.editedItem &&
          this.editedItem.specialist &&
          this.editedItem.specialist.name
            ? this.editedItem.specialist.name
            : "",
        phone:
          this.editedItem &&
          this.editedItem.specialist &&
          this.editedItem.specialist.phone
            ? this.editedItem.specialist.phone
            : "",
        email:
          this.editedItem &&
          this.editedItem.specialist &&
          this.editedItem.specialist.email
            ? this.editedItem.specialist.email
            : "",
        birth:
          this.editedItem &&
          this.editedItem.specialist &&
          this.editedItem.specialist.birth
            ? this.editedItem.specialist.birth
            : "",
        messengers:
          this.editedItem &&
          this.editedItem.specialist &&
          this.editedItem.specialist.messengers
            ? this.editedItem.specialist.messengers
            : [],
      },
      director: {
        name:
          this.editedItem &&
          this.editedItem.director &&
          this.editedItem.director.name
            ? this.editedItem.director.name
            : "",
        phone:
          this.editedItem &&
          this.editedItem.director &&
          this.editedItem.director.phone
            ? this.editedItem.director.phone
            : "",
        email:
          this.editedItem &&
          this.editedItem.director &&
          this.editedItem.director.email
            ? this.editedItem.director.email
            : "",
        birth:
          this.editedItem &&
          this.editedItem.director &&
          this.editedItem.director.birth
            ? this.editedItem.director.birth
            : "",
      },
      region:
        this.editedItem && this.editedItem.region && this.editedItem.region
          ? this.editedItem.region
          : null,
      title: this.editedItem
        ? "Редактировать поставщика"
        : "Добавить поставщика",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    addMessenger() {
      if (this.specialist.messengers.length) {
        const lastMessenger =
          this.specialist.messengers[this.specialist.messengers.length - 1];
        if (!lastMessenger.name || !lastMessenger.phone) {
          this.$toast.error("Заполните предыдущее поле!");
          return;
        }
      }
      this.specialist.messengers.push({ name: "", phone: "" });
    },
    onValidate(e, index) {
      const editedMessenger = this.specialist.messengers[index];
      editedMessenger["phone"] = e.number;
      this.specialist.messengers.splice(index, 1, editedMessenger);
    },
    changeMessenger(e, index) {
      const editedMessenger = this.specialist.messengers[index];
      editedMessenger[e.target.name] = e.target.value;
      this.specialist.messengers.splice(index, 1, editedMessenger);
    },
    onProvidersAdd() {
      if (!this.region) {
        this.$toast.error("Укажите регион!", "Ошибка");
        return;
      }
      this.changeStatus(false);
      let data = {
        provider: {
          name: this.name,
          site: this.site,
          inn: this.inn,
          office_address: this.office_address,
          warehouse_address: this.warehouse_address,
          categories: this.categories,
          specialist: this.specialist,
          director: this.director,
          region: this.region,
        },
      };

      if (this.editedItem) {
        data.providerId = this.editedItem._id;
        axios({
          url: `/providers/update/`,
          data: data,
          method: "POST",
        })
          .then(async (res) => {
            let result = await res;
            this.$emit("editProvider", result.data.provider);
            this.$toast.success("Поставщик успешно обновлен!");
            this.$emit("toggleOpen");
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          })
          .finally(() => {
            this.changeStatus(true);
          });
      } else {
        console.log(data);
        axios({
          url: `/providers/post/`,
          data: data,
          method: "POST",
        })
          .then(async (res) => {
            let result = await res;
            this.$emit("addProvider", result.data.provider);
            this.$toast.success("Поставщик успешно добавлен!");
            this.$emit("toggleOpen");
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          })
          .finally(() => {
            this.changeStatus(true);
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

.add-delivery-row {
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
    position: relative;
    padding-top: 10px;

    & + * {
      margin-bottom: 15px;
    }

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      display: block;
      height: 2px;
      border-radius: $border-radius;
      background-color: $color-gray-secondary;
    }
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

  .vdatetime-input,
  .form-select {
    width: 401px;
  }
  .form-control {
    width: 976px;
  }

  .add-messenger {
    border-radius: $border-radius;
    cursor: pointer;
    font-size: 17px;
    font-weight: 700;
    width: 230px;
    height: 37px;
    background-color: $color-red;
    color: $color-white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  .messengers {
    .form-control {
      width: 401px;

      & + * {
        margin-left: 10px;
      }
    }
  }
  .phone-mask-wrapper-lib {
    height: 33px;
  }
}
</style>
