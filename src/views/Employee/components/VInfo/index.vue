<template>
  <div class="list__info list-info employee-list-info">
    <!-- Основная информация -->
    <div class="d-flex justify-content-between form-top">
      <div class="form-top__left">
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
      </div>
      <div class="form-top__right">
        <span class="text text--blue text--bold-700">Фото:</span>
        <div
          :class="{
            'employee-photo__empty':
              !employee || (employee && employee.avatar === 'Выбрать файл'),
            'employee-photo__edit': employee && avatar === 'Выбрать файл',
          }"
        >
          <img
            alt=""
            @click="photoFull = !photoFull"
            :src="
              employee && employee.avatar === 'Выбрать файл'
                ? url
                : employee && avatar === 'Выбрать файл'
                ? `${serverAddr + employee.avatar}`
                : url
            "
          />
        </div>
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
      date: new Date().toString(),
      employment_date: new Date().toString(),
      date_of_birth: new Date().toString(),
      users: [],
      regions: [],
      department: null,
      role: null,
      photoFull: false,
      education: null,
      specialty: null,
      zodiac_sign: null,
      element: null,
      chinese_year: null,
      departments: [],
      children: [],
      avatar: "Выбрать файл",
      passport_photo: ["Выбрать файлы"],
      url: require("@/assets/icons/new_avatar.svg"),
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-list-info {
  background-color: $color-white;

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

  .employee-photo {
    display: flex;
    align-items: end;
    justify-content: end;

    span {
      font-weight: 700;
      font-size: 14px;
      margin-right: 10px;
    }

    &__upload {
      display: flex;
      justify-content: end;
    }

    &__empty {
      width: 220px;
      height: 303px;
      background-color: $color-gray-secondary;
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(0, 0, 0, 0.3);
      margin-left: 10px;

      img {
        max-width: 100%;
      }
    }

    &__edit {
      width: 220px;
      height: 303px;

      img {
        max-width: 100%;
        border-radius: $border-radius;
      }
    }
  }

  .d-flex {
    margin-bottom: 10px;
  }

  .form-top {
    &__right {
      display: flex;
      align-items: end;
    }
  }
}
</style>
