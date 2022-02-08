<template>
  <v-modal :adaptive="true" :minHeight="696" :minWidth="996" name="eventList">
    <div class="vm--modal__title">
      Список событий
      <img
        @click="closeModal"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner">1</div>
  </v-modal>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$modal.hide("eventList");
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.vm--modal {
  .autocomplete-input {
    width: 401px;
  }
  &__inner {
    padding: 10px;
  }

  .vm--modal__add-event {
    .form-textarea,
    .form-control {
      width: 976px;
    }
    .form-select {
      width: 401px;
    }
    .group__executors {
      margin-bottom: 10px;
    }
  }

  .form-textarea {
    height: 218px;
  }

  .group__title {
    font-size: 14px !important;
  }

  .group {
    &__title {
      font-size: 12px;
    }
  }

  &__close {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  button {
    width: 230px;
  }
  .vdatetime-input {
    width: 330px;
  }
  .chip {
    background-color: $color-gray-secondary;
    margin-bottom: 15px;
    & + * {
      margin-left: 10px;
    }
  }
  &__title {
    padding-left: 10px;
  }
}
</style>
