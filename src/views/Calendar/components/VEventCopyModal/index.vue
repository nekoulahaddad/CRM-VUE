<template>
  <v-modal :adaptive="true" :minHeight="696" :minWidth="1110" name="copyEvent">
    <div class="event-copy">
      <div class="vm--modal__title">
        Копирование мероприятия
        <img
          class="vm--modal__close"
          src="/icons/close_icon.svg"
          alt=""
          @click="cancel"
        />
      </div>
    </div>
  </v-modal>
</template>

<script>
export default {
  methods: {
    cancel() {
      this.$modal.hide("copyEvent");
      this.$modal.show("eventList");
    },
    confirm() {},
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.event-copy {
  &__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }

  &__inner {
    padding: 10px 20px 20px;
  }
}
</style>
