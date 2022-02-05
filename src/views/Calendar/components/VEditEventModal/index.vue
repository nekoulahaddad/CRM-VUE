<template>
  <v-modal :adaptive="true" :minHeight="691" :minWidth="1273" name="editEvent">
    <div class="vm--modal__title">
      Создать мероприятие
      <img
        @click="$modal.hide('editEvent')"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner vm--modal__edit-event">
      <form @submit.prevent="onEventAdd">
        <div class="group">
          <div class="group__title">Заголовок мероприятия:</div>
          <div class="group__content">
            <input
              required
              type="text"
              class="form-control"
              placeholder="Введите заголовок мероприятия..."
              name="title"
              :value="editedItem.title"
              @input="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Участники:</div>
          <div class="group__executors">
            <select class="form-select">
              <option
                :value="participant._id"
                v-for="(participant, index) in participants"
              >
                {{ transformFIO(participant) }}
              </option>
            </select>
          </div>
          <div class="group__content">
            <autocomplete
              required
              :search="searchByExecutor"
              :get-result-value="getResultValue"
              placeholder="Введите исполнителя задачи..."
            >
              <template #result="{ result, props }">
                <li v-bind="props">
                  {{ transformFIO(result) }}
                </li>
              </template>
            </autocomplete>
          </div>
        </div>
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
        <div class="group">
          <div class="group__title">Описание:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              placeholder="Введите описание данного мероприятия..."
              name="description"
              @input="onChange($event)"
              :value="editedItem.description"
            />
          </div>
        </div>
        <v-button red>Сохранить</v-button>
      </form>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import axios from "@/api/axios";

export default {
  components: { VButton },
  data() {
    return {
      fio: "",
      users: [],
      title: "",
      description: "",
      participants: [],
      selectionStart: new Date(),
      selectionEnd: new Date(),
    };
  },
  props: {
    editedItem: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
    },
  },
  watch: {
    editedItem() {
      this.description = this.editedItem.description;
      this.title = this.editedItem.title;
      this.participants = this.editedItem.participants.map((item) => item._id);
    },
  },
  computed: {
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
    onChange(e) {
      this[e.target.name] = e.target.value;
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
      return result.surname;
    },
    onEventAdd() {
      this.changeStatus(false);

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
        .then(async (res) => {
          this.$toast.success("Мероприятие успешно добавлено!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.vm--modal {
  .autocomplete-input {
    width: 330px;
  }
  &__inner {
    padding: 10px;
  }

  .vm--modal__edit-event {
    .form-textarea,
    .form-control {
      width: 689px;
    }
    .form-select {
      width: 330px;
    }
    .group__executors {
      margin-bottom: 10px;
    }
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
}
</style>
