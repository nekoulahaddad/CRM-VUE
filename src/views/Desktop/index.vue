<template>
  <div class="page desktop-page">
    <v-add-task-modal :departments="departments" />
    <v-edit-task-modal :task="{}" />
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
            <!-- К выполнению -->
            <div class="tasks__list list">
              <div class="list__title text--red text">К выполнению: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <a href="" class="list__content" @click.prevent="editTask">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </a>
                    <div class="list__actions">
                      <img src="@/assets/icons/arrow_twin.svg" alt="" />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>

                    <!-- Контекстное меню -->
                    <v-context-menu v-if="showContextMenu" />
                  </div>
                </div>
              </vue-scroll>
            </div>
            <!-- В работе -->
            <div class="tasks__list list">
              <div class="list__title text text--blue-delos">В работе: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <div class="list__content">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </div>
                    <div class="list__actions">
                      <img src="@/assets/icons/arrow_twin.svg" alt="" />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </vue-scroll>
            </div>
            <!-- На проверке -->
            <div class="tasks__list list">
              <div class="list__title text text--green">На проверке: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <div class="list__content">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </div>
                    <div class="list__actions">
                      <img src="@/assets/icons/arrow_twin.svg" alt="" />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </vue-scroll>
            </div>
            <!-- Выполнено -->
            <div class="tasks__list list">
              <div class="list__title text text--blue">Выполнено: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <div class="list__content">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </div>
                    <div class="list__actions">
                      <img src="@/assets/icons/arrow_twin.svg" alt="" />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </vue-scroll>
            </div>
          </div>
        </div>
      </div>
      <div class="page__right">
        <div class="desktop-calendar">
          <div class="add-new-event">
            <a href="" @click.prevent="" class="add-new-event__link">
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
import VAddTaskModal from "./components/VAddTaskModal";
import VCalendarEvents from "./components/VCalendarEvents";
import VEditTaskModal from "../../components/VModals/EditTaskModal";
import getDataFromPage from "../../api/getDataFromPage";
import VContextMenu from "./components/VContextMenu";
import axios from "@/api/axios";

export default {
  components: {
    VContextMenu,
    VEditTaskModal,
    VPageHeader,
    VAddTaskModal,
    VCalendarEvents,
  },
  data() {
    return {
      clickedDay: null,
      dataset: [],
      departments: [],
      events: [],
      showContextMenu: false,
      attrs: [
        {
          key: "today",
          highlight: {
            style: {
              backgroundColor: "#db1f35",
            },
          },
          dates: new Date(),
        },
        {
          dot: {
            style: {
              backgroundColor: "red",
            },
          },
        },
      ],
    };
  },
  methods: {
    dayClicked(e) {
      this.clickedDay = e;
    },
    async fetchData() {
      try {
        const { data } = await getDataFromPage(`/tasks/get`, {});

        this.dataset = data.tasks;
      } catch (e) {
      } finally {
      }
    },
    editTask() {
      this.$modal.show("editTask");
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
    this.fetchData();
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
      flex: 1;
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
      font-weight: 600;
      margin-bottom: 10px;
    }

    &__lists {
      display: flex;
      padding-left: 10px;
      padding-right: 10px;
    }

    &__list {
      background-color: $color-gray-secondary;
      border-radius: $border-radius;
      padding: 10px 1px 10px 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      width: 328px;

      & + * {
        margin-left: 10px;
      }
    }
  }

  .list {
    &__item {
      background-color: $color-white;
      border-radius: $border-radius;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
      width: 305px;
      padding: 10px;

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

  .desktop-calendar {
    background-color: $color-white;
    border-radius: $border-radius;
    width: 300px;
    height: 100%;
  }

  .vc-container {
    border: none;
  }
  .vc-pane-container {
    width: 300px;
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
}
</style>
