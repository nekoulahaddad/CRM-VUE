<template>
  <div class="list__info list-info group-edit-form">
    <form>
      <div class="category-edit-form__title text--blue">
        Редактировать группу:
      </div>

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
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.group-edit-form {
  .form-control {
    width: 976px;
  }
  .form-select {
    width: 401px;
  }
}
</style>
