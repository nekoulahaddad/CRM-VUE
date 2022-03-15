<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteDelivery">
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
import { mapMutations } from "vuex";
import axios from "@/api/axios";

export default {
  props: {
    deletedItem: {
      type: Object,
      default: () => {},
    },
  },
  components: { VButton },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    cancel() {
      this.$modal.hide("deleteDelivery");
    },
    confirm() {
      this.changeStatus(false);
      axios({
        url: `/providers/delete/`,
        data: {
          providerId: this.deletedItem._id,
        },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$emit("removeProvider", result.data.provider);
          this.$toast.success("Поставщик удален!");
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
