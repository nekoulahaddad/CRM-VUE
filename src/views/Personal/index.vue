<template>
  <div class="page personal-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/personal_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("personalArea") }}</h1>
    </div>
    <div class="page__body">
      <div class="personal-area">
        <div class="personal-area__header">
          {{ transformFIO(user) }}, {{ $t("welcome") }}
        </div>
        <div class="personal-area__body">{{ transformRole(user.role) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user: {
      get: function () {
        return this.getUserRole();
      },
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.personal-area {
  &__header {
    background-color: $color-gray-secondary;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    height: 56px;
    line-height: 56px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: 700;
    font-size: 18px;
  }

  &__body {
    background-color: $color-white;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    padding: 20px;
  }
}
</style>
