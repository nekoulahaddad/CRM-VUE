<template>
  <div class="list__info list-info employee-edit-form">
    <form enctype="multipart/form-data"></form>
    <div class="group">
      <div class="group__title">Наименование раздела:</div>
      <div class="group__content">
        <input type="text" class="form-control" v-model="editedItem.title" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Для какой роли:</div>
      <div class="group__content">
        <select class="form-select"></select>
      </div>
    </div>
    <div class="group">
      <div class="group__title">Для какого отдела:</div>
      <div class="group__content">
        <select class="form-select"></select>
      </div>
    </div>
    <div class="group">
      <div class="group__title">Описание раздела:</div>
      <div class="group__content">
        <textarea class="form-textarea" v-model="editedItem.description" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  background-color: $color-gray-secondary;

  .form-select {
    max-width: 371px;
  }
}
</style>
