<template>
  <div class="list__info list-info">
    <!-- Основная информация -->
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
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeMail") }}
        </div>
        <div class="group__value">{{ employee.email || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeePhone") }}
        </div>
        <div class="group__value">{{ employee.phone || "" }}</div>
      </div>
    </div>

    <!-- Дополнительная информация -->
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeeAddInfo") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeDepartment") }}
        </div>
        <div class="group__value">{{ employee.department.title || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeSubDepartment") }}
        </div>
        <div class="group__value">{{ employee.sub_department || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeePosition") }}
        </div>
        <div class="group__value">{{ employee.position || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeePersonalNumber") }}
        </div>
        <div class="group__value">{{ employee.personal_number || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeRole") }}
        </div>
        <div class="group__value">{{ roles[employee.role] || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeEducation") }}
        </div>
        <div class="group__value">{{ employee.education || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeSpeciality") }}
        </div>
        <div class="group__value">{{ employee.specialty || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeEmploymentDate") }}
        </div>
        <div class="group__value">
          {{ transformDate(employee.employment_date) }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeRegion") }}
        </div>
        <div class="group__value">{{ employee.region.title || "" }}</div>
      </div>
    </div>

    <!-- Личная информация -->
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeePersonalInfo") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeBirthDay") }}
        </div>
        <div class="group__value">
          {{ transformDate(employee.date_of_birth) }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeZodiak") }}
        </div>
        <div class="group__value">{{ employee.zodiac_sign || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeElement") }}
        </div>
        <div class="group__value">{{ employee.element || "" }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.employee.employeeChineseYear") }}
        </div>
        <div class="group__value">{{ employee.chinese_year || "" }}</div>
      </div>
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
  data() {
    return {
      roles: {
        director: "Директор",
        admin: "Администратор",
        content: "Контент-менеджер",
        manager: "Менеджер по работе с клиентами",
        seo: "SEO-оптимизатор",
        call: "Сотрудник Call - центра",
        worker: "Сотрудник",
        buyer: "Закупщик",
      },
    };
  },
};
</script>
