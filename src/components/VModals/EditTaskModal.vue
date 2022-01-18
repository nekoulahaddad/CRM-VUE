<template>
  <v-modal :adaptive="true" :minWidth="1130" name="editTask">
    <div class="vm--modal__title">
      Необходимо обновить CRM систему, выполнив редизайн системы.
    </div>
  </v-modal>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
    },
  },
};
</script>
