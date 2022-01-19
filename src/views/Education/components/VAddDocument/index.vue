<template>
  <div class="card card--white card--small">
    <div class="card__title card__title--small">
      Добавить документ
      <img
        @click="$emit('close')"
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
      <div class="group__content">
        <input type="file" id="document-file" hidden />
        <label for="document-file">Выбрать файл</label>
      </div>
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
  padding-top: 10px;

  &__close {
    position: absolute;
    right: 0;
    top: 6px;
    cursor: pointer;
  }

  &__title {
    position: relative;
    padding-bottom: 0;
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

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 230px;
    height: 37px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(0, 0, 0, 0.3);
    background-color: $color-white;
    border-radius: $border-radius;
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
}
</style>
