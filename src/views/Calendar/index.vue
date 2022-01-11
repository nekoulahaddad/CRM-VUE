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
        <template #header="{ headerProps }">
          <calendar-view-header
            :header-props="headerProps"
            @input="setShowDate"
          />
        </template>
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
