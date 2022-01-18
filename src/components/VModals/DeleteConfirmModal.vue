<template>
  <v-modal :adaptive="true" :maxHeight="130" name="deleteConfirm">
    <div class="vm--modal__title">Вы уверены? Подтвердите действие</div>
    <div class="vm--modal__inner">
      <div class="vm--modal__buttons">
        <v-button red>Удалить</v-button>
        <v-button white>Отмена</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VButton from "../../components/VButton";

export default {
  components: {
    VButton,
  },
};
</script>

<style lang="scss">
.vm--modal {
  &__buttons {
    justify-content: center;
  }
}
</style>
