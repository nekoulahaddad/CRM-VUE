<template>
  <v-modal
    :adaptive="true"
    :maxHeight="175"
    name="deleteOrder"
    @before-close="$store.commit('toggleDeleteSelectedItems', false)"
  >
    <div class="vm--modal__title">
      Удаление
      <img
        class="close"
        src="@/assets/icons/close_icon.svg"
        alt=""
        @click="cancel"
      />
    </div>
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
import VSpinner from "@/components/VSpinner";
import axios from "@/api/axios";

export default {
  props: {
    deletedItem: Object,
    selectedItems: Array,
    deleteMany: {
      type: Boolean,
      default: false,
    },
  },
  components: { VSpinner },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    cancel() {
      this.$modal.hide("deleteOrder");
    },
    confirm() {
      this.isLoading = true;

      axios({
        url: `/orders/delete`,
        data: {
          orderId: this.deleteMany ? this.selectedItems : this.deletedItem._id,
        },
        method: "POST",
      })
        .then(() => {
          const msg =
            this.deleteMany && this.selectedItems.length > 1
              ? "Заказы успешно удалены!"
              : "Заказ успешно удален!";
          this.$toast.success(msg);
          this.$emit("afterDelete");
          this.cancel();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
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
  .close {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
</style>
