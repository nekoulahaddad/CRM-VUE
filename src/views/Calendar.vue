<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/calendar_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Календарь</h1>
    </div>
    <div class="page__body">
      <calendar-view :events="events" />
    </div>
  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";

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
