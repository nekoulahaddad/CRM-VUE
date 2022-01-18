<template>
  <v-modal adaptive="true" maxHeight="160" name="deleteTaskModal">
    <div class="vm--modal__title">Удаление задачи</div>
    <div class="vm--modal__inner">
      <div class="vm--modal__clarification">
        Вы уверены? Подтвердите действие
      </div>
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
