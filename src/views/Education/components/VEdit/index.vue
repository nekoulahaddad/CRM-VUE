<template>
  <div class="list__info list-info employee-edit-form">
    <form enctype="multipart/form-data"></form>
    <div class="group">
      <div class="group__title">Наименование раздела:</div>
      <div class="group__content">
        <input type="text" class="form-control" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Наименование раздела:</div>
      <div class="group__content">
        <input type="text" class="form-control" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Для какой роли:</div>
      <div class="group__content">
        <input type="text" class="form-control" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Наименование раздела:</div>
      <div class="group__content">
        <input type="text" class="form-control" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  background-color: $color-gray-secondary;
}
</style>
