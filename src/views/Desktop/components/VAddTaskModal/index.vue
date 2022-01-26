<template>
  <v-modal :adaptive="true" :minHeight="727" :minWidth="1130" name="addTask">
    <div class="vm--modal__title">
      Поставить задачу
      <img
        @click="$modal.hide('addTask')"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner">
      <form @submit.prevent="onTaskAdd">
        <div class="vm--modal__subtitle">Новая задача:</div>
        <div class="group">
          <div class="group__title">Наименование задачи:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите название задачи"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Введите ФИО сотрудника</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите ФИО сотрудника"
              @input="getUsersByFIO"
              v-model="fio"
              v-if="
                department === null ||
                (department !== null && executors.length < 1)
              "
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Отдел:</div>
          <div class="group__content">
            <select
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
              <input type="file" id="documents" hidden name="documents" />
              <label for="documents">Загрузить</label>
            </div>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Дедлайн:</div>
          <div class="group__content">
            <datetime
              v-model="date"
              required
              input-class="forms__container--input"
              type="date"
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            />
          </div>
        </div>

        <v-button red>Отправить</v-button>
      </form>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";
import { Datetime } from "vue-datetime";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    departments: Array,
  },
  components: {
    VButton,
    datetime: Datetime,
  },
  data() {
    return {
      date: new Date(2023, 10, 30).toISOString(),
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
    async getUsersByFIO() {
      axios(`/user/getsearch/${this.fio}`).then(async (res) => {
        let result = await res;
        this.users = result.data;
      });
    },
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

  .form-control {
    width: 689px;
  }
  .form-textarea {
    width: 976px;
    min-height: 199px;
  }
  .form-select {
    width: 401px;
  }

  .group {
    &__title {
      font-size: 12px;
    }
  }

  &__close {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  button {
    width: 230px;
  }

  .vdatetime-input {
    width: 330px;
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
</style>
