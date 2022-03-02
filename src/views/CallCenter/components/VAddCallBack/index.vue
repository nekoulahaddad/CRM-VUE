<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-callback"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
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
                <input type="text" class="form-control" />
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
          </div>
        </div>

        <v-button red>Создать</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { numeric, url, required, email } from "vuelidate/lib/validators";

export default {
  props: {
    regions: Array,
    editedItem: Object,
  },
  validations: {
    region: {
      required,
    },
  },
  data() {
    return {
      fio: "",
      currentInput: "",
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
    onProvidersAdd() {
      if (!this.region) {
        this.$toast.error("Укажите регион!", "Ошибка");
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
            const transformedData = {
              _id: data.dataId,
              ...data.callissue,
              category: {
                category: {
                  ...data.callissue.category,
                },
              },
              client: {
                name: data.callissue.firstname,
                surname: data.callissue.lastname,
                lastname: data.callissue.middlename,
              },
              createdAt: this.editedItem.createdAt,
              confirmedAt: this.editedItem.confirmedAt,
            };
            this.$emit("editForm", transformedData);

            this.$toast.success("Обращения успешно обновлен!");
            this.$emit("toggleOpen");
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
          .then(async (res) => {
            const createdData = await res;
            this.$emit("addCallIssue", {
              ...data.callissue,
              _id: createdData.data.data._id,
              number: createdData.data.data.number,
              issuedBy: this.currentUser,
              category: {
                category: {
                  ...data.callissue.category,
                },
              },
              client: {
                name: data.callissue.firstname,
                surname: data.callissue.lastname,
                lastname: data.callissue.middlename,
              },
              createdAt: createdData.data.data.createdAt,
            });
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
    right: 10px;
    top: 13px;
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
