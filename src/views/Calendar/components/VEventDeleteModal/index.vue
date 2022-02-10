<template>
  <v-modal :adaptive="true" :maxHeight="175" name="deleteEvent">
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

export default {
  props: {
    deletedItem: {
      type: Object,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$modal.hide("deleteEvent");
      this.$modal.show("eventList");
    },
    confirm() {
      axios({
        url: `/events/delete/`,
        data: {
          eventId: this.deletedItem.key,
        },
        method: "POST",
      }).then(() => {
        this.$emit("updateEvents");
        this.$emit("updateAfterDeleteEvent", this.deletedItem.key);
        this.cancel();
        this.$toast.success("Мероприятие успешно удалено!");
        this.$modal.show("eventList");
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
