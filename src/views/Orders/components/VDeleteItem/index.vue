<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteOrder">
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
import axios from "@/api/axios";

export default {
  props: {
    deletedItem: Object,
    selectedItems: Array,
  },
  methods: {
    cancel() {
      this.$modal.hide("deleteOrder");
    },
    confirm() {
      const orderId = [
        ...new Set([...this.selectedItems, this.deletedItem._id]),
      ];

      axios({
        url: `/orders/delete`,
        data: {
          orderId,
        },
        method: "POST",
      })
        .then(() => {
          this.$toast.success("Заказ успешно удален!");
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
}
</style>
