<template>
  <vc-calendar
    class="custom-calendar max-w-full"
    :masks="masks"
    :attributes="attributes"
    disable-page-swipe
    is-expanded
  >
    <template v-slot:day-content="{ day, attributes }">
      <div class="">
        <div class="custom-calendar__date">
          {{ $moment(day.id).format("DD.MM.YYYY") }} г.
        </div>
        <div class="flex-grow overflow-y-auto overflow-x-auto">
          <p
            class="custom-calendar__event"
            @click="showEvent"
            v-for="attr in attributes"
            :key="attr.key"
          >
            {{ attr.customData.title }}
          </p>
        </div>
      </div>
    </template>
  </vc-calendar>
</template>

<script>
export default {
  props: {
    events: {
      type: Array,
    },
  },
  data() {
    return {
      attributes: [],
      masks: {
        weekdays: "WWWW",
      },
    };
  },
  methods: {
    showEvent() {},
  },
  watch: {
    events() {
      this.attributes = this.events.map((event, i) => {
        const day = new Date(event.startDate).getDate();
        const month = new Date(event.startDate).getMonth();
        const year = new Date(event.startDate).getFullYear();

        return {
          key: i,
          customData: {
            title: event.title,
          },
          dates: new Date(year, month, day),
        };
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.page__right {
  flex: none;
  width: 1307px;
}
.custom-calendar {
  max-width: 1307px !important;
  border: none;

  .vc-day {
    padding: 10px;
    border: 1px solid $color-gray-secondary;
    border-bottom: 0;
  }

  .vc-title {
    background-color: $color-red;
    border-radius: $border-radius;
    color: $color-white;
    width: 159px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;

    &:first-letter {
      text-transform: uppercase;
    }
  }

  &__date {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  &__event {
    background-color: $color-gray-secondary;
    border-radius: $border-radius;
    border-left: 5px solid $color-red;
    padding: 7px;
    cursor: pointer;
    font-size: 12px;
    color: $color-black;
    font-weight: 500;

    & + * {
      margin-top: 5px;
    }
  }

  .vc-weekday {
    color: $color-black;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid $color-gray-secondary;
    border-bottom: 0;
    padding: 10px 0;

    &:first-child {
      border-top-left-radius: $border-radius;
    }
    &:last-child {
      border-top-right-radius: $border-radius;
    }

    &:first-letter {
      text-transform: uppercase;
    }
  }
}
</style>
