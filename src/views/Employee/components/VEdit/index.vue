<template>
  <div class="list__info list-info employee-edit-form">
    <form @submit.prevent="">
      <div class="group__title text--blue">
        {{ $t("pages.employee.employeeMainInfo") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("lastName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('lastName')"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("firstName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('firstName')"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("middleName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('middleName')"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("mail") }}</div>
        <div class="group__content">
          <input type="text" class="form-control" :placeholder="$t('mail')" />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("phone") }}</div>
        <div class="group__content">
          <input type="text" class="form-control" :placeholder="$t('phone')" />
        </div>
      </div>
      <div class="group__title text--blue">
        {{ $t("pages.employee.employeeAddInfo") }}
      </div>
      <div class="group__title text--blue">
        {{ $t("pages.employee.employeePersonalInfo") }}
      </div>
      <div class="group__title text--blue">
        {{ $t("childs") }}
      </div>
      <div class="group__title text--blue">
        {{ $t("another") }}
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  .group {
    max-width: 976px;

    select {
      max-width: 401px;
    }
  }
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
}
</style>
