<template>
  <div class="clients">
    <div class="clients__inner">
      <div class="clients__title">Новых клиентов:</div>
      <div class="clients__columns">
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <div class="column__icon">
                <img src="@/assets/icons/clients_all.svg" alt="" />
              </div>
              <div class="column__title">Клиенты:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">{{ clientCount }}</div>
            </div>
          </div>
        </div>
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <div class="column__icon">
                <img src="@/assets/icons/employee_all.svg" alt="" />
              </div>
              <div class="column__title">Сотрудники:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">{{ employeeCount }}</div>
            </div>
          </div>
        </div>
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <img src="@/assets/icons/cart_all.svg" alt="" />
              <div class="column__icon"></div>
              <div class="column__title">Количество дел:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">{{ taskCount }}</div>
            </div>
          </div>
        </div>
        <div class="clients__column column">
          <div class="column__inner">
            <div class="column__top">
              <img src="@/assets/icons/settings_small.svg" alt="" />
              <div class="column__icon"></div>
              <div class="column__title">Загруженность работников:</div>
            </div>
            <div class="column__bottom">
              <div class="column__count">{{ workload }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clientCount: Number,
    employeeCount: Number,
    taskCount: Number,
    workload: {
      type: Number,
      required: true,
      default: 0,
    },
  },
};
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__columns {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-weight: 600;
    margin-bottom: 10px;
  }

  .column {
    position: relative;
    padding-bottom: 10px;
    text-align: center;

    & + * {
    }

    &::after {
      content: "";
      height: 3px;
      position: absolute;
      background-color: $color-red;
      border-radius: $border-radius;
      width: 85%;
      bottom: 0;
      left: 10px;
      right: 0;
    }

    &__top {
      display: flex;
    }

    &__bottom {
      margin-top: 5px;
    }

    &__count {
      font-weight: 600;
      font-size: 16px;
    }

    &__title {
      font-size: 12px;
      font-weight: 600;
      position: relative;
      top: 3px;
    }
  }
}
</style>
