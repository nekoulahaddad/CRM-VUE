<template>
  <div class="page tasks-page">
    <!-- Модальное окно для подтверждения удаления задачи -->

    <v-delete-item
      :deletedItem="deletedItem"
      :selectedItems="selectedItems"
      :deleteMany="deleteMany"
      @removeFromTask="removeFromTask"
      @afterDelete="afterDelete"
    />

    <!-- Модальное окно для подтверждения удаления подзадачи -->
    <v-delete-sub-item
      :deletedItem="deletedItem"
      @removeFromSubTask="removeFromSubTask"
    />

    <!-- Заголовок страницы -->
    <v-page-header
      icon="tasks_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />

    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left" v-if="showFilter">
        <v-filter type="tasks" />
      </div>

      <!-- Контент -->
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <div class="scroll-horizontal">
          <div class="list">
            <div class="list__header">
              <div class="list__title">
                {{ $t("pages.tasks.pageTitle") }}
              </div>
              <div class="list__columns">
                <div class="list__column d-flex align-items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox"
                    v-model="selectAll"
                    @change="selectAllItems"
                    :disabled="!isLoading"
                  />
                  №:
                </div>
                <div class="list__column">Автор:</div>
                <div class="list__column">Исполнитель:</div>
                <div class="list__column">Задача:</div>
                <div
                  class="list__column list__column--filter"
                  @click="sort('creation')"
                >
                  <span>Дата создания:</span>
                  <img
                    alt=""
                    src="@/assets/icons/filter_down.svg"
                    :class="{
                      'list__filter-icon--active':
                        filtersOptions.creation_date === -1,
                    }"
                    class="list__filter-icon"
                  />
                </div>
                <div
                  class="list__column list__column--filter"
                  @click="sort('deadline')"
                >
                  <span>Дедлайн:</span>
                  <img
                    alt=""
                    :class="{
                      'list__filter-icon--active':
                        filtersOptions.deadline_date === -1,
                    }"
                    class="list__filter-icon"
                    src="@/assets/icons/filter_down.svg"
                  />
                </div>
                <div class="list__column">Статус:</div>
                <div class="list__column"></div>
              </div>
            </div>

            <v-add-task
              v-if="addTask"
              @addToTasks="addToTasks"
              @refresh="fetchData"
            />

            <v-spinner v-if="!isLoading" />

            <template v-else-if="dataset.length">
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
                  :role="role"
                  :checked="selectedItems.includes(task._id)"
                  @toggleInfo="toggleInfo"
                  @getSubTasks="getSubTasks"
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией о задаче -->
                <v-task-info
                  v-if="infoItem._id === task._id"
                  :task="task"
                  @changeTaskStatus="changeTaskStatus"
                  @toggleInfo="toggleInfo"
                />

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
                    :class="{
                      'list__row--opened':
                        infoSubItem._id === sub_task._id ||
                        editedItem._id === sub_task._id,
                    }"
                  >
                    <v-sub-task
                      :id="id"
                      :index="sIndex"
                      :infoItem="infoSubItem"
                      :editedItem="editedItem"
                      :task="sub_task"
                      @toggleSubInfo="toggleSubInfo"
                      @toggleEdit="toggleEdit"
                      @toggleSubDelete="toggleSubDelete"
                    />

                    <!-- Блок с детальной информацией о задаче -->
                    <v-task-info
                      v-if="infoSubItem._id === sub_task._id"
                      :task="sub_task"
                      @changeTaskStatus="changeTaskStatus"
                    />

                    <!-- Блок редактирования задачи -->
                    <v-edit
                      :task="sub_task"
                      v-if="editedItem._id === sub_task._id"
                      @editTask="editToTasks"
                      @toggleEdit="toggleEdit"
                      @fetchData="fetchData"
                    />
                  </div>
                </div>
              </div>
              <v-pagination :count="count" />
            </template>
            <v-not-found-query v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VEdit from "./components/VEdit";
import VTask from "./components/VTask";
import VAddTask from "./components/VAddTask";
import VDeleteItem from "./components/VDeleteItem";
import VDeleteSubItem from "./components/VDeleteSubItem";
import VSubTask from "./components/VSubTask";
import VTaskInfo from "./components/VTaskInfo";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import dataMixins from "@/mixins/data";
import axios from "@/api/axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  mixins: [dataMixins],
  components: {
    VFilter,
    VDeleteItem,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VEdit,
    VTask,
    VTaskInfo,
    VSubTask,
    VAddTask,
    VPageHeader,
    VDeleteSubItem,
  },
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      deleteMany: false,
      selectAll: false,
      showFilter: false,
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
      infoSubItem: {},
      count: 0,
      filtersOptions: {
        status: "all",
        dates:
          this.role === "admin" ||
          this.role === "worker" ||
          this.role === "seo" ||
          this.role === "manager" ||
          this.role === "content" ||
          this.role === "superadmin"
            ? "today"
            : null,
        creation_date: -1,
        deadline_date: null,
      },
      isLoadingSubTasks: false,
      activeIndex: -1,
      activeSubIndex: -1,
      sub_tasks: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
    deleteSelectedItems() {
      return this.$store.state.deleteSelectedItems;
    },
    selectedItems() {
      const items = this.$store.getters.selectedItems;

      if (!items.length) {
        this.selectAll = false;
      }

      return items;
    },
    id: {
      get: function () {
        let user = this.getUserRole();
        return user._id;
      },
    },
    addTask() {
      return this.$store.state.actions.addTask;
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
    this.$store.commit("deactivateAction", "addTask");
    this.fetchData();
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    afterDelete() {
      this.$store.commit("clearSelectedItems");
      this.fetchData();
    },
    selectAllItems() {
      this.$store.commit("selectAllItems", {
        ids: this.dataset.map((item) => item._id),
        selectAll: this.selectAll,
      });
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await this.getDataFromPage(
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
    toggleDelete(deletedItem) {
      this.deleteMany = false;
      this.deletedItem = deletedItem;
      this.$modal.show("deleteTask");
    },
    toggleDeleteAll() {
      this.deleteMany = true;
      this.$modal.show("deleteTask");
    },
    toggleSubDelete(deletedItem) {
      this.deletedItem = deletedItem;
      this.$modal.show("deleteSubTask");
    },
    toggleEdit(item) {
      this.infoSubItem = {};

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
    toggleInfo(item) {
      this.activeIndex = -1;
      this.infoSubItem = {};
      this.editedItem = {};

      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleSubInfo(item) {
      this.activeSubIndex = -1;
      this.editedItem = {};

      if (this.infoSubItem._id === item._id) {
        this.infoSubItem = {};
      } else {
        this.infoSubItem = item;
      }
    },
    addToTasks(task) {
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
    removeFromSubTask(item) {
      this.sub_tasks = this.sub_tasks.filter((task) => task._id !== item._id);
    },
    removeFromTask(task) {
      this.$modal.hide("delete");
      this.activeIndex = -1;
      this.activeSubIndex = -1;
      this.deletedItem = task;
      let index = this.dataset.findIndex((item) => item._id === task._id);
      setTimeout(() => {
        let dataset = this.dataset;
        dataset.splice(index, 1);
        this.dataset = dataset;

        if (this.dataset.length < 1) {
          location.reload();
        }
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
      this.activeSubIndex = -1;
      this.$refs.filters.filterOptions = {};
      this.$refs.filters.activeIndex = 0;
      this.filtersOptions = {};
    },
    getSubTasks(id, index) {
      this.infoItem = {};
      this.infoSubItem = {};
      this.editedItem = {};

      if ((index || index === 0) && this.activeIndex === index) {
        this.activeIndex = -1;
        this.activeSubIndex = -1;
        return;
      }

      this.isLoadingSubTasks = true;
      if (index || index === 0) {
        this.activeIndex = index;
      }

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
    onTaskRemove() {
      this.changeStatus(false);
      axios({
        url: "/tasks/delete/",
        data: {
          taskId: this.deletedItem._id,
        },
        method: "DELETE",
      })
        .then(async (res) => {
          let result = await res;
          this.$emit("removeFromTask", result.data.task);
          this.$toast.success("Задача успешно удалена!");
          this.$emit("toggleOpen");
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
  },
  watch: {
    deleteSelectedItems(value) {
      if (value) {
        this.toggleDeleteAll();
      }
    },
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
.tasks-page {
  .list__columns {
    grid-template-columns: 50px 140px 160px 320px 180px 130px 130px 1fr;
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
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 50px 180px 260px 432px 170px 170px 300px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 50px 180px 219px 400px 200px 200px 200px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 50px 180px 200px 400px 150px 150px 150px 1fr;
    }
  }

  .page__right--fluid .sub-tasks .list__columns {
    grid-template-columns: 130px 180px 160px 370px 160px 180px 50px 180px 1fr !important;
  }
  .page__right--full .sub-tasks .list__columns {
    grid-template-columns: 130px 180px 169px 250px 180px 180px 50px 130px 1fr !important;
  }
  .page__right--middle .sub-tasks .list__columns {
    grid-template-columns: 130px 140px 130px 290px 120px 120px 50px 140px 1fr !important;
  }

  .sub-tasks {
    .list__columns {
      .list__column:first-child {
        padding-left: 100px;
      }
      .list__column:last-child {
        padding-right: 100px;
      }
      grid-template-columns: 130px 120px 120px 270px 120px 120px 50px 120px 1fr !important;
    }
    .table__actions {
      justify-content: left !important;
    }
  }
}
</style>
