<template>
  <div class="clients">
    <div class="clients__inner">
      <div class="clients__title">Новых клиентов:</div>
      <div class="clients__columns">
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <div class="column__icon"></div>
              <div class="column__title">Клиенты:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">2557</div>
            </div>
          </div>
        </div>
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <div class="column__icon"></div>
              <div class="column__title">Сотрудники:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">327</div>
            </div>
          </div>
        </div>
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <div class="column__icon"></div>
              <div class="column__title">Количество дел:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">540</div>
            </div>
          </div>
        </div>
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <div class="column__icon"></div>
              <div class="column__title">Загруженность работников:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">28%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.clients {
  margin-top: 10px;
  box-shadow: 0 3.5px 5.5px rgba(0, 0, 0, 0.02);
  margin-left: 11px;

  &__inner {
    background-color: $color-white;
    width: 489px;
    height: 162px;
    border-radius: $border-radius;
    padding: 17px 10px 18px;
  }

  &__columns {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-weight: 600;
  }

  .column {
    flex: 1;
    position: relative;
    padding-bottom: 10px;

    & + * {
      margin-left: 10px;
    }

    &::after {
      content: "";
      height: 2px;
      position: absolute;
      background-color: $color-red;
      border-radius: $border-radius;
      width: 100%;
      bottom: 0;
    }

    &__top {
      display: flex;
    }

    &__count {
      font-weight: 600;
      font-size: 16px;
    }
  }
}
</style>
