<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteProduct">
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
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    cancel() {
      this.$modal.hide("deleteProduct");
    },
    confirm() {
      if (this.deletedItem && this.deletedItem._id) {
        this.changeStatus(false);
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
          })
          .finally(() => {
            this.changeStatus(true);
          });
      }
      if (
        this.deletedItem &&
        !this.deletedItem._id &&
        this.deletedProducts.length
      ) {
        for (let i = 0; i < this.deletedProducts.length; i++) {
          this.changeStatus(false);
          const product = this.deletedProducts[i];
          axios({
            url: `/products/delete`,
            data: {
              productId: product._id,
              region: this.region,
            },
            method: "POST",
          })
            .then(async (res) => {
              let result = await res;
              this.$emit("deleteProduct", result.data.product);
              this.$toast.success(`Товар ${product.title} успешно удален!`);
              // this.$emit('toggleOpen')
              if (i + 1 === this.deletedProducts.length) {
                this.$emit("clearSelectedProducts");
                this.$emit("toggleOpen");
              }
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
            })
            .finally(() => {
              this.changeStatus(true);
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
