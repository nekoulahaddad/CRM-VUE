<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deletePurchase">
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
  },
  methods: {
    cancel() {
      this.$modal.hide("deletePurchase");
    },
    confirm() {
      axios({
        url: `/purchase/delete/`,
        data: {
          id: this.deletedItem._id,
        },
        method: "POST",
      })
        .then(async (res) => {
          this.$toast.success("Закупка удалена!");
          this.$emit("fetchData");
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
