<template>
  <div class="page calendar-page">
    <!-- Модальное окно для добавления события -->
    <v-add-event-modal @updateEvents="updateEvents" />

    <!-- Модальное окно со списком событий -->
    <v-event-list :events="dayEvents" />

    <v-edit-event-modal
      :userId="userId"
      :editedItem="editedItem"
      @updateEvents="updateEvents"
    />
    <v-page-header
      title="Календарь"
      icon="calendar_title"
      :filterToggle="false"
    />
    <div class="page__body d-flex">
      <div class="page__left">
        <div class="calendar-container">
          <div class="add-new-event">
            <a
              href=""
              @click.prevent="$modal.show('addEvent')"
              class="add-new-event__link"
            >
              <img src="@/assets/icons/plus.svg" alt="" />
            </a>
          </div>
          <vc-calendar @dayclick="onDayClick" :attributes="attributes" />
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
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import VPageHeader from "@/components/VPageHeader";
import VCalendar from "./components/VCalendar";
import VCalendarEvents from "./components/VCalendarEvents";
import VEventList from "./components/VEventList";
import VAddEventModal from "./components/VAddEventModal";
import VEditEventModal from "./components/VEditEventModal";
import "vue-simple-calendar/static/css/default.css";

export default {
  data() {
    return {
      dayEvents: [],
      isLoading: false,
      showDate: new Date(),
      day: false,
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
      selectionStart: null,
      selectionEnd: null,
      events: [],
      clickedDay: null,
      edit: false,
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
    CalendarViewHeader,
    VPageHeader,
    VCalendarEvents,
    VEditEventModal,
    VAddEventModal,
    VCalendar,
    VEventList,
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
    setShowDate(d) {
      this.showDate = d;
    },
    onDayClick(day) {
      console.log(day);
      this.clickedDay = day;
      this.days = [];
      this.days.push({
        id: day.id,
        date: day.date,
      });
    },
    showEvent(event) {
      this.editedItem = event;
      this.$modal.show("editEvent");
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
      this.isLoading = false;
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
