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
        <img class="close-icon" src="@/assets/icons/close_icon.svg" alt="" />
      </div>
      <div class="d-flex justify-content-between vm--modal__inner">
        <div class="vm--modal__left">
          <div class="vm--modal__action table__actions">
            <div class="table__icon">
              <img
                @click="deleteTask"
                src="@/assets/icons/trash_icon.svg"
                alt=""
              />
            </div>
            <div class="table__icon">
              <img src="@/assets/icons/task_add_icon.svg" alt="" />
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
            <div class="vm--modal__buttons">
              <v-button red>Принять</v-button>
              <v-button white>Отказаться</v-button>
            </div>
          </form>
        </div>
        <div class="vm--modal__right">
          <form>
            <!-- Исполнитель -->
            <div class="group">
              <div class="group__title">Исполнитель:</div>
              <div class="group__content">
                <input class="form-control" type="text" v-model="executor" />
              </div>
            </div>
            <!-- Комментарий -->
            <div class="group">
              <div class="group__title">Комментарий:</div>
              <div class="group__content">
                <textarea class="form-textarea"></textarea>
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
                <input class="form-control" type="text" />
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
      executor: "",
      initiator: "",
    };
  },
  methods: {
    deleteTask() {
      this.$emit("toggleEdit", this.task, this.type);
      this.$modal.hide("editTask");
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
        this.executor = this.transformFIO(this.task.executor);
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

.edit-task-modal {
  .vm--modal {
    &__left {
      flex: 1;
      margin-right: 20px;
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
    }

    .table__actions {
      justify-content: left;
      margin-bottom: 20px;
    }

    .group__title {
      font-size: 12px;
    }
  }
  .form-textarea,
  .form-control {
    width: 679px;
  }
}
</style>
