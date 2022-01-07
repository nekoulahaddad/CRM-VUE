<template>
  <div class="list__info list-info">
    <div class="list-info__header">
      <div class="list-info__group group">
        <div class="group__title text--blue">
          {{ $t("pages.tasks.taskInfo") }}
        </div>
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
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskDocs") }}
          </div>
          <div class="group__value">123</div>
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
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskComment") }}
          </div>
          <div class="group__value">{{ comment }}</div>
        </div>
        <div class="group__footer">
          <v-button
            v-if="
              task.initiator &&
              userId === task.initiator._id &&
              task.executors >= 1
            "
            red
            @click.prevent="changeTaskStatus(task, 'completed')"
          >
            Выполнена
          </v-button>
          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'assigned'
            "
            @click.prevent="changeTaskStatus(task, 'accepted')"
            red
          >
            Принять
          </v-button>
          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'assigned'
            "
            @click.prevent="changeTaskStatus(task, 'not accepted')"
          >
            Отказаться
          </v-button>

          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'accepted'
            "
            @click.prevent="changeTaskStatus(task, 'tested')"
          >
            На проверку
          </v-button>
          <v-button
            v-if="
              task.initiator &&
              userId === task.initiator._id &&
              task.status.value === 'tested'
            "
            @click.prevent="changeTaskStatus(task, 'completed')"
          >
            Выполнена
          </v-button>
          <v-button
            v-if="
              task.initiator &&
              userId === task.initiator._id &&
              task.status.value === 'tested'
            "
            @click.prevent="changeTaskStatus(task, 'under revision')"
          >
            На доработку
          </v-button>
          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'under revision'
            "
            @click.prevent="changeTaskStatus(task, 'tested')"
          >
            На проверку
          </v-button>
        </div>
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
        this.$emit("toggleInfo");
      });
    },
  },
};
</script>

<style lang="scss">
button {
}
</style>
