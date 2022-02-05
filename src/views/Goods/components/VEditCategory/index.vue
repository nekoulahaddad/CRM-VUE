<template>
  <div class="list__info list-info orders-edit-form">
    <div>edit</div>
  </div>
</template>

<script>
export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
};
</script>
