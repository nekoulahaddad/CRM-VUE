<template>
  <div class="page desktop-page">
    <!-- Модальное окно для добавления мероприятия -->
    <v-add-event-modal @updateEvents="updateEvents" />

    <!-- Модальное окно для добавления задачи -->
    <v-add-task-modal :departments="departments" />

    <!-- Модальное окно для просмотра задачи -->
    <v-edit-task-modal
      :status="status"
      :task="editedItem"
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
      title="Рабочий стол"
      icon="desktop_title"
      :filterToggle="false"
    />

    <div class="page__body d-flex">
      <div class="page__left">
        <div class="tasks">
          <div class="tasks__title">Доска задач</div>
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
                        class="list__content"
                        @click.prevent="editTask(item, 'assigned')"
                      >
                        {{ item.title }}
                      </a>

                      <!-- Исполнитель -->
                      <div class="list__executor" v-if="item.executor">
                        Исполнитель:
                        <span v-if="item.executor.surname.length === 1">
                          {{ item.executor.surname[0] }}
                        </span>
                        <span v-else>
                          {{ item.executor.department[0].title }}
                        </span>
                      </div>

                      <!-- Дата создания -->
                      <div class="list__date">
                        Дата создания: {{ transformDate(item.creation_date) }}
                      </div>

                      <div class="list__actions">
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
      <div class="page__right">
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
    </div>
  </div>
</template>

<script>
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
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
    VDeleteTask,
    VDeleteSubTask,
  },
  computed: {
    addDbTask() {
      return this.$store.state.actions.addDbTask;
    },
  },
  data() {
    return {
      clickedDay: null,
      skip: {
        accepted: 0,
        assigned: 0,
        completed: 0,
        tested: 0,
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
  },
  methods: {
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
          });

          this.dataset[status].tasks.push(...data[status].tasks);
        } catch (e) {
        } finally {
          this.statuses[status].canScroll = true;
        }
      }
    },
    afterSubDelete() {
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
        const { data } = await this.getDataFromPage(`/tasks/desktop`, {
          status,
          skip,
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
    afterAdd(e, status) {
      if (e.added) {
        const task = e.added.element;
        this.changeTaskStatus(task, status);
      }
    },
    async fetchCounter() {
      try {
        const { data } = await this.getDataFromPage(`/tasks/desktop`, {
          status: ["accepted", "assigned", "completed", "tested"],
        });

        for (let status in data) {
          this.dataset[status].count = data[status].count;
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
      width: 1307px;
    }

    &__right {
      width: 263px;
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
      font-weight: 600;
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
      width: 328px;
      height: 900px;

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
      width: 290px;
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
  }
  .list__title {
    height: 20px;
  }

  .desktop-calendar {
    background-color: $color-white;
    border-radius: $border-radius;
    width: 263px;
    height: 100%;
  }

  .vc-container {
    border: none;
  }
  .vc-pane-container {
    width: 263px;
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
    opacity: 0.5;
    font-size: 12px;
    margin-top: 5px;
  }
  .list__executor {
    opacity: 0.5;
    font-size: 12px;
    margin-top: 10px;
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
}
</style>
