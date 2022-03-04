<template>
  <v-modal :adaptive="true" :minWidth="976" :minHeight="475" name="regionEdit">
    <div class="vm--modal__title">
      Редактировать регион
      <img @click="cancel" src="@/assets/icons/close_icon.svg" alt="" />
    </div>
    <div class="vm--modal__inner region-edit">
      <div class="vm--modal__content d-flex justify-content-between">
        <div>
          <div class="group__title">Регион:</div>
          <div class="group__content">
            <select class="form-select">
              <option value=""></option>
            </select>
          </div>
        </div>
        <div>
          <div class="group__title">Валюта:</div>
          <div class="group__content">
            <select class="form-select">
              <option value=""></option>
            </select>
          </div>
        </div>
      </div>
      <div class="vm--modal__content d-flex justify-content-between">
        <div>
          <div class="group__title">Баннеры для десктоп версии:</div>
          <div class="group__content"></div>
        </div>
        <div>
          <div class="group__content"></div>
        </div>
      </div>
      <div class="vm--modal__buttons">
        <v-button @click="confirm" red>Да</v-button>
        <v-button @click="cancel" white>Нет</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
export default {
  methods: {
    confirm() {},
    cancel() {
      this.$modal.hide("regionEdit");
    },
  },
};
</script>

<style lang="scss">
.vm--modal {
  &__text {
    text-align: center;
    margin-bottom: 20px;
  }
  &__buttons {
    justify-content: center;
  }

  .region-edit {
    .form-select {
      width: 401px;
    }
  }
}
</style>
