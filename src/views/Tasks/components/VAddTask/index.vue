<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-task-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Поставить новую задачу
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addTask',
            })
          "
          class="add-task-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-task-row__inner">
      <form @submit.prevent="onTaskAdd">
        <div class="add-task-row__title text--blue">Новая задача</div>
        <div class="group">
          <div class="group__title">Наименование задачи:</div>
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              placeholder="Введите название задачи"
              name="title"
              @input="onChange($event)"
            />
          </div>
        </div>
        <div class="group participants">
          <div class="group__title">ФИО исполнителей:</div>
          <div class="group__participants">
            <div
              v-if="executors.length"
              class="group__participant"
              v-for="(executor, index) in executors"
              :key="index"
            >
              <span>{{ transformFIO(executor) }}</span>
              <div>
                <VueCustomTooltip label="Удалить">
                  <img
                    alt=""
                    src="@/assets/icons/trash_icon.svg"
                    @click="deleteChip(index)"
                  />
                </VueCustomTooltip>
              </div>
            </div>
            <div class="participants__empty" v-else>Исполнителей нет</div>
          </div>
          <div class="group__content">
            <autocomplete
              class="participants__input"
              :search="searchByExecutor"
              :get-result-value="getResultValue"
              placeholder="Введите участника мероприятия..."
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
          <div class="group__title">Отделы:</div>
          <div class="group__content">
            <select
              class="form-select"
              name="targetRegion"
              v-model="department"
            >
              <option :value="null">Не выбрано</option>
              <option v-for="department in departments" :value="department._id">
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
              class="form-textarea"
              placeholder="Введите описание задачи..."
              name="description"
              @input="onChange($event)"
            />
          </div>
        </div>

        <div class="group">
          <div class="group__title">Документы:</div>
          <div class="group__participants">
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
              v-model="date"
              input-class="forms__container--input"
              type="date"
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            />
          </div>
        </div>
        <v-spinner v-if="!isLoading" small />
        <v-button v-else red>Отправить</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VSpinner from "@/components/VSpinner";
import axios from "@/api/axios";
import Chip from "vue-chip";
import { mapMutations } from "vuex";

export default {
  components: {
    VButton,
    Chip,
    VSpinner,
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
      isLoading: true,
      description: "",
      executor: "",
      documents: [],
    };
  },
  computed: {
    id: {
      get: function () {
        let user = this.getUserRole();
        return user._id;
      },
    },
  },
  watch: {
    department: function () {
      if (this.department !== null && this.executors.length > 1) {
        this.executors = [];
        this.$toast.error("Выберите одного исполнителя при выборе отдела!");
      }
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    chipClosed() {
      this.executors.splice(index, 1);
    },
    async getUsersByFIO() {
      if (this.fio === "") {
        return;
      }
      axios(`/user/getsearch/${this.fio}`).then(async (res) => {
        let result = await res;
        this.users = result.data;
      });
    },
    getResultValue() {
      return "";
    },
    selectUser(user) {
      if (user._id === this.id) {
        this.$toast.error("Вы не можете быть исполнителем!");
        this.fio = ``;
        this.users = [];
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
        this.fio = ``;
        this.users = [];
        return;
      }
      this.$toast.error("При выбранном отделе исполнитель только один!");
      return;
    },
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files;
    },
    deleteChip(index) {
      this.executors.splice(index, 1);
    },
    deleteDocument(index) {
      this.documents = Array.from(this.documents).filter((doc, i) => {
        if (i !== index) {
          return doc;
        }
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
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    onTaskAdd() {
      if (!this.executors.length) {
        this.$toast.error("Вы не выбрали исполнителя");
        return;
      }
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
          this.isLoading = true;
          this.$emit("refresh");
          this.$toast.success("Задача успешно добавлена!");
          this.$store.commit("toggleAction", {
            key: "addTask",
          });
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.isLoading = true;
        });
    },
  },
  created() {
    axios({
      url: "/user/getdepartments",
    }).then((res) => {
      this.departments = res.data.departments;
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.add-task-row {
  .list__columns {
    grid-template-columns: 1fr !important;
    .list__column {
      text-align: left;
      font-size: 16px;
    }
  }

  .group__documents {
    margin-bottom: 10px;
  }

  .list__column--title {
    position: relative;
  }

  &__title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 10px;
  }

  button {
    width: 230px;
    height: 37px;
  }

  &__inner {
    padding: 10px;
  }
  .form-control {
    width: 976px;
  }
  .form-textarea {
    width: 976px;
  }
  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
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
  .form-select {
    width: 401px;
  }
  .vdatetime-input {
    width: 401px;
  }
  .chips {
    margin-bottom: 10px;
  }
  .autocomplete-input {
    width: 401px;
  }
  .chip {
    position: relative;
    padding-right: 40px;
    margin-bottom: 10px;
    background-color: $color-gray-secondary;

    & + * {
      margin-left: 5px;
    }

    i {
      font-size: 37px;
      position: absolute;
      right: 17px;
    }
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
}
</style>
