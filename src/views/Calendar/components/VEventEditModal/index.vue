<template>
  <v-modal :adaptive="true" :minHeight="765" :minWidth="1110" name="editEvent">
    <div class="event-edit">
      <div class="vm--modal__title">
        Редактирование мероприятия
        <img
          @click="cancel"
          class="vm--modal__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
      <div class="event-edit__inner vm--modal__edit-event">
        <form @submit.prevent="confirm">
          <!-- Заголовок мероприятия -->
          <div class="group">
            <div class="group__title">Заголовок мероприятия:</div>
            <div class="group__content">
              <input
                required
                class="form-control"
                type="text"
                v-model="title"
              />
            </div>
          </div>

          <!-- Описание -->
          <div class="group">
            <div class="group__title">Описание:</div>
            <div class="group__content">
              <textarea class="form-textarea" v-model="description" />
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
        </form>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";

export default {
  props: {
    editedItem: {
      type: Object,
    },
  },
  data() {
    return {
      title: "",
      fio: "",
      description: "",
      users: [],
      participants: [],
      isLoading: true,
      initiator: "",
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
    cancel() {
      this.$modal.hide("editEvent");
      this.$modal.show("eventList");
    },
    selectUser(user) {
      if (this.participants.find((p) => p._id === user._id)) {
        this.$toast.error("Участник уже добавлен");
      } else {
        this.participants.push(user);
      }
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    deleteChip(index) {
      this.participants.splice(index, 1);
    },
    confirm() {
      if (this.$moment().valueOf() > new Date(this.selectionEnd).getTime()) {
        this.$toast.error(
          "Дата окончания не может быть раньше текущего времени!"
        );
        return;
      }
      this.isLoading = false;

      let event = {
        _id: this.editedItem.customData._id,
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
          this.$emit("updateAfterEditEvent", event);
          this.$emit("updateEvents");
          this.$toast.success("Мероприятие успешно изменено!");
          this.cancel();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.isLoading = true;
        });
    },
  },
  watch: {
    editedItem() {
      if (this.editedItem.customData) {
        this.title = this.editedItem.customData.title;
        this.initiator = this.editedItem.customData.initiator;
        this.description = this.editedItem.customData.description;
        this.selectionStart = new Date(
          this.$moment(this.editedItem.customData.startDate).format()
        ).toISOString();
        this.selectionEnd = new Date(
          this.$moment(this.editedItem.customData.endDate).format()
        ).toISOString();
        this.participants = this.editedItem.customData.participants.map(
          (item) => item._id
        );
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.event-edit {
  form {
    max-height: 555px;
  }

  &__inner {
    padding: 10px 20px;
  }

  .form-textarea {
    height: 150px !important;
  }

  .group__participants {
    width: 420px;
  }

  span[role="tooltip"] {
    &:after {
      background-color: $color-black;
      color: $color-white;
      border-radius: $border-radius;
    }

    & + * {
      margin-left: 20px;
    }
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
  }

  .participants {
    .group__content {
      width: 422px;
    }
    &__input {
      margin-top: 20px !important;
    }
  }
  .spinner,
  button {
    position: absolute;
    bottom: 10px;
    left: 20px;
  }
}
</style>
