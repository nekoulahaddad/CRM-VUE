<template>
  <canvas ref="myChart" :width="width" :height="height"></canvas>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    width: {
      type: Number,
      validator: 0, //value => value > 0
    },
    height: {
      type: Number,
      validator: (value) => value > 0,
    },
    labels: Array,
    datasets: {
      type: Array,
      required: true,
    },
    options: Object,
  },
  mounted() {
    new Chart(this.$refs.myChart, {
      type: "line",
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: this.options,
    });
  },
};
</script>
