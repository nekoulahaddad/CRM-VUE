<template>
  <div class="list__info list-info employee-edit-form">
    <form @submit.prevent="onSectionAdd">
      <div class="group__title group__title--big text--blue">
        Редактировать отдел:
      </div>
      <div class="group">
        <div class="group__title">Название</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            name="role"
            v-model="title"
            maxlength="100"
            @change="onChange($event)"
          />
        </div>
      </div>

      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Руководитель</div>
          <div class="group__value">
            <span
              @click="changeUser = !changeUser"
              style="border-bottom: 1px dashed; cursor: pointer"
            >
              {{ fio || "Добавить" }}
            </span>
          </div>
        </div>
      </div>

      <div class="group" v-if="changeUser">
        <autocomplete
          required
          :search="searchByExecutor"
          :get-result-value="getResultValue"
          placeholder="Сменить руководителя..."
        >
          <template #result="{ result, props }">
            <li v-bind="props" @click="selectUser(result)">
              {{ transformFIO(result) }}
            </li>
          </template>
        </autocomplete>
      </div>
      <v-button red>Отправить</v-button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import VEmployeeForm from "../VEmployeeForm";
import axios from "@/api/axios";
import { Datetime } from "vue-datetime";
import VButton from "@/components/VButton";

export default {
  components: { Datetime, VButton, VEmployeeForm },
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      fio: "",
      leader: null,
      users: [],
      changeUser: false,
      titleName: this.editedItem ? "Редактировать отдел" : "Добавить отдел",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    searchByExecutor(input) {
      if (input.trim().length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getsearch/${input}`).then(async (res) => {
          resolve(res.data);
        });
      });
    },
    getResultValue(result) {
      return this.transformFIO(result);
    },
    selectUser(user) {
      this.leader = user;
      this.fio = this.transformFullFIO(user);
      this.users = [];
      this.changeUser = false;
    },
    onSectionAdd() {
      this.changeStatus(false);
      let sectionData = {};
      if (this.title) {
        sectionData.title = this.title;
      }
      if (this.fio) {
        sectionData.leader = this.leader._id;
      }

      sectionData.departmentId = this.editedItem._id;

      axios({
        url: `/departments/update/`,
        data: sectionData,
        method: "POST",
      })
        .then(async () => {
          this.$emit("refresh");
          this.$emit("toggleEdit", this.editedItem);
          this.$toast.success("Отдел успешно изменен!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
  mounted() {
    this.title = this.editedItem.title;
    if (this.editedItem.leader.role) {
      this.fio = this.transformFullFIO(this.editedItem.leader);
      this.leader = this.editedItem.leader;
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  .group {
    select {
      max-width: 401px;
    }
  }
  .group__title {
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        display: block;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        top: 0;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
  select,
  input[type="text"] {
    font-weight: 500;
    font-size: 14px;
  }
  .form-control {
    width: 100%;
  }
  .vdatetime-popup__header {
    background: $color-red;
  }
  .autocomplete-input {
    width: 100% !important;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
