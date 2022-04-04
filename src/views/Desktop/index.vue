<template>
  <div class="page desktop-page">
    <!-- Модальное окно для добавления мероприятия -->
    <v-add-event-modal @updateEvents="updateEvents" />

    <!-- Модальное окно для добавления задачи -->
    <v-add-task-modal :departments="departments" @afterAddTask="afterAddTask" />

    <!-- Модальное окно для просмотра задачи -->
    <v-edit-task-modal
      :status="status"
      :task="editedItem"
      :deletedSubTask="deletedSubTask"
      @toggleDelete="toggleDelete"
      @toggleSubDelete="toggleSubDelete"
      @changeTaskStatus="changeTaskStatus"
    />

    <!-- Модальное окно для удаления задачи -->
    <v-delete-task :deletedItem="deletedItem" @afterDelete="afterDelete" />

    <!-- Модальное окно для удаления подзадачи -->
    <v-delete-sub-task
      :deletedItem="deletedItem"
      @afterSubDelete="afterSubDelete"
    />

    <v-page-header
      icon="desktop_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />

    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="desktop" v-if="showFilter" />
        <div class="desktop-calendar">
          <div class="add-new-event">
            <a
              href=""
              @click.prevent="$modal.show('addEvent')"
              class="add-new-event__link"
            >
              <img src="@/assets/icons/plus.svg" alt="" />
            </a>
          </div>

          <vc-calendar @dayclick="dayClicked" :attributes="attrs" />
          <v-calendar-events :clickedDay="clickedDay" :events="events" />
        </div>
      </div>

      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <div class="tasks">
          <div class="tasks__title">Доска поставленных задач:</div>
          <div class="tasks__lists">
            <v-spinner v-if="!isLoading" />
            <div
              v-else
              class="tasks__list list"
              v-for="(items, status) in dataset"
            >
              <div class="list__title text">
                {{ statuses[status].title }}: {{ items.count }}
              </div>
              <vue-scroll @handle-scroll="handleScroll($event, status)">
                <div class="list__items">
                  <draggable
                    :list="items.tasks"
                    group="tasks"
                    :animation="200"
                    @change="afterAdd($event, status)"
                  >
                    <div
                      class="list__item"
                      v-for="(item, index) in items.tasks"
                      :key="index"
                    >
                      <a
                        href=""
                        class="list__content text--bold-700"
                        @click.prevent="editTask(item, status)"
                      >
                        {{ item.title }}
                      </a>

                      <!-- Исполнитель -->
                      <div class="list__executor" v-if="item.executor">
                        <div class="list__opacity">
                          <span>
                            <img
                              src="@/assets/icons/employee.svg"
                              width="15px"
                              height="15px"
                              alt=""
                            />
                          </span>
                          <span>Исполнитель:</span>
                        </div>
                        <div
                          class="text text--red text--bold-700"
                          v-if="item.executor.surname.length === 1"
                        >
                          {{ item.executor.surname[0] }}
                        </div>
                        <span class="text text--red text--bold-700" v-else>
                          {{ item.executor.department[0].title }}
                        </span>
                      </div>

                      <!-- Дата создания -->
                      <div class="list__date">
                        <div class="list__opacity">
                          <span
                            ><img
                              src="@/assets/icons/calendar.svg"
                              alt=""
                              width="15px"
                              height="15px"
                            />
                          </span>
                          <span>Дата создания:</span>
                        </div>
                        <div class="text text--red text--bold-700">
                          {{ transformDate(item.creation_date) }}
                        </div>
                      </div>

                      <div
                        class="list__actions"
                        v-if="role === 'superadmin' || role === 'director'"
                      >
                        <img
                          alt=""
                          src="@/assets/icons/dots_icon.svg"
                          @click="toggleContextMenu(item)"
                        />
                      </div>

                      <!-- Контекстное меню -->
                      <v-context-menu
                        :item="item"
                        type="assigned"
                        :status="status"
                        @toggleDelete="toggleDelete"
                        v-if="showContextMenu._id === item._id"
                      />
                    </div>
                  </draggable>
                  <v-spinner
                    class="list__spinner"
                    v-if="!statuses[status].canScroll"
                  />
                </div>
              </vue-scroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VFilter from "@/components/VFilter";
import VAddEventModal from "@/views/Calendar/components/VAddEventModal";
import VAddTaskModal from "./components/VAddTaskModal";
import VDeleteTask from "./components/VDeleteTask";
import VDeleteSubTask from "./components/VDeleteSubTask";
import VCalendarEvents from "./components/VCalendarEvents";
import VEditTaskModal from "./components/VEditTaskModal";
import dataMixins from "@/mixins/data";
import draggable from "vuedraggable";
import VContextMenu from "./components/VContextMenu";
import axios from "@/api/axios";
import { mapGetters } from "vuex";

export default {
  mixins: [dataMixins],
  components: {
    draggable,
    VContextMenu,
    VEditTaskModal,
    VPageHeader,
    VAddTaskModal,
    VCalendarEvents,
    VAddEventModal,
    VSpinner,
    VFilter,
    VDeleteTask,
    VDeleteSubTask,
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
    addDbTask() {
      return this.$store.state.actions.addDbTask;
    },
    id: {
      get: function () {
        let user = this.getUserRole();
        return user._id;
      },
    },
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  data() {
    return {
      showFilter: false,
      deletedSubTask: null,
      clickedDay: null,
      skip: {
        accepted: 0,
        assigned: 0,
        completed: 0,
        tested: 0,
      },
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
        region: null,
        executor: null,
        initiator: null,
      },
      dataset: {
        accepted: {},
        assigned: {},
        completed: {},
        tested: {},
      },
      editedItem: {},
      deletedItem: {},
      departments: [],
      events: [],
      status: "",
      isLoading: false,
      showContextMenu: {},
      type: null,
      attrs: [
        {
          id: "today",
          highlight: {
            style: {
              backgroundColor: "#db1f35",
            },
          },
          dates: new Date(),
        },
      ],
      statuses: {
        accepted: {
          title: "В работе",
          skip: 0,
          canScroll: true,
        },
        assigned: {
          title: "К выполнению",
          skip: 0,
          canScroll: true,
        },
        completed: {
          title: "Выполнено",
          skip: 0,
          canScroll: true,
        },
        tested: {
          title: "На проверке",
          skip: 0,
          canScroll: true,
        },
      },
    };
  },
  watch: {
    addDbTask() {
      if (this.addDbTask) {
        this.$modal.show("addTask");
      }
    },
    filtersOptions: {
      handler: function () {
        this.fetchData({
          status: ["accepted", "assigned", "completed", "tested"],
          skip: 0,
        });
      },
      deep: true,
    },
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async afterAddTask() {
      try {
        const { data } = await this.getDataFromPage(`/tasks/desktop`, {
          status: "assigned",
          limit: 1,
          executor: this.role === "superadmin" ? null : this.id,
        });
        this.dataset["assigned"].tasks.unshift(data.assigned.tasks[0]);
      } catch (e) {}
    },
    dayClicked(e) {
      this.clickedDay = e;
    },
    async handleScroll({ process }, status) {
      const { canScroll } = this.statuses[status];

      if (
        process === 1 &&
        canScroll &&
        this.dataset[status].tasks.length !== this.dataset[status].count
      ) {
        try {
          this.statuses[status].canScroll = false;
          this.statuses[status].skip += 15;

          const { data } = await this.getDataFromPage(`/tasks/desktop`, {
            status: [status],
            skip: this.statuses[status].skip,
            executor: this.role === "superadmin" ? null : this.id,
          });

          this.dataset[status].tasks.push(...data[status].tasks);
          this.statuses[status].canScroll = true;
        } catch (e) {
        } finally {
        }
      }
    },
    afterSubDelete(id) {
      this.deletedSubTask = id;
      this.$modal.hide("deleteSubTask");
    },
    async afterDelete() {
      this.dataset[this.status].tasks = this.dataset[this.status].tasks.filter(
        (item) => item._id !== this.deletedItem._id
      );
      this.dataset[this.status].count--;

      if (this.dataset[this.status].count < 15) {
        try {
          const { data } = await this.getDataFromPage(`/tasks/desktop`, {
            status: [this.status],
            executor: this.role === "superadmin" ? null : this.id,
          });

          this.dataset[status].tasks.push(...data[status].tasks);
        } catch (e) {
        } finally {
        }
      }

      this.status = null;
      this.deletedItem = {};
      this.$modal.hide("deleteTask");
    },
    async fetchData({ status, skip = 0 }) {
      try {
        let executor = null;

        if (this.role === "superadmin") {
          executor = this.filtersOptions.executor;
        } else {
          executor = this.id;
        }

        const { data } = await this.getDataFromPage(`/tasks/desktop`, {
          status,
          skip,
          executor,
          region: this.filtersOptions.region,
          initiator: this.filtersOptions.initiator,
        });
        this.isLoading = true;
        this.dataset = data;
      } catch (e) {
        this.isLoading = true;
      }
    },
    toggleDelete(item, status) {
      this.deletedItem = item;
      this.status = status;
      this.$modal.show("deleteTask");
    },
    toggleSubDelete(item, type, status) {
      this.deletedItem = item;
      this.status = status;
      this.$modal.show("deleteSubTask");
    },
    afterAdd(e, newStatus) {
      if (e.added) {
        const task = e.added.element;
        this.changeTaskStatus(task, newStatus, task.status.value);
      }
    },
    async fetchCounter() {
      try {
        const { data } = await this.getDataFromPage(`/tasks/desktop`, {
          status: ["accepted", "assigned", "completed", "tested"],
          executor: this.role === "superadmin" ? null : this.id,
        });

        for (let status in data) {
          this.dataset[status].count = data[status].count;
          this.dataset[status].tasks = data[status].tasks;
        }
      } catch (e) {}
    },
    toggleContextMenu(item) {
      if (this.showContextMenu._id === item._id) {
        this.showContextMenu = {};
      } else {
        this.showContextMenu = item;
      }
    },
    editTask(item, status) {
      this.editedItem = item;
      this.status = status;
      this.$modal.show("editTask");
      this.showContextMenu = {};
    },
    changeTaskStatus(task, newStatus, status) {
      let taskData = new FormData();
      taskData.append("taskId", task._id);
      taskData.append("statusValue", newStatus);

      axios({
        url: "/tasks/status/",
        data: taskData,
        method: "POST",
      }).then(async (res) => {
        this.fetchCounter();

        this.$toast.success("Статус задачи изменен!");
        this.$modal.hide("editTask");

        this.dataset[status].tasks = this.dataset[status].tasks.filter(
          (t) => t._id !== task._id
        );

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
      });
    },
    getData(url) {
      let result = axios({
        url: `${url}`,
        method: "GET",
      }).then(async (res) => {
        let result = await res;
        return result;
      });
      return result;
    },
    async updateEvents() {
      let result = await this.getData("/events/get");
      let res = await result;
      for (let i = 0; i < res.data.length; i++) {
        let event = res.data[i];
        event.startDate = new Date(this.$moment(event.startDate));
        event.endDate = new Date(this.$moment(event.endDate));
        res.data[i] = event;
      }
      this.events = res.data;
    },
  },
  mounted() {
    this.$store.commit("deactivateAction", "addDbTask");
    this.fetchData({
      status: ["accepted", "assigned", "completed", "tested"],
      skip: 0,
    });
    this.updateEvents();

    axios({
      url: "/user/getdepartments",
    }).then(async (res) => {
      let result = await res;
      let departments = result.data.departments;
      departments.unshift({
        title: "Все отделы",
        value: "all",
      });
      this.departments = departments;
    });

    const body = document.querySelector("body");
    const lists = document.querySelectorAll(".list__items");

    lists.forEach((list) => {
      list.onmouseover = function () {
        body.style.overflow = "hidden";
      };
    });

    lists.forEach((list) => {
      list.onmouseout = function () {
        body.style.overflow = "auto";
      };
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.desktop-page {
  .page {
    &__left {
      width: 267px;
    }

    &__right {
      padding-left: 20px;
    }
  }

  .tasks {
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
    padding: 10px 10px 0;

    &__title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    &__lists {
      display: flex;

      .spinner {
        margin-bottom: 10px;
      }
    }

    &__list {
      background-color: $color-gray-secondary;
      border-radius: $border-radius;
      padding: 10px 1px 10px 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      height: 900px;
      flex: 1;
      width: 315px;

      &:nth-child(1) .list__title {
        color: $color-black;
      }
      &:nth-child(2) .list__title {
        color: $color-blue;
      }
      &:nth-child(3) .list__title {
        color: $color-red;
      }
      &:nth-child(4) .list__title {
        color: $color-green;
      }

      & + * {
        margin-left: 10px;
      }
    }
  }

  .spinner {
    margin-top: 15px;
  }

  .list {
    display: flex !important;
    flex-direction: column;

    &__spinner {
      text-align: center;
    }

    &__item {
      background-color: $color-white;
      border-radius: $border-radius;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
      width: 291px;
      padding: 10px;
      position: relative;

      & + * {
        margin-top: 10px;
      }
    }

    &__title {
      height: auto;
      line-height: normal;
      margin-left: 0;
    }

    &__actions {
      align-items: center;
      display: flex;
      justify-content: end;

      img {
        cursor: pointer;
      }

      img + img {
        margin-left: 10px;
      }
    }
  }

  .__bar-wrap-is-vertical {
    background-color: $color-white;
  }

  .list__items {
    min-width: 219px;
  }
  .list__title {
    height: 20px;
  }

  .desktop-calendar {
    background-color: $color-white;
    border-radius: $border-radius;
    width: 100%;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
  }

  .vc-container {
    border: none;
  }
  .vc-pane-container {
    width: 267px;
  }
  .vc-arrow {
    display: none;
  }
  .vc-header {
    justify-content: start;
  }
  .vc-title {
    color: $color-red;
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 20px;
    position: relative;

    &:first-letter {
      text-transform: uppercase;
    }
  }

  .list__content {
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .list__date {
    font-size: 12px;
    margin-top: 5px;
    display: flex;
  }
  .list__executor {
    font-size: 12px;
    margin-top: 10px;
    display: flex;
  }
  .list__opacity {
    opacity: 0.5;
    display: flex;

    span {
      margin-right: 8px;
    }
  }

  .add-new-event {
    padding-top: 10px;
    padding-left: 16px;
    padding-bottom: 16px;

    &__link {
      width: 32px;
      height: 28px;
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $color-red;
    }
  }
  .vc-highlights + .vc-focusable {
    color: $color-white;
  }
  .sortable-ghost {
    opacity: 0.1;
    background-color: $color-red;

    .list__content {
      color: $color-white;
    }
  }

  .filter {
    margin-bottom: 20px;
  }
  .page__right {
    .tasks {
      width: 1307px;
    }
  }

  .page__right--middle,
  .page__right--fluid {
    width: 1441px;

    .tasks {
      width: 1421px;
    }
  }
  .page__right--full {
    .tasks {
      width: 1307px;
    }
  }
}
</style>
