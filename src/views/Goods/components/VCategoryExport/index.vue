<template>
  <div class="list__info list-info category-list-info">
    <div class="group__title text--blue">Экспорт из категории:</div>
    <div class="group">
      <div class="group__title">Товары:</div>
      <div class="group__content">
        <v-button red>Экспортировать</v-button>
      </div>
    </div>
    <div class="group">
      <div class="group__title">Изображения:</div>
      <div class="group__content">
        <v-button red>Экспортировать</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
};
</script>
