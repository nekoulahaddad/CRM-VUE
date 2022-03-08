<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteGoodsCategory">
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
    region: String,
  },
  components: { VButton },
  methods: {
    cancel() {
      this.$modal.hide("deleteGoodsCategory");
    },
    confirm() {
      axios({
        url: `/categories/delete`,
        data: {
          categoryId: this.deletedItem._id,
          region: this.region,
        },
        method: "POST",
      })
        .then((res) => {
          this.$emit("deleteCategory", res.data.category);
          this.$toast.success("Категория успешно удалена!");
          this.$emit("toggleOpen");
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
