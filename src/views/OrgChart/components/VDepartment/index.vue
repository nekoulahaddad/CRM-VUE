<template>
  <div class="department" v-if="node.title">
    <div class="department__inner">
      <div class="department__title department__title--center">
        {{ node.title }}
      </div>
      <div class="department__director director">
        <div class="director__inner">
          <template v-if="node.directors && node.directors.length">
            <div v-for="director in node.directors" class="director__item">
              <div class="director__name">{{ transformFIO(director) }}</div>
              <div class="director__position">{{ director.position }}</div>
            </div>
          </template>
          <div class="director__name" v-else>Список директоров пуст</div>
        </div>

        <!-- Градиент -->
        <img alt="" class="department__gradient" :src="gradientUrl" />
      </div>

      <!-- Сотрудники -->
      <div class="department__employees employees">
        <div class="employees__top">
          <div class="department__title">Сотрудники:</div>
        </div>
        <div class="employees__bottom" :style="{ height: height }">
          <div
            class="department__employee"
            v-for="(employee, index) in node.employees"
            :key="index"
          >
            <img
              alt=""
              v-if="!employee.avatar || employee.avatar === 'Выбрать файл'"
              src="@/assets/icons/org_employee.svg"
            />
            <img
              alt=""
              v-else
              width="60px"
              height="60px"
              :src="employee.avatar"
            />
          </div>
        </div>
      </div>
      <div class="department__footer">
        <div class="department__counter">
          <span>{{ node.employees.length }} сотрудников</span>
          <img src="@/assets/icons/arrow_down_white.svg" alt="" />
        </div>
        <div class="department__menu">
          <img src="@/assets/icons/write_icon.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    gradient: String,
  },
  computed: {
    gradientUrl() {
      return require(`@/assets/icons/gradient_${this.gradient}.svg`);
    },
    height() {
      return `74px`;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.department {
  width: 288px;
  height: 232px;
  background-color: $color-white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
  border-radius: $border-radius;
  position: relative;

  &__inner {
    padding-left: 10px;
    padding-right: 10px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    margin-top: 7px;
    margin-bottom: 7px;

    &--center {
      text-align: center;
    }
  }

  &__director {
    position: relative;
    height: 60px;
    color: $color-white;

    img {
      left: -20px;
      top: 0;
      position: absolute;
    }
  }

  &__employees {
    margin-top: 20px;
  }

  .employees__bottom {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 10px;
    overflow: hidden;
    justify-content: space-between;
  }

  &__employee {
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    width: 57px;
    height: 66px;
    margin: 4px;

    img {
      border-radius: $border-radius;
    }
  }

  &__counter {
    min-width: 124px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    color: $color-white;
    background-color: $color-red;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    font-size: 12px;
    font-weight: 500;

    img {
      margin-left: 5px;
    }
  }

  &__menu {
    opacity: 0.3;
    position: absolute;
    right: 10px;
    bottom: -2px;
  }

  .director {
    &__inner {
      position: relative;
      z-index: 10;
      padding-top: 8px;
    }

    &__name {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    &__position {
      font-size: 12px;
    }
  }
}
</style>
