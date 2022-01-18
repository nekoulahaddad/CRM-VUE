<template>
  <v-modal :adaptive="true" :minWidth="1130" :minHeight="500" name="editTask">
    <div class="vm--modal__title">
      Необходимо обновить CRM систему, выполнив редизайн системы.
      <img class="close-icon" src="@/assets/icons/close_icon.svg" alt="" />
    </div>
    <div class="d-flex justify-content-between vm--modal__inner">
      <div class="vm--modal__left">
        <div class="vm--modal__action table__actions">
          <div class="table__icon">
            <img src="@/assets/icons/trash_icon.svg" alt="" />
          </div>
          <div class="table__icon">
            <img src="@/assets/icons/task_add_icon.svg" alt="" />
          </div>
          <div class="table__icon">
            <img src="@/assets/icons/attach_icon.svg" alt="" />
          </div>
        </div>
        <form class="vm--modal__form modal-form">
          <div class="group">
            <div class="group__title">Наименование задачи:</div>
            <div class="group__content">
              <input class="form-control" type="text" />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Описание задачи:</div>
            <div class="group__content">
              <textarea class="form-textarea"></textarea>
            </div>
          </div>
          <div class="vm--modal__buttons">
            <v-button red>Принять</v-button>
            <v-button white>Отказаться</v-button>
          </div>
        </form>
      </div>
      <div class="vm--modal__right"></div>
    </div>
  </v-modal>
</template>

<script>
import VButton from "../../components/VButton";

export default {
  props: {
    task: {
      type: Object,
    },
  },
  components: { VButton },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.vm--modal {
  &__left {
    flex: 1;
    margin-right: 20px;
  }

  &__inner {
    padding-top: 10px;
  }

  &__right {
    background-color: $color-gray-secondary;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    padding: 10px;
    width: 391px;
  }

  .table__actions {
    justify-content: left;
    margin-bottom: 20px;
  }
}
</style>
