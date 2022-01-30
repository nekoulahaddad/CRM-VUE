<template>
  <div class="list__info list-info employee-edit-form">
    <v-employee-form
      :infoItem="infoItem"
      @addToUsers="$emit('addToUsers')"
      @toggleEdit="toggleEdit"
      @changeUser="changeUser"
    />
  </div>
</template>

<script>
import VEmployeeForm from "../VEmployeeForm";
import VButton from "@/components/VButton";
import { Datetime } from "vue-datetime";

export default {
  components: { Datetime, VButton, VEmployeeForm },
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
  },
  methods: {
    toggleEdit(infoItem) {
      this.$emit("toggleEdit", infoItem);
    },
    changeUser(user) {
      this.$emit("changeUser", user);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  .group {
    max-width: 976px;

    select {
      max-width: 401px;
    }
  }
  .group__title {
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        display: block;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        top: 0;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
  select,
  input[type="text"] {
    font-weight: 500;
  }
  .vdatetime-popup__header {
    background: $color-red;
  }
}
</style>
