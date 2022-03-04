<template>
  <v-modal
    :adaptive="true"
    :maxHeight="175"
    name="deleteEmployee"
    @before-close="$store.commit('toggleDeleteSelectedItems', false)"
  >
    <div class="delete-employee">
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
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import axios from "@/api/axios";

export default {
  props: {
    deletedItem: Object,
    selectedItems: Array,
    deleteMany: {
      type: Boolean,
      default: false,
    },
  },
  components: { VButton },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    cancel() {
      this.$modal.hide("deleteEmployee");
    },
    confirm() {
      axios({
        url: `/user/delete/`,
        data: {
          userId: this.deleteMany ? this.selectedItems : this.deletedItem._id,
        },
        method: "DELETE",
      })
        .then(async (res) => {
          this.$emit("refresh");
          this.$emit("afterDelete");

          const msg =
            this.deleteMany && this.selectedItems.length > 1
              ? "Сотрудники успешно удалены!"
              : "Сотрудник успешно удален!";

          this.$toast.success(msg);
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
.delete-employee {
  .vm--modal__title {
    .close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 15px;
    }
  }
}
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
