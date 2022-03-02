<template>
  <div class="list__info list-info product-edit-form">
    <form @submit.prevent="">
      <div class="product-edit-form__title text--blue">
        Редактировать товар:
      </div>
      <div class="group">
        <div class="group__title">Название товара:</div>
        <div class="group__content">
          <input class="form-control" type="text" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Артикул поставщика:</div>
        <div class="group__content">
          <input class="form-control" type="text" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.product-edit-form {
  &__title {
    &.text--blue {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 10px;
    }
  }
}
</style>
