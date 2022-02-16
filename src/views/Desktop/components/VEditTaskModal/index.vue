<template>
  <v-modal
    :adaptive="true"
    :minWidth="1130"
    :minHeight="600"
    :maxHeight="1200"
    name="editTask"
  >
    <div class="edit-task-modal">
      <div class="vm--modal__title">
        Редактировать задачу
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
              <img src="@/assets/icons/attach_icon.svg" alt="" />
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
              <div class="group__documents">
                <template v-if="documents.length">
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
                </template>
                <div v-else>Документов нет</div>
              </div>
            </div>

            <div class="vm--modal__buttons">
              <v-button
                v-if="
                  task.initiator &&
                  userId === task.initiator._id &&
                  task.executors >= 1
                "
                @click="changeTaskStatus(task, 'completed')"
                red
              >
                {{ $t("pages.tasks.taskExecute") }}
              </v-button>
              <v-button
                v-if="
                  task.executor &&
                  (userId === task.executor._id ||
                    userId === task.executor._id[0]) &&
                  task.status.value === 'assigned'
                "
                @click="changeTaskStatus(task, 'accepted')"
                red
              >
                {{ $t("pages.tasks.taskAccepted") }}
              </v-button>
              <v-button
                v-if="
                  task.executor &&
                  (userId === task.executor._id ||
                    userId === task.executor._id[0]) &&
                  task.status.value === 'assigned'
                "
                white
                @click="changeTaskStatus(task, 'not accepted')"
              >
                {{ $t("pages.tasks.taskNotAccepted") }}
              </v-button>

              <v-button
                v-if="
                  task.executor &&
                  (userId === task.executor._id ||
                    userId === task.executor._id[0]) &&
                  task.status.value === 'accepted'
                "
                @click="changeTaskStatus(task, 'tested')"
                white
              >
                {{ $t("pages.tasks.taskTested") }}
              </v-button>
              <v-button
                v-if="
                  task.initiator &&
                  userId === task.initiator._id &&
                  task.status.value === 'tested'
                "
                @click="changeTaskStatus(task, 'completed')"
                red
              >
                {{ $t("pages.tasks.taskExecute") }}
              </v-button>
              <v-button
                v-if="
                  task.initiator &&
                  userId === task.initiator._id &&
                  task.status.value === 'tested'
                "
                @click="changeTaskStatus(task, 'under revision')"
                white
              >
                {{ $t("pages.tasks.taskUnderRevision") }}
              </v-button>
              <v-button
                v-if="
                  task.executor &&
                  (userId === task.executor._id ||
                    userId === task.executor._id[0]) &&
                  task.status.value === 'under revision'
                "
                @click="changeTaskStatus(task, 'tested')"
                white
              >
                {{ $t("pages.tasks.taskTested") }}
              </v-button>
            </div>
          </form>
        </div>
        <div class="vm--modal__right">
          <form>
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
    type: String,
  },
  data() {
    return {
      date: new Date(),
      title: "",
      description: "",
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      initiator_comment: "",
      documents: [],
      executors: {
        surname: [],
      },
      initiator: "",
    };
  },
  computed: {
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
  },
  methods: {
    cancel() {
      this.$modal.hide("editTask");
    },
    changeTaskStatus(task, status) {
      this.$emit("changeTaskStatus", task, status);
    },
    deleteTask() {
      this.$emit("toggleEdit", this.task, this.type);
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
      }
    },
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
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;

      & + * {
        margin-top: 10px;
      }

      span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding-right: 30px;
      }
    }
  }
}
</style>
