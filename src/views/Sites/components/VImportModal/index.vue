<template>
  <v-modal :adaptive="true" :minHeight="440" name="importSite">
    <div class="vm--modal__title">
      Импорт товаров
      <img
        @click="$modal.hide('addEvent')"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Сайт:</div>
        <div class="group__content">
          <input class="form-control" type="text" />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Описание:</div>
        <div class="group__content">
          <textarea class="form-textarea"></textarea>
        </div>
      </div>
      <div class="group">
        <div class="group__title">Загрузка файла:</div>
        <div class="group__content">
          <input type="file" id="document-file" hidden name="document" />
          <label for="document-file"> Выбрать файл </label>
        </div>
      </div>
      <div class="vm--modal__buttons">
        <v-button @click="confirm" red>Импортировать</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  props: {
    item: {
      type: Object,
    },
  },
  components: { VButton },
  methods: {
    cancel() {
      this.$modal.hide("importSite");
    },

    confirm() {},
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_variables";

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
.vm--modal__buttons {
  justify-content: center;
  padding-top: 10px;
}
.vm--modal__close {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
