<template>
  <div class="list__info list-info employee-list-info">
    <!-- Основная информация -->
    <div class="d-flex justify-content-between">
      <div class="group__title text--blue">
        {{ $t("pages.employee.employeeMainInfo") }}
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Должность:</div>
          <div class="group__value">{{ infoItem.role }}</div>
        </div>
      </div>

      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Отдел:</div>
          <div class="group__value">{{ infoItem.department.title }}</div>
        </div>
      </div>

      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Регион:</div>
          <div class="group__value">{{ infoItem.region.title }}</div>
        </div>
      </div>

      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Требования:</div>
          <div class="group__value">
            {{ infoItem.description.requirements }}
          </div>
        </div>
      </div>

      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Обязанности:</div>
          <div class="group__value">
            {{ infoItem.description.responsibilities }}
          </div>
        </div>
      </div>

      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Условия:</div>
          <div class="group__value">
            {{ infoItem.description.conditions }}
          </div>
        </div>
      </div>

      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-700">Ссылка:</div>
          <div class="group__value">
            {{ infoItem.link }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
  },
};
</script>
