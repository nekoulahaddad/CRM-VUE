<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-callback"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title" style="position: relative">
        Добавить обращение

        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addCallback',
            })
          "
          class="add-callback__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-callback__inner">
      <form class="delivery-form" @submit.prevent="onProvidersAdd">
        <div class="add-callback__title text--blue">Информация о клиенте:</div>

        <div class="d-flex justify-content-between">
          <div class="flex-1" style="margin-right: 25px">
            <div class="group">
              <div class="group__title">Фамилия:</div>
              <div class="group__content">
                <input
                  type="text"
                  class="form-control"
                  maxlength="50"
                  v-model="lastname"
                  placeholder="Фамилия"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">
                Имя: <span class="required">*</span>
              </div>
              <div class="group__content">
                <input
                  type="text"
                  class="form-control"
                  maxlength="50"
                  v-model="firstname"
                  placeholder="Имя"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Отчество:</div>
              <div class="group__content">
                <input
                  type="text"
                  class="form-control"
                  maxlength="50"
                  v-model="middlename"
                  placeholder="Отчество"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Телефон:</div>
              <div class="group__content">
                <phone-mask-input
                  inputClass="form-control"
                  v-model="phone"
                  placeholder="Телефон"
                  style="width: 100%"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Описание:</div>
              <div class="group__content">
                <textarea
                  class="form-textarea"
                  maxlength="3000"
                  v-model="message"
                  placeholder="Описание"
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

            <div class="group" v-if="region">
              <div class="group__title">Категория</div>
              <div class="group__content">
                <span
                  @click="toggleSetCategory = !toggleSetCategory"
                  style="border-bottom: 1px dashed; cursor: pointer"
                >
                  {{ category ? category.categoryName : "Добавить" }}
                </span>
              </div>
              <autocomplete
                v-if="toggleSetCategory"
                :search="getCategoriesBySearch"
                :get-result-value="getResultCaregory"
                placeholder="Введите категорию..."
              >
                <template #result="{ result, props }">
                  <li v-bind="props" @click="selectCategory(result)">
                    {{ result.categoryName }}
                  </li>
                </template>
              </autocomplete>
            </div>

            <div class="group">
              <div class="group__title">Ф.И.О. исполнителя</div>
              <div class="group__content">
                <span
                  @click="setExecutor = !setExecutor"
                  style="border-bottom: 1px dashed; cursor: pointer"
                >
                  {{ issuedTo ? transformFIO(issuedTo) : "Добавить" }}
                </span>
              </div>
              <autocomplete
                v-if="setExecutor"
                ref="executors"
                :get-result-value="getExecutorResult"
                :search="getManagersBySearch"
                placeholder="Введите Ф.И.О. исполнителя..."
              >
                <template #result="{ result, props }">
                  <li v-bind="props" @click="selectUser(result)">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
            </div>
          </div>
        </div>

        <v-button red>Создать</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import PhoneMaskInput from "vue-phone-mask-input";
import { numeric, url, required, email } from "vuelidate/lib/validators";

export default {
  props: {
    regions: Array,
    editedItem: Object,
  },
  components: { PhoneMaskInput },
  validations: {
    region: {
      required,
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
  data() {
    return {
      fio: "",
      toggleSetCategory: false,
      currentInput: "",
      setExecutor: false,
      categories:
        this.editedItem && this.editedItem.categories
          ? this.editedItem.categories
          : [],
      firstname:
        this.editedItem && this.editedItem.client.name
          ? this.editedItem.client.name
          : "",
      lastname:
        this.editedItem && this.editedItem.client.surname
          ? this.editedItem.client.surname
          : "",
      middlename:
        this.editedItem && this.editedItem.client.lastname
          ? this.editedItem.client.lastname
          : "",
      phone:
        this.editedItem && this.editedItem.phone ? this.editedItem.phone : "",
      orderNumber:
        this.editedItem && this.editedItem.orderNumber
          ? this.editedItem.orderNumber
          : null,
      category:
        this.editedItem && this.editedItem.category
          ? this.editedItem.category.category
          : null,
      issuedTo:
        this.editedItem && this.editedItem.issuedTo
          ? this.editedItem.issuedTo
          : null,
      issuedBy:
        this.editedItem && this.editedItem.issuedBy
          ? this.editedItem.issuedBy
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
      statusList: ["отказ", "подтвержденный"],
      users: [],
      region:
        this.editedItem && this.editedItem.region
          ? this.editedItem.region
          : null,
      title: this.editedItem ? "Редактировать обращения" : "Добавить обращения",
      confirmMsg: {
        header: "Вы уверены?",
        message: "Подтвердите действие.",
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
    getResultCaregory(result) {
      return result.categoryName;
    },
    selectCategory(category) {
      this.category = category;
      this.toggleSetCategory = false;
    },
    getCategoriesBySearch(input) {
      if (input.trim().length < 1) {
        return [];
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
          console.log(res.data.views);
          resolve(res.data.views);
        });
      });
    },
    async getManagersBySearch(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios(`/user/getmanagers/${input}`).then((res) => {
          resolve(res.data);
        });
      });
    },
    getExecutorResult() {
      return "";
    },
    selectUser(user) {
      if (user._id === this.currentUser._id) {
        this.$toast.error("Вы не можете быть исполнителем!");
        this.fio = ``;
        this.users = [];
        return;
      }
      if (this.issuedTo === null) {
        this.issuedTo = user;
        this.setExecutor = false;
        this.fio = ``;
        this.users = [];
        return;
      }
      this.$toast.error("При выбранном отделе исполнитель только один!");
    },
    onProvidersAdd() {
      if (!this.region) {
        this.$toast.error("Укажите регион!");
        return;
      }

      let data = {
        callissue: {
          firstname: this.firstname,
          lastname: this.lastname,
          middlename: this.middlename,
          issuedBy: this.issuedBy,
          issuedTo: this.issuedTo,
          status: this.status,
          phone: this.phone,
          orderNumber: this.orderNumber,
          category: this.category,
          region: this.region,
          message: this.message,
          comment: this.comment,
        },
      };

      if (this.editedItem) {
        data.dataId = this.editedItem._id;
        if (!this.orderNumber && this.issuedBy._id !== this.currentUser._id) {
          return this.$toast.warning("№ заказа обязательно для заполнения!");
        }
        axios({
          url: `/callcenterissues/update/`,
          data: data,
          method: "POST",
        })
          .then(async (respons) => {
            if (respons.data.message === "ORDEREXISTS") {
              return this.$toast.warning("№ заказа существует!");
            }

            this.$toast.success("Обращения успешно обновлен!");
            this.$emit("toggleEdit", this.editedItem);
            this.$emit("fetchData");
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      } else {
        data.callissue.issuedBy = this.currentUser;
        axios({
          url: `/callcenterissues/post/`,
          data: data,
          method: "POST",
        })
          .then((res) => {
            this.$toast.success("Обращения успешно добавлен!");
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      }
    },
  },
  async created() {
    if (this.editedItem) {
      await axios({
        url: `/categories/get/`,
        data: {
          options: {
            nesting: 0,
            region: this.region._id,
          },
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        this.editedItem.categories = result.data.categories;
        this.categories = result.data.categories;
        this.tempViews = result.data.categories;
      });
    }
  },
  watch: {
    currentInput: function () {
      if (this.region === null) {
        this.$toast.warning("Укажите регион!");
      }
    },
    region: async function () {
      if (this.region !== null) {
        this.currentInput = "";
        await axios({
          url: `/categories/get/`,
          data: {
            options: {
              nesting: 0,
              region: this.region._id,
            },
          },
          method: "POST",
        }).then(async (res) => {
          let result = await res;
          this.category = null;
          this.categories = result.data.categories;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.add-callback {
  &__title {
    position: relative;

    &.text--blue {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
  &__close {
    cursor: pointer;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
  }

  &__inner {
    padding: 10px;
  }
  .list__columns {
    grid-template-columns: 1fr !important;
    .list__column {
      text-align: left !important;
      font-size: 16px;
    }
  }
  button {
    width: 230px;
    margin-top: 10px;
  }
}
</style>
