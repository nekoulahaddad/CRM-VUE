<template>
  <div class="list__info list-info employee-edit-form">
    <v-section-form
      :formData="formData"
      :editedItem="editedItem"
      @submit="onSectionAdd"
    />
  </div>
</template>

<script>
import axios from "@/api/axios";
import VSectionForm from "../VSectionForm";
import { mapMutations } from "vuex";

export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        role: "all",
        ...this.editedItem,
      },
    };
  },
  components: {
    VSectionForm,
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onSectionAdd() {
      this.changeStatus(false);

      axios({
        url: "/educations/update/",
        data: {
          ...this.formData,
          educationId: this.editedItem._id,
        },
        method: "POST",
      })
        .then(async () => {
          this.$emit("refreshEducations");
          this.$toast.success("Секция успешно Обновлена!");
          this.changeStatus(true);
          this.$emit("toggleEdit", this.editedItem);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  background-color: $color-gray-secondary;

  .form-select {
    max-width: 371px;
  }
}
</style>
