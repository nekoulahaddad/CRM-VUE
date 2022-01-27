<template>
  <div class="calendar-events">
    <div class="calendar-events__inner">
      <div v-if="!items.length">Событий не найдено</div>
      <vue-scroll v-else>
        <div
          class="calendar-events__item item"
          v-for="event in items"
          :key="event._id"
        >
          <span class="calendar-events__title">{{ event.title }}</span>
          <div class="calendar-events__start-date">
            {{ $moment(event.startDate).format("DD/MM/YYYY - HH:II") }} - Дата
            начала
          </div>
          <div class="calendar-events__end-date">
            {{ $moment(event.endDate).format("DD/MM/YYYY - HH:II") }} - Дата
            окончания
          </div>
          <div class="calendar-events__participants participants">
            <div class="item__title">Участники:</div>
            <div class="item__content">
              <div
                class="participants__item"
                v-for="(participant, index) in event.participants"
                :key="index"
              >
                {{ transformFIO(participant._id) }}
              </div>
            </div>
          </div>
          <div class="calendar-events__desc">
            <div class="item__title">Описание:</div>
            <div class="item__content">{{ event.description }}</div>
          </div>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    events: {
      type: Array,
      required: true,
    },
    clickedDay: Object,
  },
  data() {
    return {
      items: [],
    };
  },
  watch: {
    clickedDay(e) {
      this.filterEvents(e);
    },
    events() {
      this.filterEvents();
    },
  },
  methods: {
    filterEvents(e = "") {
      this.items = [];
      const currentDate = this.$moment(this.clickedDay?.id || "");

      this.events.map((event) => {
        const compareDate = this.$moment(event.startDate);

        if (currentDate.startOf("day").isSame(compareDate.startOf("day"))) {
          this.items.push(event);
        }
      });
    },
  },
  mounted() {
    const body = document.querySelector("body");
    const events = document.querySelector(".calendar-events");

    events.onmouseover = function () {
      body.style.overflow = "hidden";
    };

    events.onmouseout = function () {
      body.style.overflow = "auto";
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables.scss";

.calendar-events {
  &__inner {
    padding-left: 16px;
    padding-right: 10px;
    height: 450px;
  }

  &__start-date,
  &__end-date {
    color: #a1a1aa;
    font-size: 11px;
    position: relative;
    padding-left: 20px;

    &:before {
      content: "";
      display: block;
      width: 12px;
      height: 12px;
      background-color: #3b82f6;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &__title {
    background-color: $color-red;
    padding: 6px;
    color: $color-white;
    border-radius: 6px;
    font-weight: 500;
    display: inline-block;
    margin-bottom: 10px;
  }

  &__item {
    &:hover {
      box-shadow: none;
    }
  }

  &__item > * + * {
    margin-top: 13px;
  }

  .item {
    padding-bottom: 16px;
    position: relative;
    margin-right: 12px;

    & + * {
      margin-top: 16px;
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      border-radius: $border-radius;
      background-color: $color-gray-secondary;
    }

    &__title {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 5px;
    }
  }
}
</style>
