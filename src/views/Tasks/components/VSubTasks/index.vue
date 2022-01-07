<template>
  <div class="list__subtasks subtasks">
    <div class="subtasks__title text--blue">
      {{ $t("pages.tasks.taskSubtasks") }}
    </div>
    <div class="subtasks__item">1</div>

    <div class="subtasks__item">1</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.subtasks {
  &__title {
    font-size: 16px;
    font-weight: 700;
    padding: 10px;
  }
  &__item {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

    & + * {
      margin-top: 10px;
    }
  }
}
</style>
