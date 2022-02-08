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

      <div class="group__content">
        <div class="group__item text--bold-600">Создатель:</div>
        <div class="group__value">
          {{ transformFIO(editedItem.customData.initiator) }}
        </div>
      </div>

      <div class="group">
        <div class="group__title">Участники:</div>
        <div class="group__participants">
          <div
            class="group__participant"
            v-for="(chip, index) in participants"
            :key="chip._id"
          >
            <span>{{ transformFIO(chip) }}</span>
            <div>
              <VueCustomTooltip label="Удалить">
                <img src="@/assets/icons/trash_icon.svg" alt="" />
              </VueCustomTooltip>
            </div>
          </div>
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
  mounted() {
    this.participants = this.editedItem.customData.participants.map(
      (item) => item._id
    );
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.event-edit {
  .form-textarea {
    width: 976px;
    height: 200px;
  }
  .group__participant {
    height: 40px;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    width: 401px;

    & + * {
      margin-top: 10px;
    }
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
}
</style>
