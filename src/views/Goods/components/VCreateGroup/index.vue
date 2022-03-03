<template>
  <v-modal
    :adaptive="true"
    :maxHeight="175"
    name="createGroup"
    @before-close="$store.commit('setCreateGroup', false)"
  >
    <div class="vm--modal__title">
      Создать группу
      <img src="@/assets/icons/close_icon.svg" alt="" />
    </div>
    <div class="vm--modal__inner">
      <div class="vm--modal__text"></div>
      <div class="vm--modal__buttons">
        <v-button @click="confirm" red>Создать</v-button>
        <v-button @click="cancel" white>Отмена</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
export default {
  props: {
    items: Array,
  },
  methods: {
    cancel() {
      this.$modal.hide("createGroup");
    },
    confirm() {},
  },
};
</script>

<style lang="scss"></style>
