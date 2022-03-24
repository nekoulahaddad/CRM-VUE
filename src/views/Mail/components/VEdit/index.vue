<template>
  <div class="list__info list-info mail-edit-form">
    <form @submit.prevent="onCallbackUpdate">
      <div class="edit__inner">
        <div class="group__title text--blue">
          {{ $t("pages.mail.edit") }}
        </div>

        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("manager") }}
          </div>
          <div
            class="group__value manager"
            @click="changeManager = !changeManager"
          >
            {{ fio || "Добавить менеджера" }}
          </div>
        </div>

        <div class="group" v-if="changeManager">
          <autocomplete
            required
            ref="executor"
            :search="getUsersByFIO"
            :get-result-value="getResultValue"
            placeholder="Введите Ф.И.О. менеджера..."
          >
            <template #result="{ result, props }">
              <li v-bind="props" @click="selectUser(result)">
                {{ transformFIO(result) }}
              </li>
            </template>
          </autocomplete>
        </div>

        <div class="d-flex" style="margin-bottom: 10px">
          <div class="flex-1">
            <div class="group">
              <div class="group__title">{{ $t("orderNumber") }}</div>
              <div class="group__content">
                <input
                  class="form-control"
                  type="text"
                  :placeholder="$t('orderNumber')"
                  v-model="orderNumber"
                />
              </div>
            </div>
          </div>
          <div style="margin-left: 25px">
            <div class="group">
              <div class="group__title">Статус:</div>
              <div class="group__content">
                <v-select
                  :options="[
                    { label: 'Обработана', value: true },
                    { label: 'Не обработана', value: false },
                  ]"
                  :reduce="(item) => item.value"
                  v-model="status"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group__title">{{ $t("comment") }}</div>
          <div style="word-break: break-all">
            {{ comment || "Комментарий отсутствует" }}
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <v-button red>{{ $t("save") }}</v-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    VButton,
  },
  data() {
    return {
      users: [],
      fio: "",
      comment: null,
      orderNumber: null,
      isLoading: false,
      changeManager: false,
      status: "",
    };
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    async getUsersByFIO(input) {
      if (input.trim().length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getmanagers/${input}/${this.item.region._id}`).then(
          async (res) => {
            resolve(res.data);
          }
        );
      });
    },
    getResultValue(result) {
      return "";
    },
    selectUser(user) {
      this.manager = user._id;
      this.fio = `${user.surname} ${user.name.charAt(0)}.${
        user.lastname ? user.lastname.charAt(0) + "." : ""
      }`;
      this.changeManager = false;
    },
    onCallbackUpdate() {
      let callbackData = {
        callbackId: this.item._id,
        manager: this.manager,
        comment: this.comment,
        orderNumber: this.orderNumber,
        status: this.status,
      };
      axios({
        url: `/callbacks/update/`,
        data: callbackData,
        method: "POST",
      }).then(() => {
        this.$emit("toggleEdit", this.item);
        this.$toast.success("Заявка успешно изменена");
        this.$emit("getData");
      });
    },
  },
  created() {
    this.orderNumber =
      this.item.order && this.item.order.length
        ? this.item.order[0].number
        : "";
    this.comment = this.item.comment;
    this.fio = `${
      this.item.manager[0].surname
    } ${this.item.manager[0].name.charAt(0)}.${
      this.item.manager[0].lastname
        ? this.item.manager[0].lastname.charAt(0) + "."
        : ""
    }`;
    this.manager = this.item.manager[0]._id;
  },
};
</script>

<style lang="scss">
.mail-edit-form {
  .group {
    select {
      max-width: 401px;
    }
  }
  .autocomplete-input {
    width: 100%;
  }
  .manager {
    border-bottom: 1px dashed;
    cursor: pointer;
    user-select: none;
  }
}
</style>
