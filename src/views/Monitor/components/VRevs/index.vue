<template>
  <div>
    <div>{{ title }}</div>
    <div v-for="item of info">
      {{ item.title }} {{ vueNumberFormat(item.count) }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rev: {
      type: Object,
    },
  },
  data() {
    return {
      title: this.$t("revs"),
      text: "разница расчитывается относительно аналогичного периода в прошлом",
      info: [],
    };
  },
  created() {
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
};
</script>
