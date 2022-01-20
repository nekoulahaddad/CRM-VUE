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
      let sectionData = {};
      if (this.formData.title) {
        sectionData.title = this.formData.title;
      }
      if (this.formData.type) {
        sectionData.type = this.formData.type;
      }
      if (this.formData.role) {
        sectionData.role = this.formData.role;
      }
      if (this.formData.department) {
        sectionData.department = this.formData.department;
      }
      if (this.formData.description) {
        sectionData.description = this.formData.description;
      }

      sectionData.educationId = this.editedItem._id;

      axios({
        url: "/educations/update/",
        data: sectionData,
        method: "POST",
      })
        .then(async () => {
          this.$emit("refreshEducations");
          this.$toast.success("Секция успешно Обновлена!");
          this.$emit("toggleOpen");
          this.changeStatus(true);
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
