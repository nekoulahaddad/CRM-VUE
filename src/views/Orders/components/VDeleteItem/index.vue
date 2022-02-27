<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteOrder">
    <div class="vm--modal__title">Удаление</div>
    <div class="vm--modal__inner">
      <div class="vm--modal__text">
        Вы точно хотите удалить? Отменить это действие будет невозможно
      </div>
      <div class="vm--modal__buttons">
        <v-spinner v-if="isLoading" small />
        <template v-else>
          <v-button @click="confirm" red>Да</v-button>
          <v-button @click="cancel" white>Нет</v-button>
        </template>
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
      let orderId = this.deletedItem._id;

      if (this.deleteMany) {
        orderId = [...new Set([...this.selectedItems, this.deletedItem._id])];
      }

      this.isLoading = true;

      axios({
        url: `/orders/delete`,
        data: {
          orderId,
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
}
</style>
