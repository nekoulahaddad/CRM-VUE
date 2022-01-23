<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteDocument">
    <div class="vm--modal__title">Удаление документа</div>
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
import { mapMutations } from "vuex";

export default {
  props: {
    deletedItem: {
      type: Object,
      required: true,
    },
    deletedDocument: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    cancel() {
      this.$modal.hide("deleteDocument");
    },
    confirm() {
      this.changeStatus(false);

      axios({
        url: "/educations/deletedocument",
        data: {
          educationId: this.deletedItem._id,
          documentId: this.deletedDocument._id,
        },
        method: "POST",
      })
        .then(async () => {
          await this.$emit("refreshEducations");
          this.$toast.success("Документ успешно удален!");
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
