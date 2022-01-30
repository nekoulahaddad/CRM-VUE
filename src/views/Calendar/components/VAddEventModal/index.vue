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
          />
        </div>
      </div>
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Участники:</div>
        <div class="group__content">
          <autocomplete placeholder="Введите исполнителя задачи...">
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
            v-model="start"
            required
            input-class="forms__container--input"
            :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
          />
        </div>
      </div>
    </div>
    <div class="vm--modal__inner">
      <div class="group">
        <div class="group__title">Дата окончания:</div>
        <div class="group__content">
          <datetime
            v-model="end"
            required
            input-class="forms__container--input"
            :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
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
          />
        </div>
      </div>
      <v-button red>Создать</v-button>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
  data() {
    return {};
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
};
</script>
