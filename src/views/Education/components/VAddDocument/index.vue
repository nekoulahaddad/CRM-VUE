<template>
  <div class="card card--white card--small">
    <div class="card__title card__title--small">
      Добавить документ
      <img
        @click="$emit('toggleAddDocument')"
        class="card__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="card__group group">
      <div class="group__title">Название документа:</div>
      <div class="group__content">
        <input
          class="form-control"
          type="text"
          placeholder="Введите название документа..."
        />
      </div>
    </div>
    <div class="card__group group">
      <div class="group__title">Загрузить документ:</div>
      <div class="group__content"></div>
    </div>
    <div class="group__actions">
      <v-button red>Сохранить</v-button>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.card {
  margin-bottom: 10px;
  padding-bottom: 10px;

  &__close {
    position: absolute;
    right: 0;
    top: 6px;
    cursor: pointer;
  }

  &__title {
    position: relative;
    padding-bottom: 10px;

    &::after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #f6f6f6;
      border-radius: $border-radius;
      width: 100%;
    }
  }

  .group {
    & + * {
      margin-top: 10px;
    }
  }

  .group__actions {
    margin-top: 10px;

    .btn {
      width: 230px;
      font-size: 16px;
      height: 37px;
    }
  }

  .group__title {
    font-weight: 600;
  }
}
</style>
