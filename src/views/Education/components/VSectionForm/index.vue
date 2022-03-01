<template>
  <form class="create-section-form" @submit.prevent="$emit('submit', $event)">
    <div class="d-flex justify-content-between">
      <div class="flex-1" style="margin-right: 25px">
        <!-- Наименование раздела -->
        <div class="group">
          <div class="group__title">
            Наименование раздела: <span class="required">*</span>
          </div>
          <div class="group__content">
            <input
              required
              class="form-control"
              placeholder="Введите название раздела..."
              type="text"
              v-model="formData.title"
              @change="onChange($event)"
              name="title"
            />
          </div>
        </div>
        <!-- Описание раздела -->
        <div class="group">
          <div class="group__title">Описание раздела:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              placeholder="Введите описание раздела..."
              name="description"
              v-model="formData.description"
              @change="onChange($event)"
            />
          </div>
        </div>
      </div>
      <div>
        <!-- Для какой роли -->
        <div class="group">
          <div class="group__title">
            Для какой роли: <span class="required">*</span>
          </div>
          <div class="group__content">
            <v-select
              :options="[
                {
                  label: 'Все роли',
                  value: 'all',
                },
                ...Object.entries($t('roles')).map(([role, key]) => ({
                  label: key,
                  value: role,
                })),
              ]"
              :reduce="(item) => item.value"
              v-model="formData.role"
            />
          </div>
        </div>
        <!-- Для какого отдела -->
        <div class="group">
          <div class="group__title">
            Для какого отдела: <span class="required">*</span>
          </div>
          <div class="group__content">
            <v-select
              name="department"
              :options="
                departments.map((department) => ({
                  label: department.title,
                  value: department.value,
                }))
              "
              :reduce="(item) => item.value"
              v-model="formData.department"
            />
          </div>
        </div>
      </div>
    </div>

    <v-button red>{{ $t("Отправить") }}</v-button>
  </form>
</template>

<script>
import axios from "@/api/axios";
import VButton from "@/components/VButton";

export default {
  props: {
    formData: Object,
    editedItem: Object,
    isLoading: Boolean,
  },
  components: { VButton },
  methods: {
    onChange(e) {
      this.formData[e.target.name] = e.target.value;
    },
    setSelected({ value }) {
      this.formData.department = value;
    },
    setRole({ value }) {
      this.formData.role = value;
    },
  },
  data() {
    return {
      departments: [],
    };
  },
  mounted() {
    if (this.editedItem) {
      this.formData.role = this.editedItem.role;
      this.formData.department = this.editedItem.department;
      this.formData.title = this.editedItem.title;
      this.formData.description = this.editedItem.description;
    }

    axios({
      url: "/user/getdepartments",
    }).then((res) => {
      let departments = res.data.departments;
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
@import "@/styles/_variables";

.create-section-form {
  button {
    margin-top: 10px;
  }
  .v-select {
    width: 401px;
    background-color: $color-white;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    border-radius: $border-radius;
  }
  .vs__dropdown-toggle {
    border: none;
  }
}
</style>
