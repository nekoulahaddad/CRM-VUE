<template>
  <div class="list__info event-edit">
    <vue-scroll>
      <form @submit.prevent="onEventEdit">
        <div class="event-info__title text--blue">Основная информация:</div>

        <div class="group">
          <div class="group__title">Описание:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              name="description"
              v-model="description"
            />
          </div>
        </div>

        <div class="group__content">
          <div class="group__item text--bold-700">Создатель:</div>
          <div class="group__value">
            {{ transformFIO(editedItem.customData.initiator) }}
          </div>
        </div>

        <div class="group">
          <div class="group__title">Участники:</div>
          <div class="group__participants" v-if="participants.length">
            <vue-scroll>
              <div
                class="group__participant"
                v-for="(chip, index) in participants"
                :key="chip._id"
              >
                <span>{{ transformFIO(chip) }}</span>
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
          </div>
          <div v-else>Участников нет</div>
        </div>

        <div class="group">
          <div class="group__title">Дата начала:</div>
          <div class="group__content">
            <datetime
              v-model="start"
              type="datetime"
              input-class="forms__container--input"
              @input="start = $event.target.value"
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
              @input="end = $event.target.value"
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            />
          </div>
        </div>

        <v-spinner v-if="isLoading" small />
        <v-button red v-else>Сохранить</v-button>
      </form>
    </vue-scroll>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";

export default {
  props: {
    editedItem: {
      type: Object,
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
      title: "",
      fio: "",
      description: "",
      users: [],
      participants: [],
      isLoading: false,
      selectionStart: new Date().toISOString(),
      selectionEnd: new Date().toISOString(),
    };
  },
  components: { VSpinner },
  computed: {
    start: {
      get: function () {
        return new Date(
          this.$moment(this.editedItem.customData.startDate).format()
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
          this.$moment(this.editedItem.customData.endDate).format()
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
    deleteChip(index) {
      this.participants.splice(index, 1);
    },
    onEventEdit() {
      this.isLoading = true;

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
          this.$toast.success("Мероприятие успешно изменено!");
          this.$emit("toggleEdit", this.editedItem);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.title = this.editedItem.customData.title;
    this.description = this.editedItem.customData.description;
    this.participants = this.editedItem.customData.participants.map(
      (item) => item._id
    );

    const body = document.querySelector("body");
    const form = document.querySelector(".event-edit form");

    form.onmouseover = function () {
      body.style.overflow = "hidden";
    };

    form.onmouseout = function () {
      body.style.overflow = "auto";
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.event-edit {
  form {
    max-height: 555px;
    margin-left: 5px;
  }

  .form-textarea {
    width: 976px;
    height: 150px !important;
  }

  .group__participants {
    width: 420px;
    height: 150px;
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
}
</style>
