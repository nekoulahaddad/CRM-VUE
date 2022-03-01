<template>
  <div class="list__info list-info tasks-list-info">
    <div class="group__title text--blue">
      {{ $t("pages.tasks.taskInfo") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskName") }}
        </div>
        <div class="group__value">{{ task.title }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskAuthor") }}
        </div>
        <div class="group__value">
          {{ task.initiator.surname }} {{ task.initiator.name }}
          {{ task.initiator.lastname }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskDescription") }}
        </div>
        <div class="group__value">{{ task.description }}</div>
      </div>

      <div class="group">
        <div class="group__title">{{ $t("pages.tasks.taskDocs") }}</div>
        <div class="group__content">
          <div v-if="documents.length" class="list__documents documents">
            <div
              v-for="(photo, index) in documents"
              class="documents__item"
              @click.prevent="downloadItem(serverAddr + `${photo}`, photo)"
            >
              <span>{{ photo }}</span>
              <img src="@/assets/icons/download_icon.svg" alt="" />
            </div>
          </div>
          <div v-else>Нет документов</div>
        </div>
      </div>

      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskRegion") }}
        </div>
        <div class="group__value">{{ task.executor.region.title }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskStatus") }}
        </div>
        <div v-html="transformStatus(task.status)" class="group__value"></div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskMark") }}
        </div>
        <div class="group__value">
          {{ task.mark ? task.mark : "..." }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskCreated") }}
        </div>
        <div class="group__value">
          {{ transformDate(task.creation_date) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.tasks.taskDeadline") }}
        </div>
        <div class="group__value">
          {{ transformDate(task.deadline_date) }}
        </div>
      </div>

      <div class="group">
        <div class="group__title">{{ $t("pages.tasks.taskComment") }}</div>
        <div class="group__content">
          <textarea
            :readonly="
              !(
                task.executor &&
                (userId === task.executor._id ||
                  userId === task.executor._id[0])
              )
            "
            class="form-textarea"
            v-model="comment"
          >
            {{ comment }}
          </textarea>
        </div>
      </div>

      <div class="group" v-if="role === 'superadmin'">
        <div class="group__title">Cтатус</div>
        <div class="group__content">
          <select class="form-select" name="status" v-model="changeStatus">
            <option :value="null" selected disabled>Выберите статус</option>
            <option value="assigned">Назначена</option>
            <option value="tested">На проверке</option>
            <option value="completed">Выполненые</option>
            <option value="under revision>">На доработке</option>
            <option value="accepted">Принята</option>
            <option value="not accepted">Не принята</option>
          </select>
        </div>
        <div class="group__footer" v-if="changeStatus">
          <v-button red @click="changeTaskStatus(task, changeStatus)">
            Сменить статус
          </v-button>
        </div>
      </div>
      <div class="group__footer">
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
            task.executor._id.includes(userId) &&
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
            task.executor._id.includes(userId) &&
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
            task.executor._id.includes(userId) &&
            task.status.value === 'accepted'
          "
          @click="changeTaskStatus(task, 'tested')"
          white
        >
          {{ $t("pages.tasks.taskTested") }}
        </v-button>
        <v-button
          v-if="
            1 === 2 &&
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
            task.executor._id.includes(userId) &&
            task.status.value === 'under revision'
          "
          @click="changeTaskStatus(task, 'tested')"
          white
        >
          {{ $t("pages.tasks.taskTested") }}
        </v-button>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";

export default {
  props: {
    task: {
      type: Object,
    },
  },
  data() {
    return {
      comment: this.task && this.task.comment ? this.task.comment : "",
      documents: this.task.documents || [],
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      changeStatus: null,
    };
  },
  computed: {
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
  components: { VButton },
  methods: {
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files;
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
    changeTaskStatus(task, status) {
      let taskData = new FormData();
      taskData.append("taskId", task._id);
      taskData.append("statusValue", status);
      taskData.append("comment", this.comment);
      if (this.documents[0] !== "Выбрать файлы") {
        for (let i = 0; i < this.documents.length; i++) {
          taskData.append("documents", this.documents[i]);
        }
      }
      axios({
        url: "/tasks/status/",
        data: taskData,
        method: "POST",
      }).then(async (res) => {
        let result = await res;

        if (
          status === "completed" ||
          status === "failed" ||
          status === "declained"
        ) {
          await axios({
            url: "/reports/post/",
            data: {
              taskId: task._id,
            },
            method: "POST",
          }).then(() => {
            this.$toast.success("Задача добавлена в отчет!");
          });
        }
        this.$toast.success("Статус задачи изменен!");
        this.$emit("changeTaskStatus", result.data.task, result.data.status);
        this.$emit("toggleInfo", this.task);
      });
    },
  },
};
</script>

<style lang="scss">
.documents__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
  width: 401px;

  & + * {
    margin-top: 10px;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 350px !important;
    white-space: nowrap;
  }
}
.tasks-list-info {
  .form-textarea {
    width: 100%;
  }
  .form-select {
    width: 401px;
  }
}
</style>
