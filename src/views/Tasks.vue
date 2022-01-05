<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/tasks_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Задачи</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="tasks" />
      </div>

      <!-- Контент -->
      <div class="flex-1">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <table class="table">
            <thead class="thead">
              <tr class="thead__top">
                <td colspan="8">
                  <div class="table__title">Задачи</div>
                </td>
              </tr>
              <tr class="thead__bottom">
                <td>№:</td>
                <td>Автор</td>
                <td>Исполнитель:</td>
                <td>Задача:</td>
                <td>Дата создания:</td>
                <td>Дедлайн:</td>
                <td>Статус:</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataset" :key="item.id">
                <td>{{ index + 1 + ($route.params.page - 1) * 15 }}</td>
                <td class="text--blue">{{ transformFIO(item.initiator) }}</td>
                <td>
                  {{
                    item &&
                    item.responsible &&
                    typeof item.responsible._id !== "undefined"
                      ? `Ответственный - ${transformFIO(item.responsible)}`
                      : item &&
                        item.executor &&
                        !Array.isArray(item.executor._id)
                      ? transformFIO(item.executor)
                      : item && item.executor && item.executor._id[0]
                      ? transformFIO({
                          name: item.executor.name[0],
                          surname: item.executor.surname[0],
                          lastname: item.executor.lastname[0],
                        })
                      : transformFIO(userData)
                  }}
                </td>
                <td class="text--blue">
                  <div class="bg bg--blue-light">
                    {{ item.title }}
                  </div>
                </td>
                <td class="text--green">
                  {{ transformDate(item.creation_date) }}
                </td>
                <td class="text--sapphire">
                  {{ transformDate(item.deadline_date) }}
                </td>
                <td
                  v-html="
                    item && item.status
                      ? transformStatus(item.status)
                      : item.status
                  "
                ></td>
                <td>
                  <div class="table__actions">
                    <div class="table__icon">
                      <img
                        v-if="
                          id === item.initiator._id ||
                          id === item.responsible._id ||
                          (item && id === item.executor._id) ||
                          item.executor._id[0]
                        "
                        src="/icons/info_icon.svg"
                        alt=""
                      />
                      <div class="table__hidden-icon" v-else></div>
                    </div>
                    <div class="table__icon">
                      <img
                        v-if="
                          id === item.initiator._id ||
                          id === item.responsible._id
                        "
                        src="/icons/document_icon.svg"
                        alt=""
                      />
                      <div class="table__hidden-icon" v-else></div>
                    </div>
                    <div class="table__icon">
                      <img
                        v-if="id === item.initiator._id"
                        src="/icons/trash_icon.svg"
                        alt=""
                      />
                      <div class="table__hidden-icon" v-else></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <v-pagination :count="count" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
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
  components: { VFilter, VSpinner, VNotFoundQuery, VPagination },
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
      if (!this.infoForm) {
        this.infoItem = item;
      } else {
        setTimeout(() => {
          this.infoItem = {};
        }, 500);
      }
      this.infoForm = !this.infoForm;
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
        url: process.env.VUE_APP_DEVELOP_URL + `/tasks/getsub`,
        data: {
          taskId: id,
          page: 0,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        this.isLoadingSubTasks = false;
        this.sub_tasks = result.data.tasks;
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
