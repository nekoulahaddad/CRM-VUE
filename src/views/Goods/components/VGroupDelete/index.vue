<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteGroup">
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
import VButton from "@/components/VButton";
import axios from "@/api/axios";

export default {
  props: {
    group: {
      type: Object,
    },
    region: {
      type: String,
    },
  },
  components: { VButton },
  methods: {
    cancel() {
      this.$modal.hide("deleteGroup");
    },
    confirm() {
      axios({
        url: `/groups/delete`,
        data: {
          groupId: this.group._id,
          region: this.region,
        },
        method: "POST",
      })
        .then(async () => {
          this.cancel();
          this.$toast.success("Группа успешно удалена!");
          this.$emit("refreshGoods");
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
