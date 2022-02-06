<template>
  <div class="list__info list-info group-edit-form">
    <form>
      <div class="group-edit-form__title text--blue">Редактировать группу:</div>

      <div class="group">
        <div class="group__title">Заголовок группы:</div>
        <div class="group__content">
          <input required class="form-control" type="text" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Свойства группы:</div>
        <div class="group__content">
          <select class="form-select">
            <option value=""></option>
          </select>
        </div>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
};
</script>

<style lang="scss">
.group-edit-form {
  .form-control {
    width: 976px;
  }
  .form-select {
    width: 401px;
  }
  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>
