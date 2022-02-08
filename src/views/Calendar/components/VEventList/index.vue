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
    <div class="vm--modal__inner">
      <div class="list list-shadow">
        <div
          :key="index"
          v-for="(event, index) in events"
          class="list__row list__row--shadow list__row--white"
        >
          <div class="list__columns list__columns-shadow list__columns-white">
            <div class="list__column">{{ event.customData.title }}</div>
            <div class="list__column">
              <div class="table__actions">
                <div class="table__icon">
                  <img src="@/assets/icons/trash_icon.svg" alt="" />
                </div>
                <div class="table__icon">
                  <VueCustomTooltip label="Просмотр">
                    <img src="@/assets/icons/info_icon.svg" alt="" />
                  </VueCustomTooltip>
                </div>
                <div class="table__icon">
                  <VueCustomTooltip label="Изменить">
                    <img src="@/assets/icons/write_icon.svg" alt="" />
                  </VueCustomTooltip>
                </div>
                <div class="table__icon">
                  <VueCustomTooltip label="Удалить">
                    <img src="@/assets/icons/trash_icon.svg" alt="" />
                  </VueCustomTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
export default {
  props: {
    events: Array,
  },
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
  .list__columns {
    grid-template-columns: 1fr 1fr;
    .list__column:first-child {
      text-align: left;
      font-size: 16px;
    }
  }
}
</style>
