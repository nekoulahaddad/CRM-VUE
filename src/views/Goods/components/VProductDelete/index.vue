<template>
  <v-modal
    :adaptive="true"
    :maxHeight="175"
    name="deleteGoodsProduct"
    @before-close="$store.commit('toggleDeleteSelectedItems', false)"
  >
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
    deleteMany: Boolean,
    selectedItems: Array,
    deletedItem: {
      type: Object,
      default: () => {},
    },
    region: {
      type: String,
      default: () => "",
    },
    deletedProducts: {
      type: Array,
      default: () => [],
    },
  },
  components: { VButton },
  methods: {
    cancel() {
      this.$modal.hide("deleteGoodsProduct");
    },
    confirm() {
      if (!this.deleteMany) {
        axios({
          url: `/products/delete`,
          data: {
            productId: this.deletedItem._id,
            region: this.deletedItem.region,
          },
          method: "POST",
        })
          .then(async (res) => {
            let result = await res;
            this.$emit("deleteProduct", result.data.product);
            this.$toast.success("Товар успешно удален!");
            this.cancel();
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      } else {
        for (let i = 0; i < this.selectedItems.length; i++) {
          const product = this.selectedItems[i];
          axios({
            url: `/products/delete`,
            data: {
              productId: product,
              region: this.region,
            },
            method: "POST",
          })
            .then((res) => {
              const msg =
                this.selectedItems.length > 1
                  ? "Товары успешно удалены!"
                  : "Товар успешно удален!";
              if (i + 1 === this.selectedItems.length) {
                this.$toast.success(msg);
                this.$emit("deleteProducts", this.selectedItems);
                this.cancel();
                this.$store.commit("clearSelectedItems");
              }
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
            });
        }
      }
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
