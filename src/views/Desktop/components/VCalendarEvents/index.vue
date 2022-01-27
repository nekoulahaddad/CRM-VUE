<template>
  <div class="calendar-events">
    <div class="calendar-events__inner">
      <vue-scroll>
        <div class="calendar-events__item item" v-for="event in items">
          <span class="calendar-events__title">{{ event.title }}</span>
          <div class="calendar-events__start-date"></div>
          <div class="calendar-events__end-date"></div>
          <div class="calendar-events__users"></div>
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
  },
  data() {
    return {
      items: [],
    };
  },
  watch: {
    events() {
      this.items = [];
      const currentDate = this.$moment();

      this.events.map((event) => {
        const compareDate = this.$moment(event.startDate);

        if (currentDate.startOf("month").isSame(compareDate.startOf("month"))) {
          this.items.push(event);
        }
      });
    },
  },
  mounted() {},
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

  &__title {
    background-color: $color-red;
    padding: 6px;
    color: $color-white;
    border-radius: 6px;
    font-weight: 500;
    margin-bottom: 16px;
    display: inline-block;
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
