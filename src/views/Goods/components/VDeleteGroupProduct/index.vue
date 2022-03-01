<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteGroupProduct">
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
    region: String,
    group: Object,
    product: Object,
  },
  methods: {
    cancel() {
      this.$modal.hide("deleteGroupProduct");
    },
    confirm() {
      axios({
        url: `/groups/remove`,
        data: {
          productId: this.product._id,
          groupId: this.group._id,
          region: this.region,
        },
        method: "POST",
      })
        .then(async () => {
          this.$emit(
            "deleteProductFromGroup",
            this.group._id,
            this.product._id
          );
          this.$toast.success("Товар успешно убран из группы!");
          this.cancel();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
};
</script>
