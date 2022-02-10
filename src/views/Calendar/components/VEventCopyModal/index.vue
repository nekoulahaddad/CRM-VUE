<template>
  <v-modal :adaptive="true" :minHeight="765" :minWidth="1110" name="copyEvent">
    <div class="event-copy">
      <form @submit.prevent="confirm">
        <div class="vm--modal__title">
          Копирование мероприятия
          <img
            alt=""
            class="vm--modal__close"
            src="/icons/close_icon.svg"
            @click="cancel"
          />
        </div>

        <div class="event-copy__inner">
          <!-- Заголовок -->
          <div class="group">
            <div class="group__title">Заголовок:</div>
            <div class="group__content">
              <input
                required
                class="form-control"
                type="text"
                placeholder="Введите заголовок мероприятия..."
                v-model="title"
              />
            </div>
          </div>

          <!-- Описание -->
          <div class="group">
            <div class="group__title">Описание:</div>
            <div class="group__content">
              <textarea
                required
                class="form-textarea"
                placeholder="Введите описание мероприятия..."
                v-model="description"
              />
            </div>
          </div>

          <!-- Участники -->
          <div class="group participants">
            <div class="group__title">Участники:</div>
            <div class="group__participants" :style="{ height: height }">
              <vue-scroll v-if="participants.length">
                <div
                  class="group__participant"
                  v-for="(participant, index) in participants"
                  :key="index"
                >
                  <span>{{ transformFIO(participant) }}</span>
                  <div>
                    <VueCustomTooltip label="Удалить">
                      <img
                        alt=""
                        src="@/assets/icons/trash_icon.svg"
                        @click="deleteChip(index)"
                      />
                    </VueCustomTooltip>
                  </div>
                </div>
              </vue-scroll>
              <div v-else>Участников нет</div>
            </div>
            <div class="group__content">
              <autocomplete
                class="participants__input"
                :search="searchByExecutor"
                :get-result-value="getResultValue"
                placeholder="Введите участника мероприятия..."
              >
                <template #result="{ result, props }">
                  <li v-bind="props" @click="selectUser(result)">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
            </div>
          </div>

          <!-- Дата начала -->
          <div class="group">
            <div class="group__title">Дата начала:</div>
            <div class="group__content">
              <datetime
                type="datetime"
                input-class="forms__container--input"
                :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
                v-model="selectionStart"
              />
            </div>
          </div>

          <!-- Дата окончания -->
          <div class="group">
            <div class="group__title">Дата окончания:</div>
            <div class="group__content">
              <datetime
                type="datetime"
                input-class="forms__container--input"
                :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
                v-model="selectionEnd"
              />
            </div>
          </div>

          <v-spinner v-if="!isLoading" small />
          <v-button v-else red>Сохранить</v-button>
        </div>
      </form>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";

export default {
  props: {
    copyItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      description: "",
      title: "",
      participants: [],
      isLoading: true,
      selectionStart: new Date().toISOString(),
      selectionEnd: new Date().toISOString(),
    };
  },
  computed: {
    height() {
      if (this.participants.length > 3) {
        return "162px";
      }

      return `${this.participants.length * 54}px`;
    },
  },
  components: { VSpinner },
  methods: {
    cancel() {
      this.$modal.hide("copyEvent");
      this.$modal.show("eventList");
    },
    confirm() {
      let event = {
        _id: this.copyItem.customData._id,
        title: this.title,
        description: this.description,
        startDate: this.selectionStart,
        endDate: this.selectionEnd,
        participants: this.participants,
      };

      axios({
        url: `/events/update/`,
        data: event,
        method: "POST",
      })
        .then(() => {
          this.$emit("updateEvents");
          this.$toast.success("Мероприятие успешно создано!");
          this.cancel();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    deleteChip(index) {
      this.participants.splice(index, 1);
    },
    getResultValue(result) {
      return "";
    },
    searchByExecutor(input) {
      if (input.length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getsearch/${input}`).then(async (res) => {
          resolve(res.data);
        });
      });
    },
    selectUser(user) {
      if (this.participants.find((p) => p._id === user._id)) {
        this.$toast.error("Участник уже добавлен");
      } else {
        this.participants.push(user);
      }
    },
  },
  watch: {
    copyItem() {
      if (this.copyItem.customData) {
        this.title = this.copyItem.customData.title;
        this.description = this.copyItem.customData.description;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.event-copy {
  .participants__input {
    margin-top: 20px !important;
  }
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

  .form-textarea,
  .form-control {
  }
  .vdatetime-input {
    width: 401px !important;
  }

  .group__participant {
    margin-left: 3px;
    height: 40px;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    width: 401px;
    overflow-x: hidden;
    margin-top: 10px;

    &:last-child {
      margin-bottom: 10px;
    }
  }
  .participants {
    .group__content {
      width: 422px;
    }
    &__input {
      margin-top: 10px;
    }
  }
  .group__participants {
    width: 420px;
    //height: 150px;
  }
  .form-textarea {
    height: 150px !important;
  }
  button {
    position: absolute;
    bottom: 10px;
    left: 20px;
  }
}
</style>
