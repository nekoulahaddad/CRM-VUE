<template>
  <form @submit.prevent="$emit('submit', $event)">
    <div class="edit__inner">
      <!-- Наименование раздела -->
      <div class="group">
        <div class="group__title">Наименование раздела:</div>
        <div class="group__content">
          <input
            class="form-control"
            placeholder="Введите название раздела..."
            type="text"
            v-model="formData.title"
            @change="onChange($event)"
            name="title"
          />
        </div>
      </div>
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
            <option v-for="department in departments" :value="department.value">
              {{ department.title }}
            </option>
          </select>
        </div>
      </div>
      <!-- Описание раздела -->
      <div class="group">
        <div class="group__title">Описание раздела:</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            placeholder="Введите описание раздела..."
            name="description"
            v-model="formData.description"
            @change="onChange($event)"
          />
        </div>
      </div>
      <v-button red>{{ $t("Отправить") }}</v-button>
    </div>
  </form>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  props: {
    departments: Array,
    formData: Object,
    editedItem: Object,
  },
  components: { VButton },
  methods: {
    onChange(e) {
      this.formData[e.target.name] = e.target.value;
    },
  },
  mounted() {
    if (this.editedItem) {
      this.formData.role = this.editedItem.role;
      this.formData.department = this.editedItem.department;
      this.formData.title = this.editedItem.title;
      this.formData.description = this.editedItem.description;
    }
  },
};
</script>
