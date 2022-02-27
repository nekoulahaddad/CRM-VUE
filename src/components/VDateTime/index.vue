<template>
  <div class="datetime">
    <div class="datetime__top">{{ time }}</div>
    <div class="datetime__bottom">{{ new Date().toLocaleDateString() }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      time: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    getCurrentTime() {
      this.time = Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "numeric",
      }).format();
    },
  },
  created() {
    this.getCurrentTime();
    this.interval = setInterval(this.getCurrentTime, 1000);
  },
};
</script>

<style lang="scss">
.datetime {
  margin-left: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 12px;
  width: 80px;
}
</style>
