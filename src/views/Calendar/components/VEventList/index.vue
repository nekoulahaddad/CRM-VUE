<template>
  <v-modal :adaptive="true" :minHeight="780" :minWidth="1110" name="eventList">
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
        <div class="list list-shadow" v-if="events.length">
          <div
            :key="index"
            v-for="(event, index) in events"
            class="list__row list__row--shadow list__row--white"
            :class="{
              'list__row--opened':
                infoItem.key === event.key || editedItem.key === event.key,
            }"
          >
            <div class="list__columns list__columns-shadow list__columns-white">
              <div class="list__column">{{ event.customData.title }}</div>
              <div class="list__column">
                <div class="table__actions">
                  <!-- Копировать -->
                  <div
                    class="table__icon"
                    v-if="role === 'superadmin' || role === 'director'"
                  >
                    <VueCustomTooltip label="Копировать">
                      <img
                        alt=""
                        src="@/assets/icons/copy.svg"
                        @click="$emit('toggleCopy', event)"
                      />
                    </VueCustomTooltip>
                  </div>

                  <!-- Просмотр -->
                  <div class="table__icon">
                    <VueCustomTooltip label="Просмотр">
                      <img
                        alt=""
                        @click="$emit('toggleInfo', event)"
                        src="@/assets/icons/info_icon.svg"
                      />
                    </VueCustomTooltip>
                  </div>

                  <template>
                    <!-- Изменение -->
                    <div
                      class="table__icon"
                      v-if="
                        role === 'superadmin' ||
                        role === 'director' ||
                        role === 'call'
                      "
                    >
                      <VueCustomTooltip label="Изменить">
                        <img
                          alt=""
                          src="@/assets/icons/write_icon.svg"
                          @click="$emit('toggleEdit', event)"
                        />
                      </VueCustomTooltip>
                    </div>

                    <!-- Удаление -->
                    <div class="table__icon" v-if="role === 'superadmin'">
                      <VueCustomTooltip label="Удалить">
                        <img
                          alt=""
                          src="@/assets/icons/trash_icon.svg"
                          @click="$emit('toggleDelete', event)"
                        />
                      </VueCustomTooltip>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Блок с просмотром мероприятия -->
            <v-event-info v-if="infoItem.key === event.key" :infoItem="event" />
          </div>
        </div>
        <div v-else>Мероприятий нет</div>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VEventInfo from "../VEventInfo";
import VEventEdit from "../VEventEditModal";

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
  components: { VEventInfo, VEventEdit },
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
  }
  .chip {
    background-color: $color-gray-secondary;
    margin-bottom: 15px;
    & + * {
      margin-left: 10px;
    }
  }
  &__title {
    padding-left: 20px !important;
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
