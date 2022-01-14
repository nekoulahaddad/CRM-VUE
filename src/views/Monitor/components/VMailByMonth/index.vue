<template>
  <section class="mail-by-month">
    <div class="mail-by-month__header">
      <div class="mail-by-month__title">{{ $t("mailByMonth") }}</div>
    </div>

    <div class="mail-by-month__body">
      <div class="mail-by-month__managers mail-by-month__column managers">
        <div class="managers__inner">
          <div class="managers__title">
            {{ $t("managers") }}
          </div>
          <select class="managers__select form-select"></select>
        </div>
      </div>
      <div class="mail-by-month__column">1</div>
      <div class="mail-by-month__column">2</div>
      <div class="mail-by-month__column">3</div>
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
    position: relative;
    z-index: 10;
  }

  &__column {
    width: 216px;
    background-color: $color-white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    margin-bottom: 3px;

    & + * {
      margin-left: 10px;
    }
  }

  &__body {
    height: 113px;
    display: flex;
  }

  .managers {
    background-color: $color-white;
    width: 250px;

    &__inner {
      padding: 10px;
    }

    &__title {
      font-weight: 700;
      margin-bottom: 10px;
    }
  }
}
</style>
