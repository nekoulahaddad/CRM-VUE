<template>
  <v-modal
    :adaptive="true"
    :minHeight="960"
    :minWidth="1017"
    name="addTask"
    @before-close="beforeClose"
  >
    <div class="vm--modal__title">
      Создать задачу
      <img
        alt=""
        @click="cancel"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
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
                v-model="title"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">
              ФИО {{ department ? `ответственного` : "исполнителей" }}:
            </div>
            <div
              class="group__executors"
              v-if="executors.length"
              :style="{ height: height }"
            >
              <vue-scroll>
                <div
                  class="group__executor"
                  v-for="(executor, index) in executors"
                  :key="index"
                >
                  <span>{{ transformFIO(executor) }}</span>
                  <div>
                    <img
                      alt=""
                      src="@/assets/icons/trash_icon.svg"
                      @click="deleteExecutor(index)"
                    />
                  </div>
                </div>
              </vue-scroll>
            </div>
            <div class="group__content">
              <autocomplete
                ref="executor"
                :disabled="department && executors.length > 0"
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
                class="form-select"
                name="targetRegion"
                v-model="department"
              >
                <option :value="null">Не выбрано</option>
                <option
                  v-for="department in departments"
                  :value="department._id"
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
                v-model="description"
              />
            </div>
          </div>

          <!-- Документы -->
          <div class="group">
            <div class="group__title">Документы:</div>
            <div
              class="group__participants"
              :style="{ height: documentsHeight }"
            >
              <vue-scroll>
                <div
                  class="group__participant"
                  v-if="documents.length"
                  v-for="(photo, index) in documents"
                  :key="index"
                >
                  <span
                    style="
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ photo.name ? photo.name : photo }}
                  </span>
                  <div>
                    <VueCustomTooltip label="Удалить">
                      <img
                        alt=""
                        src="@/assets/icons/trash_icon.svg"
                        @click="deleteDocument(index)"
                      />
                    </VueCustomTooltip>
                  </div>
                </div>
              </vue-scroll>
            </div>
            <div class="group__content">
              <input
                hidden
                type="file"
                id="document-file"
                multiple
                name="documents"
                @change="fileUpload($event)"
              />
              <label for="document-file">Загрузить</label>
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

          <v-spinner v-if="!isLoading" small />
          <v-button v-else red>Отправить</v-button>
        </form>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";
import VSpinner from "@/components/VSpinner";
import { Datetime } from "vue-datetime";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: {
    VButton,
    VSpinner,
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
    documentsHeight() {
      if (this.documents.length < 3) {
        return `${this.documents.length * 43}px`;
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
      departments: [],
      executors: [],
      users: [],
      description: "",
      isLoading: true,
      executor: "",
      documents: [],
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
    beforeClose() {
      this.$store.commit("toggleAction", {
        key: "addDbTask",
      });
    },
    cancel() {
      this.$modal.hide("addTask");
    },
    deleteDocument(index) {
      this.documents = Array.from(this.documents).filter((doc, i) => {
        if (i !== index) {
          return doc;
        }
      });
    },
    deleteExecutor(index) {
      this.executors.splice(index, 1);
    },
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files;
    },
    getResultValue() {},
    onTaskAdd() {
      if (this.$moment().valueOf() > new Date(this.date).getTime()) {
        this.$toast.error("Дэдлайн не может быть раньше текущего времени!");
        return;
      }
      let taskData = new FormData();
      if (this.title) {
        taskData.append("title", this.title);
      }
      if (this.executors && this.executors.length) {
        taskData.append("executors", JSON.stringify(this.executors));
      } else {
        this.$toast.error("Необходимо выбрать исполнятеля!");
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
        return;
      }
      if (this.documents[0] !== "Выбрать файлы") {
        for (let i = 0; i < this.documents.length; i++) {
          taskData.append("documents", this.documents[i]);
        }
      }

      this.isLoading = false;

      axios({
        url: `/tasks/post/`,
        data: taskData,
        method: "POST",
      })
        .then(() => {
          this.cancel();
          this.$toast.success("Задача успешно добавлена!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.isLoading = true;
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
        return;
      }
      if (this.department === null || this.executors.length < 1) {
        this.executors.push(user);
        this.$refs.executor.setValue("");
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
    button {
      position: absolute;
      bottom: 12px;
      left: 20px;
    }

    .autocomplete-input {
      width: 976px;

      &:disabled {
        opacity: 0.3;
      }
    }

    .vm--modal__buttons {
      flex-wrap: wrap !important;
      button {
        margin-left: 0 !important;
        margin-right: 10px !important;
        margin-bottom: 10px !important;
      }
    }

    .group__executors {
      width: 415px;
      margin-bottom: 10px;
    }
    .group__executor {
      width: 395px;
      height: 33px;
      border-radius: $border-radius;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;
      margin: 4px 4px 10px;
    }

    .group__empty-executors {
      margin-bottom: 10px;
    }

    button {
      width: 230px;
    }

    .form-control {
      width: 976px;
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

    .vdatetime {
      width: 401px;
    }
    .group__participants {
      width: 418px;
    }
    .group__participant {
      height: 40px;
      border-radius: $border-radius;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 10px;
      padding-right: 10px;
      width: 401px;
      overflow-x: hidden;
      margin-top: 10px;

      &:last-child {
        margin-bottom: 10px;
      }
    }
    .participants__empty {
      margin-bottom: 10px;
    }
    label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 230px;
      height: 37px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(0, 0, 0, 0.3);
      background-color: $color-white;
      border-radius: $border-radius;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
