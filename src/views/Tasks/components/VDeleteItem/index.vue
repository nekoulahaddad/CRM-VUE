<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteTask">
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
    deletedItem: Object,
    selectedItems: Array,
  },
  components: { VButton },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    cancel() {
      this.$modal.hide("deleteTask");
    },
    confirm() {
      let taskId = this.deletedItem._id;

      if (this.deleteMany) {
        taskId = [...new Set([...this.selectedItems, this.deletedItem._id])];
      }

      axios({
        url: "/tasks/delete/",
        data: {
          taskId,
        },
        method: "DELETE",
      })
        .then(() => {
          this.$emit("afterDelete");
          this.$toast.success("Задача успешно удалена!");
          this.cancel();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
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
