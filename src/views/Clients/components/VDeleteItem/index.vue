<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteClient">
    <div class="vm--modal__title">
      Удаление
      <img
        class="close"
        src="@/assets/icons/close_icon.svg"
        alt=""
        @click="cancel"
      />
    </div>
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
  },
  components: { VButton },
  methods: {
    cancel() {
      this.$modal.hide("deleteClient");
    },
    confirm() {
      axios({
        url: "/clients/delete/",
        data: {
          clientId: this.deletedItem._id,
        },
        method: "post",
      })
        .then(() => {
          this.$toast.success("Клиент успешно удален!");
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

<style lang="scss" scoped>
.vm--modal {
  &__text {
    text-align: center;
    margin-bottom: 20px;
  }
  &__buttons {
    justify-content: center;
  }
  .close {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
</style>
