<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/monitor_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Дашборд</h1>
    </div>
    <div class="page__body">
      <div class="page__left">
        <v-filter type="monitor" />
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";

export default {
  components: { VFilter },
};
</script>
