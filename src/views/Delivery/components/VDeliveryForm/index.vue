<template>
  <form class="delivery-form" @submit.prevent="onProvidersAdd">
    <div class="add-delivery-row__title text--blue">
      Основная информация о поставщике:
    </div>

    <div class="d-flex justify-content-between">
      <div class="flex-1" style="margin-right: 25px">
        <div class="group">
          <div class="group__title">
            Название компании: <span class="required">*</span>
          </div>
          <div class="group__content">
            <input
              class="form-control"
              :class="{ 'form-control--error': $v.name.$error }"
              type="text"
              placeholder="Введите название о компании..."
              v-model.trim="$v.name.$model"
              maxlength="100"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Сайт:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="url"
              :class="{ 'form-control--error': $v.site.$error }"
              placeholder="Вставьте ссылку на сайт..."
              name="site"
              v-model="site"
              v-model.trim="$v.site.$model"
              maxlength="100"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">ИНН:</div>
          <div class="group__content">
            <input
              class="form-control hide-arrows"
              type="number"
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
              maxlength="200"
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
              maxlength="200"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="group">
          <div class="group__title">
            Регион: <span class="required">*</span>
          </div>
          <div class="group__content">
            <v-select
              :class="{ 'form-control--error': $v.region.$error }"
              :options="
                regions.map((region) => ({
                  label: region.title,
                  value: region,
                }))
              "
              :reduce="(item) => item.value"
              v-model="$v.region.$model"
            />
          </div>
        </div>
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

    <div class="d-flex justify-content-between">
      <div class="flex-1" style="margin-right: 25px">
        <div class="group">
          <div class="group__title">Ф.И.О:</div>
          <div class="group__content">
            <input
              type="text"
              class="form-control"
              placeholder="Введите Ф.И.О"
              v-model.trim="director.name"
              maxlength="200"
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
              type="email"
              class="form-control"
              placeholder="Введите email"
              v-model.trim="director.email"
              maxlength="100"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="group">
          <div class="group__title">Дата рождения:</div>
          <div class="group__content">
            <datetime
              type="datetime"
              input-class="forms__container--input"
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
              v-model="director.birth"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="add-delivery-row__title text--blue">Специалист:</div>

    <div class="d-flex justify-content-between">
      <div class="flex-1" style="margin-right: 25px">
        <div class="group">
          <div class="group__title">Ф.И.О: <span class="required">*</span></div>
          <div class="group__content">
            <input
              type="text"
              class="form-control"
              :class="{ 'form-control--error': $v.specialist.name.$error }"
              placeholder="Введите Ф.И.О"
              v-model.trim="$v.specialist.name.$model"
              maxlength="200"
            />
          </div>
        </div>

        <div class="group">
          <div class="group__title">
            Телефон: <span class="required">*</span>
          </div>
          <div class="group__content">
            <phone-mask-input
              name="phone"
              :class="{ 'form-control--error': $v.specialist.phone.$error }"
              inputClass="form-control"
              v-model.trim="$v.specialist.phone.$model"
              placeholder="Номер телефона"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Email: <span class="required">*</span></div>
          <div class="group__content">
            <input
              type="text"
              class="form-control"
              :class="{ 'form-control--error': $v.specialist.email.$error }"
              placeholder="Введите email"
              v-model.trim="$v.specialist.email.$model"
              maxlength="100"
            />
          </div>
        </div>
      </div>
      <div>
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
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <div class="flex-1" style="margin-right: 25px">
        <div class="add-delivery-row__title text--blue">Мессенджеры:</div>
        <div
          class="group messengers"
          v-if="specialist.messengers"
          v-for="(messenger, index) in specialist.messengers"
          :key="messenger.name"
        >
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              name="name"
              placeholder="Введите название мессенджера..."
              :value="messenger.name"
              style="width: 401px"
              @input="changeMessenger($event, index)"
            />
            <phone-mask-input
              name="phone"
              inputClass="form-control"
              placeholder="Введите номер мессенджера..."
              :value="messenger.phone"
              @onValidate="onValidate($event, index)"
              style="width: 401px"
              @change="changeMessenger($event, index)"
            />
            <VueCustomTooltip label="Удалить мессенджер">
              <img
                alt=""
                class="messengers__close"
                src="/icons/close_icon.svg"
                @click="deleteMessenger(index)"
              />
            </VueCustomTooltip>
          </div>
        </div>
        <span class="add-messenger" @click="addMessenger">Добавить</span>
      </div>
      <div>
        <div class="add-delivery-row__title text--blue">Категории:</div>
        <div class="group">
          <div class="group__title">Категории:</div>
          <div class="chips">
            <chip
              v-for="(chip, index) in categories
                ? categories
                : this.editedItem.categories"
              :key="chip.categoryName"
              :text="chip.categoryName"
              :close="true"
              @closed="deleteChip(index)"
            />
          </div>
          <div class="group__content">
            <autocomplete
              :search="searchByExecutor"
              :get-result-value="getResultValue"
              placeholder="Введите наименование организации..."
            >
              <template #result="{ result, props }">
                <li v-bind="props" @click="selectProvider(result)">
                  {{ result.categoryName }}
                </li>
              </template>
            </autocomplete>
          </div>
        </div>
      </div>
    </div>

    <v-button red>Сохранить</v-button>
  </form>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import axios from "@/api/axios";
import { numeric, url, required, email } from "vuelidate/lib/validators";
import PhoneMaskInput from "vue-phone-mask-input";
import Chip from "vue-chip";

export default {
  props: {
    editedItem: {
      type: Object,
    },
  },
  validations: {
    name: {
      required,
    },
    region: { required },
    inn: {
      numeric,
    },
    specialist: {
      name: { required },
      email: {
        required,
        email,
      },
      phone: {
        required,
      },
    },
    site: {
      url,
    },
  },
  components: { VButton, PhoneMaskInput, Chip },
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
    deleteChip(index) {
      this.categories.splice(index, 1);
    },
    onValidate(e, index) {
      const editedMessenger = this.specialist.messengers[index];
      editedMessenger["phone"] = e.number;
      this.specialist.messengers.splice(index, 1, editedMessenger);
    },
    getResultValue(result) {
      return "";
    },
    searchByExecutor(input) {
      if (input.trim().length < 1) {
        return [];
      }

      if (!this.region) {
        this.$toast.error("Укажите регион!", "Ошибка");
        return;
      }
      return new Promise((resolve) => {
        axios({
          url: `/categories/getcategoriesbysearch/`,
          data: {
            title: input,
            region: this.region._id,
          },
          method: "POST",
        }).then((res) => {
          this.tempViews = res.data.views;
          resolve(res.data.views);
        });
      });
    },
    changeMessenger(e, index) {
      const editedMessenger = this.specialist.messengers[index];
      editedMessenger[e.target.name] = e.target.value;
      this.specialist.messengers.splice(index, 1, editedMessenger);
    },
    deleteMessenger(index) {
      this.specialist.messengers.splice(index, 1);
    },
    selectProvider(provider) {
      this.categories.push(provider);
    },
    onProvidersAdd() {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      if (!this.region.value) {
        this.$toast.error("Укажите регион");
        return;
      }

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
          data,
          method: "POST",
        })
          .then(() => {
            this.$emit("toggleEdit", this.editedItem);
            this.$emit("refresh");
            this.$toast.success("Поставщик успешно изменен!");
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      } else {
        axios({
          url: `/providers/post/`,
          data,
          method: "POST",
        })
          .then(() => {
            this.$toast.success("Поставщик успешно добавлен!");
            this.$emit("fetchData");
            this.$store.commit("toggleAction", { key: "addDelivery" });
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
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
    if (this.editedItem) {
      axios({
        url: `/providers/getcategories/`,
        data: {
          parent_id: this.editedItem._id,
          region: this.region._id,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        this.editedItem.categories = result.data.categories;
        this.categories = result.data.categories;
      });
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.delivery-form {
  .list__column--title {
    font-size: 16px;
  }

  button {
    width: 230px;
    height: 37px;
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
    &__close {
      margin-left: 10px;
      position: relative;
      top: 5px;
    }
  }
  .phone-mask-wrapper-lib {
    width: 100%;
    height: 33px;
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
  .vdatetime-input,
  .form-select {
    width: 401px;
  }
  .form-control {
  }
  .chip {
    position: relative;
    padding-right: 40px;
    border-radius: $border-radius;
    background-color: $color-gray-secondary;
    margin-right: 10px;
    margin-bottom: 10px;

    i {
      font-size: 37px;
      position: absolute;
      right: 17px;
    }
  }
  .autocomplete-input {
    width: 401px;
  }
  .required {
    color: #db1f35;
  }
  .v-select {
    width: 401px;
  }
}
</style>
