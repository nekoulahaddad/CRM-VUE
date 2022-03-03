<template>
  <v-modal
    :adaptive="true"
    :maxHeight="175"
    :minWidth="976"
    name="createGroup"
    @before-close="$store.commit('setCreateGroup', false)"
  >
    <div class="create-group-modal">
      <div class="vm--modal__title">
        Создать группу
        <img
          @click="cancel"
          class="close"
          src="@/assets/icons/close_icon.svg"
          alt=""
        />
      </div>
      <div class="vm--modal__inner">
        <form>
          <div class="group">
            <div class="group__title">Заголовок группы:</div>
            <div>
              <input
                type="text"
                class="form-control"
                maxlength="100"
                placeholder="Введите заголовок группы..."
              />
            </div>
          </div>
        </form>
        <div class="vm--modal__buttons">
          <v-button @click="confirm" red>Создать</v-button>
          <v-button @click="cancel" white>Отмена</v-button>
        </div>
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

<style lang="scss">
.create-group-modal {
  position: relative;

  .close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
  }
}
</style>
