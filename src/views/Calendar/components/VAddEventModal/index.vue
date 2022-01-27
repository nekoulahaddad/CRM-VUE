<template>
  <v-modal :adaptive="true" :minHeight="727" :minWidth="1130" name="addEvent">
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
};
</script>
