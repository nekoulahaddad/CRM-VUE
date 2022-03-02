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

      <div class="group">
        <div class="group__title">Цена:</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Оптовая цена:</div>
        <div class="group__content"></div>
      </div>

      <div class="group">
        <div class="group__title">Клубная цена:</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Скидка:</div>
        <div class="group__content"></div>
      </div>

      <div class="group">
        <div class="group__title">Цена со скидкой:</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">РРЦ:</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Цена закупки:</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Наценка (%):</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Стоп цена:</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Единица измерения:</div>
        <div class="group__content">
          <input class="form-control" type="text" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Кол-во в упаковке:</div>
        <div class="group__content">
          <input class="form-control" type="number" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Описание:</div>
        <div class="group__content">
          <textarea class="form-textarea" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Свойства товара:</div>
        <div class="group__content"></div>
        <div class="group__footer">
          <v-button red>Добавить свойство</v-button>
        </div>
      </div>

      <v-button red>Сохранить</v-button>
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
