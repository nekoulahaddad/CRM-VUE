<template>
  <v-modal name="editTask">
    <div class="vm--modal__title">{{ task.title }}</div>
  </v-modal>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>
