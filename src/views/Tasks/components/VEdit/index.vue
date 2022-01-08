<template>
  <div class="list__edit edit">
    <div class="edit__inner">
      <div class="edit__title text--blue">{{ $t("pages.tasks.taskEdit") }}</div>
      <div class="filter__group group">
        <div class="group__title">Наименоване задачи:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            v-model="task.title"
            placeholder="Введите название задачи..."
          />
        </div>
      </div>
      <div class="filter__group group">
        <div class="group__title">Описание задачи:</div>
        <div class="group__content">
          <textarea
            type="text"
            class="form-textarea"
            v-model="task.description"
            placeholder="Введите описание задачи..."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.edit {
  &__inner {
    padding: 10px;
  }

  &__title {
    font-weight: 700;
    margin-bottom: 10px;
  }
  .group__title {
    font-size: 12px;
  }

  .form-control {
    font-weight: 500;

    &::placeholder {
      font-weight: 500;
    }
  }
}
</style>
