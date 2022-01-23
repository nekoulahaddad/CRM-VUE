<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteDocument">
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
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";

export default {
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
    deletedDocument: {
      type: Object,
      required: true,
    },
  },
  components: {
    VButton,
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
          educationId: this.infoItem._id,
          documentId: this.deletedDocument._id,
        },
        method: "POST",
      })
        .then(() => {
          this.$emit("refreshEducations");
          this.$toast.success("Документ успешно удален!");
          this.$emit("deleteDocumentSuccess");
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
