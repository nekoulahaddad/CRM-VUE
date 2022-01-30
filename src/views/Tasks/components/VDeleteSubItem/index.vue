<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteSubTask">
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
import { mapMutations } from "vuex";

export default {
  props: {
    deletedItem: {
      type: Object,
      required: true,
    },
  },
  components: { VButton },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    cancel() {
      this.$modal.hide("deleteSubTask");
    },
    confirm() {
      this.changeStatus(false);
      axios({
        url: "/tasks/delete/",
        data: {
          taskId: this.deletedItem._id,
        },
        method: "DELETE",
      })
        .then((res) => {
          this.$emit("removeFromSubTask", this.deletedItem);
          this.$toast.success("Подзадача успешно удалена!");
          this.cancel();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
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
