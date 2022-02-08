<template>
  <v-modal :adaptive="true" :minHeight="696" :minWidth="1110" name="eventList">
    <div class="event-list">
      <div class="vm--modal__title">
        Список мероприятий
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
            :class="{
              'list__row--opened': infoItem.key === event.key,
            }"
          >
            <div class="list__columns list__columns-shadow list__columns-white">
              <div class="list__column">{{ event.customData.title }}</div>
              <div class="list__column">
                <div class="table__actions">
                  <!-- Копировать -->
                  <div class="table__icon">
                    <VueCustomTooltip label="Копировать">
                      <img src="@/assets/icons/copy.svg" alt="" />
                    </VueCustomTooltip>
                  </div>

                  <!-- Просмотр -->
                  <div class="table__icon">
                    <VueCustomTooltip
                      label="Просмотр"
                      v-if="infoItem.key !== event.key"
                    >
                      <img
                        alt=""
                        @click="toggleInfo(event)"
                        src="@/assets/icons/info_icon.svg"
                      />
                    </VueCustomTooltip>
                    <img
                      alt=""
                      v-else
                      @click="toggleInfo(event)"
                      src="@/assets/icons/arrow_top_icon.svg"
                    />
                  </div>

                  <template
                    v-if="
                      role === 'superadmin' ||
                      (event.customData.initiator &&
                        event.customData.initiator._id === userId)
                    "
                  >
                    <!-- Изменение -->
                    <div class="table__icon">
                      <VueCustomTooltip label="Изменить">
                        <img src="@/assets/icons/write_icon.svg" alt="" />
                      </VueCustomTooltip>
                    </div>

                    <!-- Удаление -->
                    <div class="table__icon">
                      <VueCustomTooltip label="Удалить">
                        <img src="@/assets/icons/trash_icon.svg" alt="" />
                      </VueCustomTooltip>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <v-event-info v-if="infoItem.key === event.key" :infoItem="event" />
          </div>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VEventInfo from "../VEventInfo";

export default {
  props: {
    events: Array,
    userId: String,
    role: String,
  },
  data() {
    return {
      editedItem: {},
      infoItem: {},
    };
  },
  components: { VEventInfo },
  methods: {
    closeModal() {
      this.$modal.hide("eventList");
    },
    toggleInfo(item) {
      if (this.infoItem.key === item.key) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
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
  .event-list {
    .vm--modal__inner {
      padding: 20px;
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
  .list__columns {
    grid-template-columns: 1fr 1fr;
    .list__column:first-child {
      text-align: left;
      font-size: 16px;
    }
  }
}
</style>
