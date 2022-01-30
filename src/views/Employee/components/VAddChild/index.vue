<template>
  <div class="add-child">
    <div class="group">
      <div class="group__title">ФИО:</div>
      <div class="group__content">
        <input type="text" class="form-control" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Дата рождения:</div>
      <div class="group__content">
        <datetime
          required
          type="datetime"
          input-class="forms__container--input"
          :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Пол:</div>
      <div class="group__content">
        <select class="form-select">
          <option value="">Муж</option>
          <option value="">Жен</option>
        </select>
      </div>
    </div>
    <div class="add-child__buttons">
      <v-button red>Добавить</v-button>
      <v-button white @click="$emit('cancel')">Отмена</v-button>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: {
    VButton,
  },
};
</script>

<style lang="scss">
.add-child {
  margin-bottom: 10px;

  .form-control {
    width: 976px;
  }
  .vdatetime-input,
  .form-select {
    width: 401px;
  }

  &__buttons {
    display: flex;
    margin-top: 10px;
  }
}
</style>
