<template>
  <v-modal :adaptive="true" minHeight="400" minWidth="1130" name="addTask">
    <div class="vm--modal__title">
      Поставить задачу
      <img
        @click="$modal.hide('addTask')"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner">
      <div class="vm--modal__subtitle">Новая задача:</div>
      <div class="group">
        <div class="group__title">Наименоване задачи:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="Введите название задачи"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Введите ФИО сотрудника</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="Введите название задачи..."
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Отдел:</div>
        <div class="group__content">
          <select class="form-select" name="department">
            <option v-for="department in departments" :value="department.value">
              {{ department.title }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
export default {
  props: {
    departments: Array,
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.vm--modal {
  &__subtitle {
    font-weight: 700;
    margin-bottom: 10px;
  }

  .form-control {
    width: 689px;
  }

  .form-select {
    width: 401px;
  }

  .group {
    &__title {
      font-size: 12px;
    }
  }

  &__close {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
</style>
