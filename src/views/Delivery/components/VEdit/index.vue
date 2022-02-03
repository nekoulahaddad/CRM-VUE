<template>
  <v-delivery-form :editedItem="editedItem" />
</template>

<script>
import VDeliveryForm from "../VDeliveryForm";

export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  components: { VDeliveryForm },
};
</script>
