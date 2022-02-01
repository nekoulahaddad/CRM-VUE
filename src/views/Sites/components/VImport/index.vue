<template>
  <div class="list__info list-info sites-list-info">
    <div class="group__title text--blue">Импорт товаров:</div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Сайт:</div>
        <div class="group__value">123</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Описание:</div>
        <div class="group__value">123</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Загрузка файла:</div>
        <div class="group__value">123</div>
      </div>
    </div>
    <v-button red>Импортировать</v-button>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    VButton,
  },
};
</script>

<style lang="scss">
.sites-list-info {
  .group__title {
    font-size: 16px;
  }
}
</style>
