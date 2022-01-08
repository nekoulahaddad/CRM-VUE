<template>
  <div class="list-sub-tasks">
    <div class="list-sub-tasks__title text--blue">
      {{ $t("pages.tasks.taskSubTasks") }}
    </div>
    <div
      v-for="(task, index) in tasks"
      :key="task._id"
      class="list__row list__row--shadow list__row--white"
      :class="{
        'list__row--opened': false,
      }"
    >
      <v-task v-if="false" />
    </div>
  </div>
</template>

<script>
import VTask from "../VTask";

export default {
  props: {
    tasks: {
      type: Array,
      required: true,
    },
  },
  components: { VTask },
};
</script>

<style lang="scss">
.list-sub-tasks {
  &__title {
    font-weight: 700;
    padding: 10px;
  }
}
</style>
