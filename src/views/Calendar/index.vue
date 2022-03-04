<template>
  <div class="page calendar-page">
    <!-- Модальное окно для добавления события -->
    <v-add-event-modal :userId="userId" @updateEvents="updateEvents" />

    <!-- Модальное окно со списком событий -->
    <v-event-list
      :events="dayEvents"
      :userId="userId"
      :role="role"
      @toggleCopy="toggleCopy"
      @toggleInfo="toggleInfo"
      @toggleEdit="toggleEdit"
      @toggleDelete="toggleDelete"
    />

    <!-- Модальное окно для изменения мероприятия -->
    <v-event-edit-modal
      :editedItem="editedItem"
      @updateAfterEditEvent="updateAfterEditEvent"
      @updateEvents="updateEvents"
    />

    <!-- Модальное окно для удаления мероприятия -->
    <v-event-delete-modal
      :deletedItem="deletedItem"
      @updateEvents="updateEvents"
      @updateAfterDeleteEvent="updateAfterDeleteEvent"
    />

    <!-- Модальное окно для просмотра мероприятия -->
    <v-event-info-modal :infoItem="infoItem" />

    <!-- Модальное окно для копирования мероприятия -->
    <v-event-copy-modal
      :copyItem="copyItem"
      :userId="userId"
      @updateEvents="updateEvents"
    />

    <v-page-header icon="calendar_title" :filterToggle="false" />
    <div class="page__body d-flex">
      <div class="page__left">
        <div class="calendar-container">
          <div class="add-new-event">
            <a
              href=""
              @click.prevent="
                $store.commit('toggleAction', { key: 'addEvent' }),
                  $modal.show('addEvent')
              "
              class="add-new-event__link"
            >
              <img src="@/assets/icons/plus.svg" alt="" />
            </a>
          </div>
          <vc-calendar @dayclick="onDayClick" :attributes="attrs" />
          <v-calendar-events :events="events" :clickedDay="clickedDay" />
        </div>
      </div>

      <div class="page__right">
        <v-calendar
          :events="events"
          @showEvent="showEvent"
          @showEventList="showEventList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { CalendarView } from "vue-simple-calendar";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VCalendar from "./components/VCalendar";
import VCalendarEvents from "./components/VCalendarEvents";
import VEventList from "./components/VEventList";
import VAddEventModal from "./components/VAddEventModal";
import VEventDeleteModal from "./components/VEventDeleteModal";
import VEventEditModal from "./components/VEventEditModal";
import VEventInfoModal from "./components/VEventInfoModal";
import VEventCopyModal from "./components/VEventCopyModal";
import "vue-simple-calendar/static/css/default.css";

export default {
  data() {
    return {
      dayEvents: [],
      isLoading: false,
      showDate: new Date(),
      day: false,
      events: [],
      infoItem: {},
      copyItem: {},
      days: [
        {
          key: "today",
          id: 6,
          highlight: {
            style: {
              backgroundColor: "#db1f35",
            },
          },
          dates: new Date(),
        },
      ],
      deletedItem: {},
      selectionStart: null,
      selectionEnd: null,
      clickedDay: null,
      edit: false,
      eventItem: {},
      editedItem: {},
      event: null,
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
    };
  },
  components: {
    CalendarView,
    VPageHeader,
    VCalendarEvents,
    VAddEventModal,
    VCalendar,
    VEventList,
    VSpinner,
    VEventCopyModal,
    VEventEditModal,
    VEventInfoModal,
    VEventDeleteModal,
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
    dates() {
      return this.days.map((day) => day.date);
    },
    attributes() {
      return this.dates.map((date) => ({
        highlight: {
          style: {
            backgroundColor: "#db1f35",
          },
        },
        dates: date,
      }));
    },
    addEvent() {
      return this.$store.state.actions.addEvent;
    },
  },
  watch: {
    addEvent(value) {
      if (value) {
        this.$modal.show("addEvent");
      }
    },
  },
  methods: {
    updateAfterEditEvent(e) {
      this.dayEvents = this.dayEvents.map((event) => {
        if (event.key === e._id) {
          event.customData.title = e.title;
        }
        return event;
      });
    },
    updateAfterDeleteEvent(key) {
      this.dayEvents = this.dayEvents.filter((event) => event.key !== key);
    },
    setShowDate(d) {
      this.showDate = d;
    },
    onDayClick(day) {
      this.clickedDay = day;
      this.days = [];
      this.days.push({
        id: day.id,
        date: day.date,
      });
    },
    showEvent(event) {
      //this.eventItem = event;
      ///this.$modal.show("editEvent");
    },
    showEventList(events) {
      this.dayEvents = events;
      this.$modal.show("eventList");
    },
    clickItem(date, items) {
      this.selectionStart = new Date(this.$moment(date));
      this.selectionEnd = new Date(this.$moment(date));
      this.days = items;
      if (this.days.length) {
        this.toggleDay();
      }
    },
    dateSelection(date) {
      this.selectionStart = new Date(this.$moment(date[0]));
      this.selectionEnd = new Date(this.$moment(date[1]));
    },
    dateSelectionFinish(date) {
      this.selectionStart = new Date(this.$moment(date[0]).startOf("day"));

      this.selectionEnd = new Date(this.$moment(date[1]).endOf("day"));
      this.toggleDate();
    },
    toggleDate() {
      if (this.dates) {
        this.selectionStart = null;
        this.selectionEnd = null;
      }
      this.dates = !this.dates;
    },
    toggleDay() {
      if (this.day) {
        this.days = null;
      }
      this.day = !this.day;
    },
    toggleInfo(item) {
      this.infoItem = item;
      this.$modal.hide("eventList");
      this.$modal.show("infoEvent");
    },
    toggleCopy(item) {
      this.copyItem = item;
      this.$modal.hide("eventList");
      this.$modal.show("copyEvent");
    },
    toggleEdit(item) {
      this.editedItem = item;
      this.$modal.hide("eventList");
      this.$modal.show("editEvent");
    },
    toggleDelete(item) {
      this.deletedItem = item;
      this.$modal.hide("eventList");
      this.$modal.show("deleteEvent");
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
      this.isLoading = true;
    },
  },
  mounted() {
    this.$store.commit("deactivateAction", "addEvent");
    this.updateEvents();
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.calendar-page {
  .page__body {
    border-radius: $border-radius;
  }
  .page__right {
    width: 1417px;
  }
}
.periodLabel {
  display: none !important;
}
.cv-wrapper {
  border-radius: $border-radius;
}
.cv-day {
  background-color: $color-white !important;
  border-color: $color-gray-secondary;
  padding: 10px;
}
.cv-weeks {
  border: 0;
  min-height: 800px;
}
.cv-header-days {
  border: 0;

  .cv-header-day {
    background-color: $color-white;
    height: 40px;
    border-color: $color-gray-secondary;
  }
}
.cv-header {
  background-color: $color-white !important;
  border: 0;
  height: 50px;
  justify-content: center;

  &-nav {
    display: flex;

    button {
      border: 0;
      height: 30px;
      border-radius: $border-radius;
      min-width: 30px;

      & + button {
        margin-left: 10px;
      }

      &.previousYear,
      &.previousPeriod,
      &.nextPeriod,
      &.nextYear {
        background-color: rgba(0, 0, 0, 0.3);
        color: $color-white !important;
      }
    }

    .currentPeriod {
      background-color: $color-red;
      color: $color-white !important;
      padding-left: 16px;
      padding-right: 16px;
      height: 30px;
    }
  }
}
.cv-item {
  background-color: $color-gray-secondary !important;
  border-radius: $border-radius !important;
  border: 0;
  border-left: 5px solid $color-red !important;
}
.calendar-container {
  background-color: $color-white;
  border-radius: $border-radius;
  width: 263px;
  height: 100%;
  margin-right: 20px;
  margin-left: 4px;

  .vc-container {
    border: none;
  }
  .vc-pane-container {
    width: 100%;
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
  .vc-highlight {
    background-color: $color-red !important;
    opacity: 1 !important;
    z-index: 1 !important;
  }
  .vc-highlights + .vc-focusable {
    color: $color-white;
  }
}
</style>
