<template>
  <v-modal :adaptive="true" :minHeight="727" :minWidth="1130" name="addTask">
    <div class="vm--modal__title">
      Создать задачу
      <img
        @click="$modal.hide('addTask')"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="add-task-modal">
      <div class="vm--modal__inner">
        <form @submit.prevent="onTaskAdd">
          <div class="group">
            <div class="group__title">Наименование задачи:</div>
            <div class="group__content">
              <input
                required
                type="text"
                class="form-control"
                placeholder="Введите название задачи"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">ФИО исполнителей:</div>
            <div class="group__executors" :style="{ height: height }">
              <vue-scroll>
                <div
                  class="group__executor"
                  v-for="(executor, index) in executors"
                  :key="index"
                >
                  {{ transformFIO(executor) }}
                </div>
              </vue-scroll>
            </div>
            <div class="group__content">
              <autocomplete
                required
                :search="getUsersByFIO"
                :get-result-value="getResultValue"
                placeholder="Введите ФИО сотрудника..."
              >
                <template #result="{ result, props }">
                  <li v-bind="props" @click="selectUser(result)">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
            </div>
          </div>
          <div class="group">
            <div class="group__title">Отдел:</div>
            <div class="group__content">
              <select
                required
                class="form-select"
                name="targetRegion"
                v-model="department"
              >
                <option :value="null">Не выбрано</option>
                <option
                  v-for="department in departments"
                  :value="department.value"
                >
                  {{ department.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="group">
            <div class="group__title">Описание:</div>
            <div class="group__content">
              <textarea
                required
                type="text"
                class="form-textarea"
                placeholder="Введите описание задачи..."
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Документы:</div>
            <div class="group__content">
              <div class="group__content">
                <input
                  hidden
                  multiple
                  type="file"
                  id="documents"
                  name="documents"
                />
                <label for="documents">Загрузить</label>
              </div>
            </div>
          </div>
          <div class="group">
            <div class="group__title">Дедлайн:</div>
            <div class="group__content">
              <datetime
                required
                type="date"
                v-model="date"
                input-class="forms__container--input"
                :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
              />
            </div>
          </div>

          <v-button red>Отправить</v-button>
        </form>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";
import { Datetime } from "vue-datetime";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: {
    VButton,
    datetime: Datetime,
  },
  computed: {
    id: {
      get: function () {
        let user = this.getUserRole();
        return user._id;
      },
    },
    height() {
      if (this.executors.length < 3) {
        return `${this.executors.length * 43}px`;
      }
      return "126px";
    },
  },
  data() {
    return {
      date: new Date().toISOString(),
      title: "",
      fio: "",
      department: null,
      executors: [],
      users: [],
      description: "",
      executor: "",
      documents: ["Выбрать файлы"],
    };
  },
  watch: {
    department: function () {
      if (this.department !== null && this.executors.length > 1) {
        this.executors = [];
        this.$toast.error("Выбирите одного исполнителя при выборе отдела!");
      }
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    getResultValue() {},
    onTaskAdd() {
      this.changeStatus(false);

      if (this.$moment().valueOf() > new Date(this.date).getTime()) {
        this.$toast.error("Дэдлайн не может быть раньше текущего времени!");
        this.changeStatus(true);
        return;
      }
      let taskData = new FormData();
      if (this.title) {
        taskData.append("title", this.title);
      }
      if (this.executors && this.executors.length) {
        taskData.append("executors", JSON.stringify(this.executors));
      } else {
        this.$toast.error("Необходимо выбрать ответственного!");
        return;
      }
      if (this.department) {
        taskData.append("department", this.department);
      }
      if (this.description) {
        taskData.append("description", this.description);
      }
      if (this.date) {
        taskData.append("deadline_date", this.date);
      } else {
        this.$toast.error("Необходимо выбрать дату окончания!");
        this.changeStatus(true);
        return;
      }
      if (this.documents[0] !== "Выбрать файлы") {
        for (let i = 0; i < this.documents.length; i++) {
          taskData.append("documents", this.documents[i]);
        }
      }
      axios({
        url: `/tasks/post/`,
        data: taskData,
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$emit("addToTasks", result.data.task);
          this.$toast.success("Задача успешно добавлена!");
          this.$emit("toggleOpen");
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
    selectUser(user) {
      if (user._id === this.id) {
        this.$toast.error("Вы не можете быть исполнителем!");
        return;
      }
      let index = this.executors.findIndex(
        (arrUser) => arrUser._id === user._id
      );
      if (index > -1) {
        this.$toast.error("Исполнитель уже в списке!");
        this.fio = ``;
        this.users = [];
        return;
      }
      if (this.department === null || this.executors.length < 1) {
        this.executors.push(user);
        return;
      }
      this.$toast.error("При выбранном отделе исполнитель только один!");
    },
    async getUsersByFIO(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios(`/user/getsearch/${input}`).then((res) => {
          resolve(res.data);
        });
      });
    },
  },
  created() {
    axios.post("/departments/get").then(async (res) => {
      let result = await res;
      this.departments = result.data.departments;
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.vm--modal {
  &__subtitle {
    font-weight: 700;
    margin-bottom: 10px;
  }

  &__inner {
    padding-top: 10px;
    padding-bottom: 14px;
  }

  &__close {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .add-task-modal {
    .autocomplete-input {
      width: 689px;
    }

    .group__executors {
      width: 415px;
    }
    .group__executor {
      height: 33px;
      border-radius: $border-radius;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      display: flex;
      padding-left: 10px;
      padding-right: 10px;
      margin-bottom: 10px;
      margin-left: 4px;
      margin-right: 4px;
    }

    button {
      width: 230px;
    }

    .form-control {
      width: 689px;
    }
    .form-textarea {
      width: 976px;
      min-height: 150px;
    }
    .form-select {
      width: 401px;
    }

    .group {
      &__title {
        font-size: 12px;
      }
    }

    label[for="documents"] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 236px;
      height: 33px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(0, 0, 0, 0.3);
      background-color: $color-white;
      border-radius: $border-radius;
      cursor: pointer;
    }
  }
}
</style>
