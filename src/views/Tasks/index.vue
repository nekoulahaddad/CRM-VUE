<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/tasks_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.tasks.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="tasks" />
      </div>

      <!-- Контент -->
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.tasks.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.tasks.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="(task, index) in dataset"
                :key="task._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened':
                    infoItem._id === task._id || index === activeIndex,
                }"
              >
                <v-task
                  :activeIndex="activeIndex"
                  :id="id"
                  :infoItem="infoItem"
                  :index="index"
                  :task="task"
                  @toggleInfo="toggleInfo"
                  @getSubTasks="getSubTasks"
                />

                <!-- Блок с детальной информацией о задаче -->
                <v-task-info v-if="infoItem._id === task._id" :task="task" />

                <!-- Блок с подзадачами -->
                <div
                  v-if="index === activeIndex"
                  class="list__subtasks sub-tasks"
                >
                  <div class="sub-tasks__title text--blue">
                    {{ $t("pages.tasks.taskSubTasks") }}
                  </div>
                  <div
                    v-for="(sub_task, sIndex) in sub_tasks"
                    :key="sub_task._id"
                    class="list__row list__row--white"
                  >
                    <v-sub-task :index="sIndex" :task="sub_task" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-pagination :count="count" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VTask from "./components/VTask";
import VSubTask from "./components/VSubTask";
import VTaskInfo from "./components/VTaskInfo";
import VFilter from "@/components/VFilter";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import dateMixins from "@/mixins/date";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import roleMixins from "@/mixins/role";
import statusMixins from "@/mixins/status";
import fioMixins from "@/mixins/fio";
import getDataFromPage from "@/api/getDataFromPage";
import axios from "@/api/axios";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VTask,
    VTaskInfo,
    VSubTask,
  },
  mixins: [dateMixins, fioMixins, roleMixins, statusMixins],
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      open: false,
      edit: false,
      deleteForm: false,
      infoForm: false,
      isLoading: false,
      deleteSubForm: false,
      dataset: [],
      addedItem: {},
      editedItem: {},
      deletedItem: {},
      infoItem: {},
      count: 0,
      filtersOptions: {
        status: "all",
        dates:
          this.role === "admin" ||
          this.role === "worker" ||
          this.role === "seo" ||
          this.role === "manager" ||
          this.role === "content"
            ? "today"
            : null,
        creation_date: -1,
        deadline_date: null,
      },
      isLoadingSubTasks: false,
      activeIndex: -1,
      sub_tasks: [],
    };
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
    id: {
      get: function () {
        let user = this.getUserRole();
        return user._id;
      },
    },
    userData: {
      get: function () {
        let user = this.getUserRole();
        return user;
      },
    },
  },
  mounted() {
    if (this.user) {
      this.filtersOptions.executor = this.user._id;
    }
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          `/tasks/get`,
          this.filtersOptions
        );

        this.activeIndex = -1;
        this.dataset = data.tasks;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.infoItem = {};
        this.$scrollTo("body", 300, {});
      }
    },
    toggleOpen() {
      this.open = !this.open;
    },
    toggleDelete(id) {
      if (!this.deleteForm) {
        this.deletedItem._id = id;
      } else {
        this.deletedItem = {};
      }
      this.deleteForm = !this.deleteForm;
    },
    toggleEdit(item) {
      if (!this.edit) {
        this.editedItem = item;
      } else {
        this.editedItem = {};
      }
      this.edit = !this.edit;
    },
    toggleSubDelete(id) {
      if (!this.deleteSubForm) {
        this.deletedItem._id = id;
      } else {
        this.deletedItem = {};
      }
      this.deleteSubForm = !this.deleteSubForm;
    },
    toggleInfo(item) {
      this.activeIndex = -1;

      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    addToTasks(task) {
      console.log(task);
      this.addedItem = task;
      let dataset = this.dataset;
      if (dataset.length < 15) {
        dataset.push(task);
        this.dataset = dataset;
      }
      this.count++;
      setTimeout(() => {
        this.addedItem = {};
      }, 500);
    },
    editToTasks(task) {
      if (task.parent_id) {
        this.getSubTasks(task.parent_id);
        return;
      }
      let index = this.dataset.findIndex((item) => item._id === task._id);
      setTimeout(() => {
        let dataset = this.dataset;
        dataset[index] = task;
        this.dataset = dataset;
        this.editedItem = {};
      }, 500);
    },
    removeFromTask(task) {
      this.activeIndex = -1;
      this.deletedItem = task;
      let index = this.dataset.findIndex((item) => item._id === task._id);
      setTimeout(() => {
        let dataset = this.dataset;
        dataset.splice(index, 1);
        this.dataset = dataset;
        this.deletedItem = {};
      }, 500);
    },
    removeSubFromTask(task) {
      this.deletedItem = task;
      let index = this.sub_tasks.findIndex((item) => item._id === task._id);
      setTimeout(() => {
        let dataset = this.sub_tasks;
        dataset.splice(index, 1);
        this.sub_tasks = dataset;
        this.deletedItem = {};
      }, 500);
    },
    sort(type) {
      switch (type) {
        case "creation":
          if (this.filtersOptions.creation_date) {
            this.filtersOptions.creation_date *= -1;
            this.filtersOptions.deadline_date = null;
            return;
          }
          this.filtersOptions.creation_date = -1;
          this.filtersOptions.deadline_date = null;

          break;
        case "deadline":
          if (this.filtersOptions.deadline_date) {
            this.filtersOptions.deadline_date *= -1;
            this.filtersOptions.creation_date = null;
            return;
          }
          this.filtersOptions.deadline_date = -1;
          this.filtersOptions.creation_date = null;

          break;
      }
    },
    resetFilters() {
      this.activeIndex = -1;
      this.$refs.filters.filterOptions = {};
      this.$refs.filters.activeIndex = 0;
      this.filtersOptions = {};
    },
    getSubTasks(id, index) {
      this.infoItem = {};

      if ((index || index === 0) && this.activeIndex === index) {
        this.activeIndex = -1;
        return;
      }

      this.isLoadingSubTasks = true;
      if (index || index === 0) {
        this.activeIndex = index;
      }

      this.$toast.success("Получаю подзадачи!");
      axios({
        url: "/tasks/getsub",
        data: {
          taskId: id,
          page: 0,
        },
        method: "POST",
      }).then(async (res) => {
        this.isLoadingSubTasks = false;
        this.sub_tasks = res.data.tasks;
        console.log(this.sub_tasks);
      });
    },
    changeTaskStatus(task, status) {
      let index;
      index = this.dataset.findIndex((item) => item._id === task._id);
      if (index === -1) {
        index = this.sub_tasks.findIndex((item) => item._id === task._id);
        let dataset = this.sub_tasks;
        dataset[index].status = status;
        this.sub_tasks = dataset;
        return;
      }
      index = this.dataset.findIndex((item) => item._id === task._id);
      let dataset = this.dataset;
      dataset[index].status = status;
      this.dataset = dataset;
    },
    changeTaskMark(id, e) {
      let mark = e.target.value;
      let taskData = new FormData();
      taskData.append("taskId", id);
      taskData.append("mark", mark);
      axios({
        url: "/tasks/update",
        data: taskData,
        method: "POST",
      }).then(() => {
        this.$toast.success("Оценка изменена!");
      });
    },
  },
  watch: {
    $route: function () {
      this.fetchData();
    },
    filtersOptions: {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.list__columns {
  grid-template-columns: 50px 140px 140px 450px 120px 120px 120px 1fr;
}
.list__header {
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
.sub-tasks {
  .list__row {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    & + * {
      margin-top: 10px;
    }
  }
  .list__columns {
    padding-left: 109px;
    padding-right: 60px;
  }
}
</style>
