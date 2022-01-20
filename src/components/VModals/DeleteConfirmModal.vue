<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteConfirm">
    <div class="vm--modal__title">Удаление</div>
    <div class="vm--modal__inner">
      <div class="vm--modal__text">
        Вы точно хотите удалить? Отменить это действие будет невозможно
      </div>
      <div class="vm--modal__buttons">
        <v-button @click="confirm" red>Да</v-button>
        <v-button @click="cancel" white>Нет</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VButton from "../../components/VButton";

export default {
  controller: null,
  components: {
    VButton,
  },
  methods: {
    cancel() {
      this.$options.controller.reject();
      this.$modal.hide("deleteConfirm");
    },
    confirm() {
      this.$options.controller.resolve();
    },
  },
  mounted() {
    let resolve;
    let reject;

    const promise = new Promise((ok, fail) => {
      resolve = ok;
      reject = fail;
    });

    this.$options.controller = { resolve, reject };

    return promise;
  },
};
</script>

<style lang="scss" scoped>
.vm--modal {
  &__text {
    text-align: center;
    margin-bottom: 20px;
  }
  &__buttons {
    justify-content: center;
  }
}
</style>
