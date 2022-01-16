<template>
  <div class="chart">
    <div class="chart__inner">
      <div class="chart__title">Проданное количество товаров за декабрь:</div>
      <VLineChart
        :width="0"
        :height="300"
        :labels="dataset.labels"
        :datasets="dataset.datasets"
        :options="options"
      />
    </div>
  </div>
</template>
<script>
import VLineChart from "@/components/VLineChart";

export default {
  name: "Sales",
  components: {
    VLineChart,
  },
  props: {
    sales: {
      type: Object,
      default: () => {},
    },
    ordersForMonth: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      title: "Проданное количество товаров: ",
      info: [
        {
          count: this.sales.today,
          title: "Сегодня",
        },
        {
          count: this.sales.yesterday,
          title: "Вчера",
        },
        {
          count: this.sales.week,
          title: "Неделя",
        },
        {
          count: this.sales.month,
          title: "Месяц",
        },
      ],
      dataset: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            },
          },
        },
      },
    };
  },
  created() {
    let labels = Array.apply(null, { length: 31 });
    let data = Array.apply(null, { length: 31 });
    for (let i = 0; i < data.length; i++) {
      let index = this.ordersForMonth.findIndex((item) => item.day === i + 1);
      labels[i] = `    День ${i + 1 < 10 ? ` ${i + 1}` : i + 1}`;
      data[i] = {
        x: i + 1,
        y: index > -1 ? this.ordersForMonth[index].count : 0,
      };
    }
    this.dataset = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: "rgba(196, 24, 60, .8)",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.chart {
  background-color: $color-white;
  width: 924px;
  box-shadow: 0 3.5px 5.5px rgba(0, 0, 0, 0.02);
  margin-top: 7px;
  margin-left: 10px;
  border-radius: $border-radius;
  flex: 1;

  &__inner {
    width: 100%;
    padding: 28px 22.5px 28px 21px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
