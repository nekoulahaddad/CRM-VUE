<template>
  <v-modal
    :adaptive="true"
    :minHeight="768"
    :minWidth="996"
    name="addEvent"
    @before-close="closeModal"
  >
    <div class="add-event">
      <div class="vm--modal__title">
        Создать мероприятие
        <img
          @click="cancel"
          class="vm--modal__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
      <div class="vm--modal__inner vm--modal__add-event">
        <form @submit.prevent="onEventAdd">
          <!-- Заголовок мероприятия -->
          <div class="group">
            <div class="group__title">Заголовок мероприятия:</div>
            <div class="group__content">
              <input
                required
                type="text"
                class="form-control"
                placeholder="Введите заголовок мероприятия..."
                name="title"
                @input="onChange($event)"
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
                placeholder="Введите описание данного мероприятия..."
                name="description"
                @input="onChange($event)"
                v-model="description"
              />
            </div>
          </div>

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
                v-model="start"
                type="datetime"
                input-class="forms__container--input"
                :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
              />
            </div>
          </div>

          <!-- Дата окончания -->
          <div class="group">
            <div class="group__title">Дата окончания:</div>
            <div class="group__content">
              <datetime
                v-model="end"
                type="datetime"
                input-class="forms__container--input"
                :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
              />
            </div>
          </div>

          <v-button red>Создать</v-button>
        </form>
      </div>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import Chip from "vue-chip";
import VSpinner from "@/components/VSpinner";
import axios from "@/api/axios";

export default {
  components: { VButton, Chip, VSpinner },
  data() {
    return {
      fio: "",
      users: [],
      title: "",
      description: "",
      participants: [],
      isLoading: true,
      selectionStart: new Date().toISOString(),
      selectionEnd: new Date().toISOString(),
    };
  },
  props: {
    event: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
    },
  },
  watch: {
    event() {
      this.description = this.event.description;
      this.title = this.event.title;
    },
  },
  computed: {
    height() {
      if (this.participants.length > 3) {
        return "154px";
      }
      return "auto";
    },
    start: {
      get: function () {
        return this.selectionStart
          ? new Date(this.$moment(this.selectionStart).format()).toISOString()
          : new Date(this.$moment()).toISOString();
      },
      set: function (date) {
        let newDate = new Date(this.$moment(date));
        this.selectionStart = newDate.toISOString();
        return newDate;
      },
    },
    end: {
      get: function () {
        return this.selectionEnd
          ? new Date(this.$moment(this.selectionEnd).format()).toISOString()
          : new Date(this.$moment()).toISOString();
      },
      set: function (date) {
        let newDate = new Date(this.$moment(date));
        this.selectionEnd = newDate.toISOString();
        return newDate;
      },
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    reset() {
      this.fio = "";
      this.users = [];
      this.title = "";
      this.description = "";
      this.participants = [];
      this.selectionStart = new Date().toDateString();
      this.selectionEnd = new Date().toDateString();
    },
    cancel() {
      this.$modal.hide("addEvent");
    },
    deleteChip(index) {
      this.participants.splice(index, 1);
    },
    closeModal() {
      this.$store.commit("deactivateAction", "addEvent");
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    selectUser(user) {
      this.participants.push(user);
    },
    async getUsersByFIO() {
      if (this.fio === "") {
        return;
      }
      axios(`/user/getsearch/${this.fio}`).then(async (res) => {
        let result = await res;
        this.users = result.data;
      });
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
    getResultValue(result) {
      return "";
    },
    onEventAdd() {
      this.isLoading = false;

      let event = {
        title: this.title,
        description: this.description,
        startDate: this.start,
        endDate: this.end,
        participants: this.participants,
      };
      axios({
        url: `/events/post/`,
        data: event,
        method: "POST",
      })
        .then(() => {
          this.$emit("updateEvents");
          this.$toast.success("Мероприятие успешно добавлено!");
          this.closeModal();
          this.cancel();
          this.reset();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.isLoading = true;
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.add-event {
  .autocomplete-input {
    width: 401px;
  }
  &__inner {
    padding: 20px;
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
    height: 150px;
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
  .autocomplete-input,
  .vdatetime-input {
    width: 410px;
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
  button {
    position: absolute;
    bottom: 10px;
    left: 20px;
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
      margin-top: 20px;
    }
  }
  .group__participants {
    width: 420px;
  }
}
</style>
