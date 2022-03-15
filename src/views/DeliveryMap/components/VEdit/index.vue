<template>
  <div class="edit-delivery">
    <v-delivery-form
      :editedItem="editedItem"
      @refresh="refresh"
      @toggleEdit="toggleEdit"
    />
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
  methods: {
    refresh() {
      this.$emit("refresh");
    },
    toggleEdit(item) {
      this.$emit("toggleEdit", item);
    },
  },
};
</script>

<style lang="scss">
.edit-delivery {
  padding: 10px;
}
</style>
