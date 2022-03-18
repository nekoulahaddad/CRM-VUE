<template>
  <div class="revs">
    <div class="revs__inner">
      <div class="revs__title">{{ title }}</div>
      <v-spinner v-if="!Object.keys(rev).length" />
      <div v-else class="revs__items">
        <div class="revs__item rev" v-for="item of info">
          <div class="rev__header rev--row">
            <div class="rev__left">
              <img src="@/assets/icons/bell.svg" alt="" />
            </div>
            <div class="rev__right">
              <div class="rev__title">
                {{ item.title }}
              </div>
            </div>
          </div>
          <div class="rev__body rev--row">
            <div class="rev__left">
              <div class="rev__line"></div>
            </div>
            <div class="rev__right">
              <span
                class="rev-number"
                :class="{
                  'rev-number--negative': item.status === 'negative',
                  'rev-number--positive': item.status === 'positive',
                }"
              >
                {{ vueNumberFormat(item.count) }}
              </span>

              <img
                v-if="item.status === 'negative'"
                class="rev__status"
                src="@/assets/icons/negative.svg"
                alt=""
              />
              <img
                v-else-if="item.status === 'positive'"
                class="rev__status"
                src="@/assets/icons/positive.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VSpinner from "@/components/VSpinner";

export default {
  components: { VSpinner },
  props: {
    rev: {
      type: Object,
    },
    isLoading: Boolean,
  },
  data() {
    return {
      title: this.$t("revs"),
      text: "разница расчитывается относительно аналогичного периода в прошлом",
      info: [],
    };
  },
  watch: {
    rev() {
      this.info = [];
      let { rev } = this;
      rev.today = +rev.today.split(".")[0];
      rev.yesterday = +rev.yesterday.split(".")[0];
      rev.week = +rev.week.split(".")[0];
      rev.weekAgo = +rev.weekAgo.split(".")[0];
      rev.month = +rev.month.split(".")[0];
      rev.monthAgo = +rev.monthAgo.split(".")[0];
      rev.year = +rev.year.split(".")[0];
      rev.yearAgo = +rev.yearAgo.split(".")[0];
      rev.period = +rev.period.split(".")[0];
      if (rev.period) {
        let period = {
          title: "За период",
          count: rev.period,
          status: "middle",
        };
        this.info.push(period);
      }
      let today = {
        title: "Сегодня",
        count: rev.today,
      };
      if (rev.today > rev.yesterday) {
        today.status = "positive";
      } else if (rev.today === rev.yesterday) {
        today.status = "middle";
      } else {
        today.status = "negative";
      }
      this.info.push(today);
      let week = {
        title: "За неделю",
        count: rev.week,
      };
      if (rev.week > rev.weekAgo) {
        week.status = "positive";
      } else if (rev.week === rev.weekAgo) {
        week.status = "middle";
      } else {
        week.status = "negative";
      }
      this.info.push(week);
      let month = {
        title: "За месяц",
        count: rev.month,
      };
      if (rev.month > rev.monthAgo) {
        month.status = "positive";
      } else if (rev.month === rev.monthAgo) {
        month.status = "middle";
      } else {
        month.status = "negative";
      }
      this.info.push(month);
      let year = {
        title: "За год",
        count: rev.year,
      };
      if (rev.year > rev.yearAgo) {
        year.status = "positive";
      } else if (rev.year === rev.yearAgo) {
        year.status = "middle";
      } else {
        year.status = "negative";
      }
      this.info.push(year);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.revs {
  width: 267px;
  min-height: 254px;
  background-color: $color-white;
  border-radius: $border-radius;
  box-shadow: 0 3.5px 5.5px rgba(0, 0, 0, 0.02);
  margin-top: 10px;

  &__inner {
    padding: 10px 20px 5px 20px;
  }

  .rev-number {
    font-weight: 600;
    &--positive {
      color: $color-green;
    }
    &--negative {
      color: $color-red;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .rev {
    & + * {
      margin-top: 10px;
    }

    &--row {
      display: flex;
      align-items: center;
    }

    &__left {
      margin-right: 20px;
    }

    &__right {
      position: relative;
    }

    &__title {
      font-weight: 600;
    }

    &__header {
      margin-bottom: 3px;
    }

    &__line {
      width: 2px;
      background-color: #e2e8f0;
      height: 19px;
      margin-left: 7px;
      margin-right: 8px;
      border-radius: $border-radius;
    }

    &__status {
      top: 50%;
      right: -15px;
      bottom: 0;
      position: absolute;
      transform: translateY(-50%);
    }
  }
}
</style>
