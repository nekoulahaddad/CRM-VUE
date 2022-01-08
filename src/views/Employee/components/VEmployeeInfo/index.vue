<template>
  <div class="list__info list-info">
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeeMainInfo") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeSurName") }}
        </div>
        <div class="group__value">{{ employee.surname }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeName") }}
        </div>
        <div class="group__value">{{ employee.name }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeLastName") }}
        </div>
        <div class="group__value">{{ employee.lastname }}</div>
      </div>
    </div>
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeeAddInfo") }}
    </div>
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeePersonalInfo") }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    employee: {
      type: Object,
      required: true,
    },
  },
};
</script>
