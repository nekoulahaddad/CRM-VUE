<template>
  <form class="create-section-form" @submit.prevent="$emit('submit', $event)">
    <div class="d-flex justify-content-between">
      <div class="flex-1" style="margin-right: 25px">
        <!-- Наименование раздела -->
        <div class="group">
          <div class="group__title">Наименование раздела:</div>
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
          <div class="group__title">Для какой роли:</div>
          <div class="group__content">
            <select
              class="form-select"
              v-model="formData.role"
              name="role"
              @change="onChange($event)"
            >
              <option value="all">Все роли</option>
              <option :value="key" v-for="(role, key) in $t('roles')">
                {{ role }}
              </option>
            </select>
          </div>
        </div>
        <!-- Для какого отдела -->
        <div class="group">
          <div class="group__title">Для какого отдела:</div>
          <div class="group__content">
            <select
              class="form-select"
              v-model="formData.department"
              name="department"
              @change="onChange($event)"
            >
              <option
                v-for="department in departments"
                :value="department.value"
              >
                {{ department.title }}
              </option>
            </select>
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
.create-section-form {
  button {
    margin-top: 10px;
  }
}
</style>
