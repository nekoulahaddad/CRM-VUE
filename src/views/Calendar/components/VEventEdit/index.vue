<template>
  <div class="list__info event-edit">
    <form>
      <div class="event-info__title text--blue">Основная информация:</div>

      <div class="group">
        <div class="group__title">Описание:</div>
        <div class="group__content">
          <textarea
            required
            class="form-textarea"
            name="description"
            :value="editedItem.customData.description"
            @input="onChange($event)"
          />
        </div>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    editedItem: {
      type: Object,
    },
    selectionStart: {
      type: Date,
    },
    selectionEnd: {
      type: Date,
    },
    type: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  data() {
    return {
      fio: "",
      users: [],
      participants: [],
    };
  },
  computed: {
    start: {
      get: function () {
        return new Date(
          this.$moment(this.editedItem.startDate).format()
        ).toISOString();
      },
      set: function (date) {
        let newDate = new Date(this.$moment(date));
        this.selectionStart = newDate.toISOString();
        return newDate;
      },
    },
    end: {
      get: function () {
        return new Date(
          this.$moment(this.editedItem.endDate).format()
        ).toISOString();
      },
      set: function (date) {
        let newDate = new Date(this.$moment(date));
        this.selectionEnd = newDate.toISOString();
        return newDate;
      },
    },
  },
  methods: {
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
  },
};
</script>

<style lang="scss">
.event-edit {
  .form-textarea {
    width: 976px;
    height: 200px;
  }
}
</style>
