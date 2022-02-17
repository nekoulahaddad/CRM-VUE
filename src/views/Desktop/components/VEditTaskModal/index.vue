<template>
  <v-modal
    :adaptive="true"
    :minWidth="1130"
    :minHeight="700"
    :maxHeight="1200"
    name="editTask"
  >
    <div class="edit-task-modal">
      <div class="vm--modal__title">
        {{ title }}
        <img
          alt=""
          class="close-icon"
          src="@/assets/icons/close_icon.svg"
          @click="cancel"
        />
      </div>
      <div class="d-flex justify-content-between vm--modal__inner">
        <div class="vm--modal__left">
          <div class="vm--modal__action table__actions">
            <div class="table__icon">
              <img
                @click="deleteTask"
                v-if="role === 'superadmin'"
                src="@/assets/icons/trash_icon.svg"
                alt=""
              />
            </div>
            <div class="table__icon">
              <input
                hidden
                type="file"
                id="docs"
                name="documents"
                multiple
                @change="fileUpload($event)"
              />
              <label for="docs">
                <img src="@/assets/icons/attach_icon.svg" alt="" />
              </label>
            </div>
          </div>
          <form class="vm--modal__form modal-form">
            <div class="group">
              <div class="group__title">Наименование задачи:</div>
              <div class="group__content">
                <input class="form-control" type="text" v-model="title" />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Описание задачи:</div>
              <div class="group__content">
                <textarea class="form-textarea" v-model="description" />
              </div>
            </div>

            <div class="group">
              <div class="group__title">Документы:</div>
              <div
                class="group__documents"
                :style="{ height: documentsHeight }"
                v-if="documents.length"
              >
                <vue-scroll>
                  <div
                    class="group__document"
                    v-for="(document, index) in documents"
                    :key="index"
                    @click.prevent="
                      downloadItem(serverAddr + `${document}`, document)
                    "
                  >
                    Документ {{ index + 1 }}
                  </div>
                </vue-scroll>
              </div>
              <div v-else class="group__empty-documents">Документов нет</div>
            </div>

            <!-- Подзадачи -->
            <template v-if="sub_tasks.length">
              <div class="edit-task-modal__title">Подзадачи:</div>

              <div class="group">
                <div
                  class="group__sub-tasks"
                  :style="{ height: subTasksHeight }"
                >
                  <vue-scroll>
                    <div
                      class="group__sub-task"
                      v-for="(sub_task, index) in sub_tasks"
                      :key="index"
                    >
                      <span>{{ sub_task.title }}</span>
                      <div
                        v-if="
                          sub_task.initiator._id === id || role === 'superadmin'
                        "
                      >
                        <img
                          alt=""
                          src="@/assets/icons/trash_icon.svg"
                          @click="$emit('toggleSubDelete', sub_task)"
                        />
                      </div>
                    </div>
                  </vue-scroll>
                </div>
              </div>
            </template>

            <div class="vm--modal__buttons">
              <v-button
                v-if="
                  task.initiator &&
                  userId === task.initiator._id &&
                  task.executors._id.length >= 1
                "
                @click="changeTaskStatus(task, 'completed', status)"
                red
              >
                {{ $t("pages.tasks.taskExecute") }}
              </v-button>
              <v-button
                v-if="
                  (task.executor && task.executor._id.includes(userId)) ||
                  status === 'assigned'
                "
                @click="changeTaskStatus(task, 'accepted', status)"
                red
              >
                {{ $t("pages.tasks.taskAccepted") }}
              </v-button>
              <v-button
                v-if="
                  (task.executor && task.executor._id.includes(userId)) ||
                  status === 'assigned'
                "
                white
                @click="changeTaskStatus(task, 'not accepted', status)"
              >
                {{ $t("pages.tasks.taskNotAccepted") }}
              </v-button>

              <v-button
                v-if="
                  (task.executor && task.executor._id.includes(userId)) ||
                  status === 'accepted'
                "
                @click="changeTaskStatus(task, 'tested', status)"
                white
              >
                {{ $t("pages.tasks.taskTested") }}
              </v-button>
              <v-button
                v-if="
                  task.initiator &&
                  userId === task.initiator._id &&
                  status === 'tested'
                "
                @click="changeTaskStatus(task, 'completed', status)"
                red
              >
                {{ $t("pages.tasks.taskExecute") }}
              </v-button>
              <v-button
                v-if="
                  task.initiator &&
                  userId === task.initiator._id &&
                  status === 'tested'
                "
                @click="changeTaskStatus(task, 'under revision', status)"
                white
              >
                {{ $t("pages.tasks.taskUnderRevision") }}
              </v-button>
              <v-button
                v-if="
                  (task.executor && task.executor._id.includes(userId)) ||
                  status === 'under revision'
                "
                @click="changeTaskStatus(task, 'tested', status)"
                white
              >
                {{ $t("pages.tasks.taskTested") }}
              </v-button>
            </div>
          </form>
        </div>
        <div class="vm--modal__right">
          <form>
            <div class="edit-task-modal__title">Сведения:</div>
            <!-- Исполнитель -->
            <div class="group">
              <div class="group__title">Исполнители:</div>
              <div class="group__executors" :style="{ height: height }">
                <vue-scroll>
                  <div
                    class="group__executor"
                    v-for="(surname, index) in executors.surname"
                    :key="index"
                    :style="{ width: width }"
                  >
                    <span>{{ surname }}</span>
                  </div>
                </vue-scroll>
              </div>
              <div class="group__content"></div>
            </div>
            <!-- Комментарий -->
            <div class="group">
              <div class="group__title">Комментарий:</div>
              <div class="group__content">
                <textarea class="form-textarea" v-model="initiator_comment" />
              </div>
            </div>
            <!-- Автор -->
            <div class="group">
              <div class="group__title">Автор:</div>
              <div class="group__content">
                <input class="form-control" type="text" v-model="initiator" />
              </div>
            </div>
            <!-- Дедлайн -->
            <div class="group">
              <div class="group__title">Дедлайн:</div>
              <div class="group__content">
                <datetime
                  type="datetime"
                  input-class="forms__container--input"
                  :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
                  v-model="date"
                  style="width: 371px"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    task: {
      type: Object,
    },
    status: String,
  },
  data() {
    return {
      date: new Date(),
      title: "",
      description: "",
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      initiator_comment: "",
      documents: [],
      sub_tasks: [],
      executors: {
        surname: [],
      },
      initiator: "",
    };
  },
  computed: {
    subTasksHeight() {
      if (this.sub_tasks.length < 3) {
        return `${this.sub_tasks.length * 50}px`;
      }
      return "150px";
    },
    documentsHeight() {
      if (this.documents.length < 3) {
        return `${this.documents.length * 43}px`;
      }
      return "126px";
    },
    height() {
      if (this.executors.surname.length < 3) {
        return `${this.executors.surname.length * 43}px`;
      }
      return "126px";
    },
    width() {
      if (this.executors.surname.length < 3) {
        return "100%";
      }
      return "358px";
    },
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
    userId: {
      get: function () {
        let role = this.getUserRole();
        return role._id;
      },
    },
    id: {
      get: function () {
        let user = this.getUserRole();
        return user._id;
      },
    },
  },
  methods: {
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files;
    },
    cancel() {
      this.$modal.hide("editTask");
    },
    changeTaskStatus(task, newStatus) {
      this.$emit("changeTaskStatus", task, newStatus, this.status);
    },
    deleteTask() {
      this.$emit("toggleDelete", this.task, this.status);
      this.$modal.hide("editTask");
    },
    deleteDocument(index) {
      this.documents = Array.from(this.documents).filter((doc, i) => {
        if (i !== index) {
          return doc;
        }
      });
    },
    downloadItem(url, filename) {
      axios
        .get(url, { responseType: "blob" })
        .then((response) => {
          const link = document.createElement("a");
          const blob = new Blob([response.data]);
          let urll = window.URL.createObjectURL(blob);
          link.href = urll;
          link.download = filename;
          link.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(urll);
            document.body.removeChild(link);
          }, 0);
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },
    getSubTasks(id) {
      axios({
        url: "/tasks/getsub",
        data: {
          taskId: id,
          page: 0,
        },
        method: "POST",
      }).then(async (res) => {
        this.sub_tasks = res.data.tasks;
      });
    },
    onTaskEdit() {
      if (this.$moment().valueOf() > new Date(this.date).getTime()) {
        this.$toast.error("Дэдлайн не может быть раньше текущего времени!");
        this.changeStatus(true);
        return;
      }
      let taskData = new FormData();
      taskData.append("taskId", this.task._id);
      if (this.title) {
        taskData.append("title", this.title);
      }

      if (this.description) {
        taskData.append("description", this.description);
      }
      if (this.initiator_comment) {
        taskData.append("initiator_comment", this.initiator_comment);
      }
      if (this.date) {
        taskData.append("deadline_date", this.date);
      } else {
        this.$toast.error("Необходимо выбрать дату окончания!");
        return;
      }
      if (this.documents[0] !== "Выбрать файлы") {
        for (let i = 0; i < this.documents.length; i++) {
          taskData.append("documents", this.task.documents[i]);
        }
      }
      axios({
        url: "/tasks/update/",
        data: taskData,
        method: "POST",
      })
        .then(() => {
          this.$toast.success("Задача успешно изменена!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
  watch: {
    task() {
      if (this.task._id) {
        this.date = new Date(this.task.deadline_date).toISOString();
        this.title = this.task.title;
        this.initiator = this.transformFIO(this.task.initiator);
        this.executors = this.task.executor;
        this.description = this.task.description;
        this.initiator_comment = this.task.initiator_comment;

        if (this.task.documents.length) {
          this.documents = this.task.documents;
        }

        this.getSubTasks(this.task._id);
      }
    },
  },
  created() {
    this.sub_tasks = [];
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_variables";

.vm--modal {
  &__left {
    flex: 1;
    margin-right: 20px;
    .form-textarea,
    .form-control {
      width: 679px;
    }
  }

  &__inner {
    padding-top: 10px;
  }

  &__right {
    background-color: $color-gray-secondary;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    padding: 10px;
    width: 391px;

    .form-textarea,
    .form-control {
      width: 371px;
    }
    .vdatetime {
      width: 100%;
    }
    .forms__container--input {
      min-width: 371px !important;
    }
  }

  .edit-task-modal {
    .table__actions {
      justify-content: left !important;
      margin-bottom: 20px;
    }

    &__title {
      font-weight: 700;
      color: $color-blue;
      margin-bottom: 10px;
      font-size: 16px;
    }

    .group__title {
      font-size: 12px;
    }

    .form-textarea {
      min-height: 150px !important;
    }
    .group__executors {
      height: 126px;
    }
    .group__executor {
      box-shadow: 0 0 5px rgb(0 0 0 / 20%);
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;
      background-color: $color-white;
      height: 33px;
      width: 358px;

      margin-bottom: 10px;
    }

    .group__documents {
      width: 255px;
    }
    .group__document {
      width: 236px;
      display: flex;
      justify-content: center;
      height: 33px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: $border-radius;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;
      margin-bottom: 10px;
      margin-left: 4px;
      margin-right: 4px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;

      &:first-child {
        margin-top: 4px;
      }

      span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding-right: 30px;
      }
    }
  }
  .group__sub-task {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 660px;
    height: 40px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: $border-radius;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 10px;

    span {
      padding-right: 30px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-weight: 700;
      font-size: 12px;
    }

    &:first-child {
      margin-top: 4px;
    }
  }

  span[role="tooltip"] {
    padding-right: 0;

    &:after {
      background-color: $color-black;
      color: $color-white;
      border-radius: $border-radius;
    }
  }
  .group__empty-documents {
    margin-bottom: 10px;
  }
}
</style>
