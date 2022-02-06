<template>
  <div class="list__info list-info category-edit-form">
    <form>
      <div class="category-edit-form__title text--blue">
        Ответственный менеджер:
      </div>

      <div class="group">
        <div class="group__title">ФИО:</div>
        <div class="group__content">
          <input required class="form-control" type="text" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Телефон:</div>
        <div class="group__content">
          <input required class="form-control" type="text" />
        </div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
export default {};
</script>
