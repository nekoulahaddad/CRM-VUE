<template>
  <div class="top-blocks">
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">{{ $t("sales_today") }}</div>
        <div class="top-block__value">
          {{
            rev.today
              ? new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(rev.today)
              : "0 ₽"
          }}
        </div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/card.svg" alt="" />
      </div>
    </div>
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">Количество посетителей за сегодня:</div>
        <div class="top-block__value">300</div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/world.svg" alt="" />
      </div>
    </div>
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">
          Количество новых клиентов за текущий месяц:
        </div>
        <div class="top-block__value">+52</div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/doc.svg" alt="" />
      </div>
    </div>
    <div class="top-blocks__item top-block">
      <div class="top-block__left">
        <div class="top-block__title">Продажи за текущий месяц:</div>
        <div class="top-block__value">
          {{
            rev.today
              ? new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(rev.month)
              : "0 ₽"
          }}
        </div>
      </div>
      <div class="top-block__right">
        <img src="@/assets/icons/cart_big.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rev: {
      type: Object,
    },
  },
  data() {
    return {
      info: [],
    };
  },
  watch: {
    rev() {},
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.top-blocks {
  display: flex;
  width: 1307px;

  &__item {
    background: $color-white;
    border-radius: $border-radius;
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 13px;
    padding-right: 7px;
    justify-content: space-between;
  }

  .top-block {
    font-weight: 600;

    & + * {
      margin-left: 10px;
    }

    &__title {
      color: #c4c4c4;
      margin-bottom: 5px;
    }
  }
}
</style>
