<template>
  <section class="mail-by-month">
    <div class="mail-by-month__header">
      <div class="mail-by-month__title">{{ $t("mailByMonth") }}</div>
    </div>

    <div class="mail-by-month__body">
      <div class="mail-by-month__managers managers">
        <div class="managers__title">
          {{ $t("managers") }}
        </div>
        <select class="managers__select"></select>
      </div>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.mail-by-month {
  margin-top: 8px;

  &__title {
    width: 927px;
    height: 54px;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-color: $color-white;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
  }

  &__body {
    height: 100px;
  }

  .managers {
    background-color: $color-white;
    height: 100%;

    &__title {
      font-weight: 700;
      margin-bottom: 10px;
    }
  }
}
</style>
