<template>
  <div class="list__info list-info manager-edit-form">
    <form @submit.prevent>
      <div class="category-edit-form__title text--blue">
        Ответственный менеджер:
      </div>

      <div class="group__content">
        <div class="group__item text--bold-700">ФИО:</div>
        <div class="group__value">{{ fio || "" }}</div>
      </div>

      <div class="group">
        <div class="group__title">Изменить ответственного:</div>
        <div class="group__content">
          <autocomplete
            ref="executors"
            :search="searchByExecutor"
            :get-result-value="getResultValue"
            placeholder="Введите ФИО ответственного..."
          >
            <template #result="{ result, props }">
              <li v-bind="props" @click="selectUser(result)">
                {{ transformFIO(result) }}
              </li>
            </template>
          </autocomplete>
        </div>
      </div>

      <div class="group__content">
        <div class="group__item text--bold-700">Телефон:</div>
        <div class="group__value">{{ phone || "" }}</div>
      </div>

      <div class="manager-edit-form__buttons">
        <v-button
          red
          @click="setManager(false)"
          :disabled="!manager || notChanged"
          >Сохранить</v-button
        >
        <v-button @click="setManager(true)" :disabled="!manager" white>
          Удалить
        </v-button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    region: {
      type: String,
      default: () => "",
    },
    managerItem: {
      type: Object,
      default: () => false,
    },
  },
  data() {
    return {
      regions: [],
      targetRegion: "",
      users: [],
      phone: "",
      timer: null,
      fio: "",
      manager: null,
    };
  },
  computed: {
    editedManager: {
      get() {
        return this.managerItem.manager[0] ? this.managerItem.manager[0] : null;
      },
    },
    notChanged: {
      get() {
        return this.manager
          ? this.editedManager
            ? this.manager._id === this.editedManager._id
            : false
          : true;
      },
    },
  },
  methods: {
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    searchByExecutor(input) {
      if (input.length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getsearch/${input}`).then(async (res) => {
          resolve(res.data);
        });
      });
    },
    getResultValue() {
      return "";
    },
    selectUser(user) {
      this.manager = user._id;
      this.fio = this.transformFullFIO(user);
      this.manager = user;
      this.phone = user.phone;
      this.users = [];
    },
    setManager(clear) {
      this.manager._id = clear ? null : this.manager._id;
      axios({
        url: `/categories/setmanager/`,
        data: {
          categoryId: this.managerItem._id,
          region: this.region,
          managerId: this.manager._id,
        },
        method: "POST",
      })
        .then(() => {
          this.$emit("refreshGoods");
          this.$emit("toggleManager", this.managerItem);
          this.$toast.success("Менежжер успешно удален!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
  beforeMount() {
    if (this.managerItem.manager[0]) {
      this.fio = this.transformFullFIO(this.managerItem.manager[0]);
      this.phone = this.managerItem.manager[0].phone;
      this.manager = this.managerItem.manager[0];
    }
  },
};
</script>

<style lang="scss">
.manager-edit-form {
  .group__value {
    font-weight: 500;
  }
  .autocomplete-input {
    width: 976px;
  }
  &__buttons {
    display: flex;
  }
}
</style>
