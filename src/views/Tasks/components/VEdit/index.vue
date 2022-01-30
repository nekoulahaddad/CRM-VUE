<template>
  <div class="list__edit edit">
    <form @submit.prevent="onTaskEdit">
      <div class="edit__inner">
        <div class="edit__title text--blue">
          {{ $t("pages.tasks.taskEdit") }}
        </div>
        <div class="group">
          <div class="group__title">Наименоване задачи:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              v-model="task.title"
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
              v-model="task.description"
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
              v-model="task.initiator_comment"
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
                {{
                  photo.name
                    ? photo.name.length > 30
                      ? photo.name.slice(0, -10) +
                        " ... ." +
                        photo.type.split("/")[1]
                      : photo.name
                    : `Документ ${index + 1}`
                }}
              </div>
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
        taskData.append("title", this.task.title);
      }

      if (this.description) {
        taskData.append("description", this.task.description);
      }
      if (this.initiator_comment) {
        taskData.append("initiator_comment", this.task.initiator_comment);
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
        .then(async (res) => {
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
      alert(url);
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
</style>

<style lang="scss">
@import "@/styles/_variables";

.list__edit {
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
  .vdatetime-input {
    width: 330px;
  }
}
</style>
