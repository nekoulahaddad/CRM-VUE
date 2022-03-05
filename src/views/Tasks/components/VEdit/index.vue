<template>
  <div class="list__edit edit subtask-edit">
    <form @submit.prevent="onTaskEdit">
      <div class="edit__inner">
        <div class="edit__title text--blue">
          {{ $t("pages.tasks.taskEdit") }}
        </div>
        <div class="group">
          <div class="group__title">Наименование задачи:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              v-model="title"
              placeholder="Введите название задачи..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Описание задачи:</div>
          <div class="group__content">
            <textarea
              type="text"
              class="form-textarea"
              v-model="description"
              placeholder="Введите описание задачи..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Комментарий:</div>
          <div class="group__content">
            <textarea
              type="text"
              class="form-textarea"
              v-model="initiator_comment"
              placeholder="Введите комментарий к задаче..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Документы:</div>
          <div class="group__content">
            <div v-if="documents.length" class="list__documents documents">
              <div
                v-for="(photo, index) in documents"
                class="documents__item"
                @click.prevent="downloadItem(serverAddr + `${photo}`, photo)"
              >
                <span
                  style="
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-weight: normal;
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
            <div v-else>Документов нет</div>
          </div>
          <div class="group__footer">
            <div>
              <input
                hidden
                multiple
                @change="fileUpload($event)"
                name="documents"
                type="file"
                id="document-file"
              />
              <label for="document-file">Выбрать файл</label>
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
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__footer">
            <v-button red>Отправить</v-button>
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
    task: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      date: new Date(),
      title: "",
      description: "",
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      initiator_comment: "",
      documents: [],
    };
  },
  components: { VButton },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    deleteDocument(index) {
      this.documents = Array.from(this.documents).filter((doc, i) => {
        if (i !== index) {
          return doc;
        }
      });
    },
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files;
    },
    onTaskEdit() {
      this.changeStatus(false);
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
          this.$emit("fetchData");
          this.$emit("toggleEdit", this.task);
          this.$toast.success("Задача успешно изменена!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
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
  },
  created() {
    this.date = new Date(this.task.deadline_date).toISOString();
    this.title = this.task.title;
    this.description = this.task.description;
    this.initiator_comment = this.task.initiator_comment;

    if (this.task.documents.length) {
      this.documents = this.task.documents;
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";
.edit {
  &__inner {
    padding: 10px;
  }

  &__title {
    font-weight: 700;
    margin-bottom: 10px;
  }
  .group__title {
    font-size: 12px;
  }

  .form-control {
    font-weight: 500;

    &::placeholder {
      font-weight: 500;
    }
  }
}

.subtask-edit {
  .form-textarea {
    font-weight: 500;
  }
  button {
    width: 230px;
    height: 37px;
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
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  .edit__inner .vdatetime-input {
    width: 330px;
  }
  .documents {
    width: 850px;
    display: flex;
    flex-wrap: wrap;
  }
  .documents__item {
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
    margin-bottom: 5px;
    margin-right: 15px;
  }
}
</style>
