<template>
  <v-modal :adaptive="true" :minWidth="1130" name="editTask">
    <div class="vm--modal__title">
      Необходимо обновить CRM систему, выполнив редизайн системы.
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
        <div class="vm--modal__buttons">
          <v-button red>Принять</v-button>
          <v-button white>Отказаться</v-button>
        </div>
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
