<template>
  <v-modal :adaptive="true" :minHeight="677" :minWidth="1130" name="addEvent">
    <div class="vm--modal__title">
      Создать мероприятие
      <img
        @click="$modal.hide('addEvent')"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Заголовок мероприятия:</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            placeholder="Введите заголовок мероприятия..."
            name="title"
            @input="onChange($event)"
          />
        </div>
      </div>
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Участники:</div>
        <div class="group__content">
          <autocomplete
            :search="searchByExecutor"
            :get-result-value="getResultValue"
            placeholder="Введите исполнителя задачи..."
            @input="getUsersByFIO"
          >
            <template #result="{ result, props }">
              <li v-bind="props">
                {{ result.surname }}
              </li>
            </template>
          </autocomplete>
        </div>
      </div>
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Дата начала:</div>
        <div class="group__content">
          <datetime
            required
            v-model="start"
            type="datetime"
            input-class="forms__container--input"
            :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            @input="start = $event.target.value"
          />
        </div>
      </div>
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Дата окончания:</div>
        <div class="group__content">
          <datetime
            required
            v-model="end"
            type="datetime"
            input-class="forms__container--input"
            :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            @input="end = $event.target.value"
          />
        </div>
      </div>
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Описание:</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            placeholder="Введите описание данного мероприятия..."
            name="description"
            @input="onChange($event)"
          />
        </div>
      </div>
      <v-button red>Создать</v-button>
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
      participants: [],
    };
  },
  props: {
    selectionStart: {
      type: Date,
    },
    selectionEnd: {
      type: Date,
    },
    type: {
      type: String,
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
        return;
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
  },
};
</script>

<style lang="scss">
.vm--modal {
  .autocomplete-input {
    width: 330px;
  }
}
</style>
