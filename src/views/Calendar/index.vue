<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/calendar_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Календарь</h1>
    </div>
    <div class="page__body">
      <calendar-view
        :items="events"
        :show-date="showDate"
        class="theme-default holiday-us-traditional holiday-us-official page__calendar"
        @click-date="clickItem"
        @date-selection="dateSelection"
        @date-selection-finish="dateSelectionFinish"
        :selectionStart="selectionStart"
        :selectionEnd="selectionEnd"
        :startingDayOfWeek="1"
        itemContentHeight="50px"
      >
        <calendar-view-header
          slot="header"
          slot-scope="t"
          :header-props="t.headerProps"
          @input="setShowDate"
        />
      </calendar-view>
    </div>
  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import "vue-simple-calendar/static/css/default.css";

export default {
  data: function () {
    return {
      isLoading: false,
      showDate: new Date(),
      dates: false,
      day: false,
      days: [],
      selectionStart: null,
      selectionEnd: null,
      events: [],
      edit: false,
      editedItem: {},
    };
  },
  components: {
    CalendarView,
    CalendarViewHeader,
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
  methods: {
    setShowDate(d) {
      this.showDate = d;
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
    async updateEvents() {
      let result = await this.getData("/events/get");
      this.isLoading = false;
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
    this.updateEvents();
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.page__body {
  padding: 10px;
  background-color: $color-white;
  border-radius: $border-radius;
}
.periodLabel {
  display: none !important;
}
.cv-wrapper {
  border-radius: $border-radius;
}
.cv-day {
  background-color: $color-white;
  border-color: $color-gray-secondary;
}
.cv-weeks {
  border: 0;
}
.cv-header-days {
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
</style>
