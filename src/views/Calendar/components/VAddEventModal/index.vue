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
  </v-modal>
</template>

<script>
export default {};
</script>
