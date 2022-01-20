<template>
  <div class="list create-section-list">
    <div class="list__row list__row--shadow list__row--opened">
      <div
        class="list__columns list__columns--shadow list__columns--white education-list-columns"
      >
        <div class="list__column">Добавить новый раздел:</div>
        <img
          @click="$emit('close')"
          class="close-icon"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>

      <div class="list__info list-info education-list-info">
        <v-section-form
          :departments="departments"
          :formData="formData"
          :isLoading="isLoading"
          @submit="onSectionAdd"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import VSectionForm from "../VSectionForm";
import { mapMutations } from "vuex";

export default {
  props: {
    type: String,
  },
  components: { VButton, VSectionForm },
  data() {
    return {
      formData: {
        title: "",
        role: "all",
        department: "all",
        description: "",
        type: "crm",
      },
      isLoading: true,
      date: new Date().toString(),
      departments: [],
      titleName: this.editedItem ? "Редактировать раздел" : "Добавить раздел",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    onSectionAdd() {
      this.isLoading = false;

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

      axios({
        url: "/educations/post/",
        data: sectionData,
        method: "POST",
      })
        .then(async () => {
          await this.$emit("refreshEducations");
          this.$toast.success("Секция успешно добавлена!");
          this.$emit("toggleOpen");
          this.changeStatus(true);
          this.$store.commit("toggleAction", {
            key: "createEducationSection",
          });
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
          this.isLoading = true;
        });
    },
  },
  mounted() {
    if (this.editedItem) {
      this.role = this.editedItem.role;
      this.department = this.editedItem.department;
      this.title = this.editedItem.title;
      this.description = this.editedItem.description;
    }

    axios({
      url: "/user/getdepartments",
    }).then(async (res) => {
      let result = await res;
      let departments = result.data.departments;
      departments.unshift({
        title: "Все отделы",
        value: "all",
      });
      this.departments = departments;
    });
  },
};
</script>

<style lang="scss">
.create-section-list {
  .close-icon {
    cursor: pointer;
    right: 10px;
    top: 13px;
    position: absolute;
  }

  .form-select {
    max-width: 371px;
  }
}
</style>
