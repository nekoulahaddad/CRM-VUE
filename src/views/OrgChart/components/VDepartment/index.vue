<template>
  <div class="department__empty" v-if="!node" />
  <div
    class="department"
    v-else-if="node.title"
    :style="{ marginBottom: globalHeight }"
  >
    <div class="department__inner">
      <!-- Боковая панель с иконками -->
      <div class="department__panel panel" v-if="showPanel">
        <div class="panel__icon">
          <img src="@/assets/icons/add_dep.svg" alt="" />
        </div>
        <div class="panel__icon">
          <img src="@/assets/icons/panel_employee.svg" alt="" />
        </div>
        <div class="panel__icon">
          <img src="@/assets/icons/panel_employees.svg" alt="" />
        </div>
        <div class="panel__icon">
          <img src="@/assets/icons/trash_icon.svg" alt="" />
        </div>
        <div class="panel__icon">
          <img
            alt=""
            src="@/assets/icons/panel_arrow_down.svg"
            @click="toggleShowPanel"
          />
        </div>
      </div>

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
        <div
          class="employees__bottom"
          :class="{ 'employees__bottom--opened': showEmployees }"
          :style="{ height: height }"
        >
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

      <!-- Количество сотрудников -->
      <div class="department__footer">
        <div
          class="department__counter"
          :class="{ 'department__counter--opened': showEmployees }"
          @click="toggleShowEmployees"
        >
          <span>{{ node.employees.length }} сотрудников</span>
          <img
            v-if="node.employees.length > 4"
            alt=""
            src="@/assets/icons/arrow_down_white.svg"
          />
        </div>
        <div class="department__menu">
          <img
            @click="toggleShowPanel"
            src="@/assets/icons/write_icon.svg"
            alt=""
          />
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
  data() {
    return {
      showEmployees: false,
      showPanel: false,
    };
  },
  computed: {
    rows() {
      return this.node.children.length;
    },
    gradientUrl() {
      return require(`@/assets/icons/gradient_${this.gradient}.svg`);
    },
    height() {
      return this.showEmployees ? "auto" : "74px";
    },
    globalHeight() {
      if (this.rows > 1) {
        return `${(this.rows - 1) * 232 + 10 * this.rows}px`;
      }
      return "auto";
    },
  },
  methods: {
    toggleShowEmployees() {
      this.showEmployees = !this.showEmployees;
    },
    toggleShowPanel() {
      this.showPanel = !this.showPanel;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";
.department__empty {
  width: 288px;
  min-height: 232px;
}

.department {
  width: 288px;
  min-height: 232px;
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
    overflow: hidden;
    justify-content: space-between;

    &--opened {
      padding-bottom: 30px;
    }
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
    user-select: none;
    cursor: pointer;
    transform: translateX(-50%);
    color: $color-white;
    background-color: $color-red;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    font-size: 12px;
    font-weight: 500;

    img {
      margin-left: 5px;
      transition: transform 0.1s ease;
    }

    &--opened {
      img {
        transform: rotate(180deg);
      }
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

  &__panel {
    width: 54px;
    min-height: 232px;
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background-color: $color-white;
    justify-content: space-evenly;
  }

  .panel {
    &__icon {
      position: relative;
      width: 54px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:not(:last-child)::after {
        content: "";
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        height: 2px;
        width: 44px;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
}
</style>
