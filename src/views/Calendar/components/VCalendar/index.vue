<template>
  <vc-calendar
    class="custom-calendar max-w-full"
    :masks="masks"
    :attributes="attributes"
    is-expanded
    :trimWeeks="true"
  >
    <template v-slot:day-content="{ day, attributes }">
      <div
        v-if="!isLoading"
        style="display: flex; align-items: center; justify-content: center"
      >
        <v-spinner small />
      </div>
      <div v-else @click="showEventList(attributes)">
        <div class="custom-calendar__date">
          {{ $moment(day.id).format("DD.MM.YYYY") }} г.
        </div>
        <vue-scroll>
          <div style="height: 80px" class="custom-calendar__days">
            <p
              class="custom-calendar__event"
              v-for="attr in attributes"
              :key="attr.key"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </vue-scroll>
      </div>
    </template>
  </vc-calendar>
</template>

<script>
import VSpinner from "@/components/VSpinner";

export default {
  props: {
    events: {
      type: Array,
    },
    role: String,
  },
  data() {
    return {
      attributes: [],
      masks: {
        weekdays: "WWWW",
      },
      isLoading: false,
    };
  },
  components: { VSpinner },
  methods: {
    showEventList(attributes) {
      if (attributes.length) {
        this.$emit("showEventList", attributes);
      } else {
        if (this.role === "superadmin" || this.role === "director") {
          this.$store.commit("toggleAction", {
            key: "addEvent",
          });
          this.$modal.show("addEvent");
        }
      }
    },
  },
  watch: {
    events() {
      this.isLoading = this.events.length > 0;

      this.attributes = this.events.map((event, i) => {
        const day = new Date(event.startDate).getDate();
        const month = new Date(event.startDate).getMonth();
        const year = new Date(event.startDate).getFullYear();

        return {
          key: event._id,
          customData: event,
          dates: new Date(year, month, day),
        };
      });
    },
  },
  mounted() {
    const body = document.querySelector("body");
    const days = document.querySelectorAll(".vc-day");

    days.forEach((day) => {
      day.onmouseover = function () {
        body.style.overflow = "hidden";
      };
      day.onmouseout = function () {
        body.style.overflow = "auto";
      };
    });
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
  max-width: 1307px !important;
  height: 100%;
  border: none;

  .__vuescroll {
    height: 80px !important;
  }

  .vc-day {
    padding: 10px;
    border-right: 2px solid $color-gray-secondary;
    border-bottom: 2px solid $color-gray-secondary;
    overflow: hidden;
    cursor: pointer;

    &:nth-last-child(-n + 7) {
      border-bottom: 0 !important;
    }
    &:nth-child(7n) {
      border-right: 0 !important;
    }
  }
  .is-today {
    background: rgba(219, 31, 53, 0.1) !important;

    .custom-calendar__event {
      background-color: $color-white;
    }
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
    text-transform: capitalize;
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
    border-right: 2px solid $color-gray-secondary;
    border-bottom: 2px solid $color-gray-secondary;
    padding: 10px 0;

    &:first-child {
      border-top-left-radius: $border-radius;
    }
    &:last-child {
      border-top-right-radius: $border-radius;
    }

    &:nth-child(7) {
      border-right: 0;
    }

    &:first-letter {
      text-transform: uppercase;
    }
  }

  .vc-weeks {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: $border-radius;
    margin: 10px;
    padding: 0;
  }

  .vc-arrows-container {
    justify-content: center;
  }
  .vc-arrow {
    position: relative !important;
    border-radius: $border-radius;
    background: rgba(0, 0, 0, 0.3);
    top: 2px;
    width: 30px;
    height: 30px;

    svg path {
      fill: $color-white;
    }

    &.is-left {
      right: 95px !important;
    }
    &.is-right {
      left: 95px !important;
    }
  }
}
</style>
