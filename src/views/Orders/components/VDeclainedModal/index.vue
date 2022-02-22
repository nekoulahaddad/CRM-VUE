<template>
  <v-modal
    :adaptive="true"
    :minHeight="declainReason === 'other' ? 377 : 210"
    :maxHeight="declainReason === 'other' ? 377 : 210"
    :minWidth="750"
    name="declainderOrder"
  >
    <div class="vm--modal__title">Отклонение заказа</div>
    <div class="vm--modal__inner vm--modal-declainder-order">
      <form @submit.prevent="cancelOrder">
        <div class="vm--modal__text">Причина отказа:</div>
        <div class="vm--modal__content d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <input
              required
              type="radio"
              id="one"
              name="reason"
              v-model="declainReason"
              value="нет товара в наличии"
              @change="changeHandler(declainReason)"
            />
            <label for="one">Нет товара в наличии</label>
          </div>
          <div class="d-flex align-items-center">
            <input
              required
              type="radio"
              name="reason"
              id="two"
              v-model="declainReason"
              value="дорогая доставка"
              @change="changeHandler(declainReason)"
            />
            <label for="two">Дорогая доставка </label>
          </div>
          <div class="d-flex align-items-center">
            <input
              required
              type="radio"
              name="reason"
              id="three"
              value="дефицит товара"
              v-model="declainReason"
              @change="changeHandler(declainReason)"
            />
            <label for="three">Дефицит товара</label>
          </div>
          <div class="d-flex align-items-center">
            <input
              required
              type="radio"
              name="reason"
              id="four"
              value="other"
              v-model="declainReason"
              @change="changeHandler(declainReason)"
            />
            <label for="four">Другая причина</label>
          </div>
        </div>
        <textarea
          required
          v-if="declainReason === 'other'"
          type="radio"
          class="form-textarea"
          value="дефицит товара"
          placeholder="комментарий"
          v-model="declainReasonOther"
          @input="changeOtherHandler(declainReasonOther)"
        />
        <div class="vm--modal__buttons">
          <v-button @click="confirm" red>Отклонить заказ</v-button>
          <v-button @click="cancel" white>Отменить</v-button>
        </div>
      </form>
    </div>
  </v-modal>
</template>

<script>
export default {
  props: {
    editedItem: {
      type: Object,
      default: () => {},
    },
  },
  data: () => {
    return {
      declainReasonOther: null,
      declainReason: "нет товара в наличии",
      declainReasonSelected: null,
    };
  },
  methods: {
    cancel() {
      this.$modal.hide("declainderOrder");
    },
    confirm() {},
    cancelOrder() {
      this.editedItem.declainReason = this.declainReasonSelected
        ? this.declainReasonSelected
        : this.declainReason;
      this.$emit("toggleOpen", { cancelOrder: true });
    },
    cancelAction() {
      this.$emit("toggleOpen", { cancelOrder: false });
    },
    changeHandler(data) {
      if (data !== "other") {
        this.declainReasonSelected = data;
      } else {
        this.declainReasonSelected = data;
      }
    },
    changeOtherHandler(data) {
      this.declainReasonSelected = data;
    },
  },
};
</script>

<style lang="scss">
.vm--modal-declainder-order {
  input[type="radio"] {
    cursor: pointer;
    margin-right: 10px;

    width: 20px;
    height: 20px;
  }
  label {
    cursor: pointer;
  }

  .form-textarea {
    margin-top: 10px;
    height: 150px;
    margin-bottom: 20px;
  }
  .vm--modal__content {
    margin-bottom: 20px;
  }
}
</style>
