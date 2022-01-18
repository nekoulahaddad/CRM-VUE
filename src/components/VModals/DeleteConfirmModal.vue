<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteConfirm">
    <div class="vm--modal__title">Удаление</div>
    <div class="vm--modal__inner">
      <div class="vm--modal__text">
        Вы точно хотите удалить? Отменить это действие будет невозможно
      </div>
      <div class="vm--modal__buttons">
        <v-button @click.prevent="remove" red>Да</v-button>
        <v-button white>Нет</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "../../api/axios";
import VButton from "../../components/VButton";

export default {
  components: {
    VButton,
  },
  methods: {
    remove() {
      return;
      this.changeStatus(false);

      axios({
        url: "/educations/delete",
        data: {
          educationId: this.deletedItem._id,
        },
        method: "POST",
      })
        .then(async () => {
          await this.$emit("refreshEducations");
          this.$toast.success("Раздел успешно удален!");
          this.$emit("toggleOpen");
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
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
