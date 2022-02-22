<template>
  <v-modal :adaptive="true" :maxHeight="175" name="orderActionModal">
    <div class="vm--modal__title">{{ dialog.data.title }}</div>
    <div class="vm--modal__inner">
      <div class="vm--modal__text">
        {{ dialog.data.msg }}
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
  props: {
    dialog: {
      type: Object,
    },
  },
  methods: {
    cancel() {
      this.$modal.hide("orderActionModal");
    },
    confirm() {
      this.dialog.callback(...this.dialog.args);
      this.dialog.callback = null;
    },
  },
};
</script>
