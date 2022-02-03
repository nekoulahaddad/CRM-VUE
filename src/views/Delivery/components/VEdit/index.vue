<template>
  <div class="edit-delivery">
    <v-delivery-form :editedItem="editedItem" />
  </div>
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

<style lang="scss">
.edit-delivery {
  padding: 10px;
}
</style>
