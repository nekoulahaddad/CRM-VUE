<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-department-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить отдел
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addDepartment',
            })
          "
          class="add-department-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-department-row__inner">
      <form @submit.prevent="onSectionAdd">
        <div class="add-department-row__title text--blue">
          Основная информация:
        </div>
        <div class="card__group group">
          <div class="group__title">Название:</div>
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              placeholder="Введите название отдела..."
              name="role"
              v-model="title"
              @change="onChange($event)"
            />
          </div>
        </div>
        <div class="card__group group">
          <div class="group__title">Руководитель:</div>
          <autocomplete
            required
            :search="searchByExecutor"
            :get-result-value="getResultValue"
            placeholder="Введите исполнителя задачи..."
          >
            <template #result="{ result, props }">
              <li v-bind="props" @click="selectUser(result)">
                {{ transformFIO(result) }}
              </li>
            </template>
          </autocomplete>
        </div>
        <v-button red>Сохранить</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import VEmployeeForm from "../VEmployeeForm";
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: { VEmployeeForm, VButton },
  data() {
    return {
      title: "",
      fio: "",
      leader: null,
      users: [],
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
    getResultValue(result) {
      return this.transformFIO(result);
    },
    async getUsersByFIO() {
      axios(`/user/getsearch/${this.fio}`).then(async (res) => {
        let result = await res;
        this.users = result.data;
      });
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
    selectUser(user) {
      this.leader = user;
      this.fio = this.transformFullFIO(user);
      this.users = [];
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
      axios({
        url: `/departments/post/`,
        data: sectionData,
        method: "POST",
      })
        .then(async () => {
          await this.$emit("refresh");
          this.$toast.success("Отдел успешно добавлен!");
          this.$store.commit("toggleAction", {
            key: "addDepartment",
          });
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.add-department-row {
  .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      position: relative;
    }
  }

  .list__column--title {
    font-size: 16px !important;
  }

  &__inner {
    padding: 10px;
  }

  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
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
  .form-select {
    width: 401px;
  }

  .autocomplete-input,
  .form-textarea,
  .form-control {
    width: 100%;
    font-weight: 500;
  }
}
</style>
