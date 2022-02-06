<template>
  <div class="add-child">
    <form @submit.prevent>
      <div class="group">
        <div class="group__title">ФИО:</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            name="newChild.fio"
            v-model="newChild.fio"
          />
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
            v-model="newChild.birthDate"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Пол:</div>
        <div class="group__content">
          <select
            class="form-select"
            name="newChild.gender"
            v-model="newChild.gender"
          >
            <option value="муж">Муж</option>
            <option value="жен">Жен</option>
          </select>
        </div>
      </div>
      <div class="add-child__buttons">
        <v-button @click="$emit('addChild')" red>Добавить</v-button>
        <v-button white @click="$emit('cancel')">Отмена</v-button>
      </div>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  props: {
    newChild: Object,
  },
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

    button {
      margin-right: 10px;
    }
  }
}
</style>
