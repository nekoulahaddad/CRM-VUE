<template>
  <div :class="containerClasses">
    <div :class="classes">
      <span class="item__title">
        {{ item.title }} ({{
          getEmployeeCount(item.employees.length, [
            "сотрудник",
            "сотрудника",
            "сотрудников",
          ])
        }})
      </span>
      <div class="table__actions">
        <div class="table__icon" v-if="item.children.length">
          <VueCustomTooltip
            label="Показать разделы"
            v-if="!openedItems.includes(item._id)"
          >
            <img
              alt=""
              @click="toggle(item._id)"
              src="@/assets/icons/sub_deps.svg"
            />
          </VueCustomTooltip>
          <VueCustomTooltip v-else label="Скрыть разделы">
            <img
              alt=""
              @click="toggle(item._id)"
              src="@/assets/icons/arrow_top_white_icon.svg"
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <img src="@/assets/icons/white_dots.svg" alt="" />
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Удалить">
            <img
              @click="$emit('deleteItem', item)"
              src="@/assets/icons/trash_icon_white.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
      </div>
    </div>

    <template v-if="openedItems.includes(item._id) && item.children.length">
      <div class="department__container-inner">
        <v-item
          :level="level + 1"
          v-for="child in item.children"
          :item="child"
          :opened="openedItems.includes(child._id)"
          :openedItems="openedItems"
          @toggleOpened="toggle"
        />

        <div class="list" v-if="item.employees && item.employees.length">
          <div class="text text--blue">Сотрудники:</div>
          <div
            v-for="(employee, index) in item.employees"
            :key="employee._id"
            class="list__row list__row--shadow list__row--white"
          >
            <div
              class="list__columns list__body list__columns--shadow order-list-columns list__columns--white"
            >
              <div class="list__column list__column--number">123</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "VItem",
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
    line: Boolean,
    hLine: Boolean,
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    openedItems: Array,
  },
  methods: {
    lineHeight(count) {
      return `100%`;
    },
    toggle(id) {
      this.$emit("toggleOpened", id);
    },
    getEmployeeCount(value, words) {
      value = Math.abs(value) % 100;
      let num = value % 10;
      if (value > 10 && value < 20) return value + " " + words[2];
      if (num > 1 && num < 5) return value + " " + words[1];
      if (num === 1) return value + " " + words[0];
      return value + " " + words[2];
    },
  },
  computed: {
    containerClasses() {
      return {
        department__container: true,
        [`department__container--level-${this.level}`]: true,
        "department__container--has-child": !!this.item.children.length,
        "department__container--opened": this.opened,
      };
    },
    classes() {
      return {
        item: true,
        department__item: true,
        "department__item--line": this.line,
        [`department__item--level-${this.level}`]: true,
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.item {
  cursor: auto !important;
}

.department__container {
  position: relative;
  border-radius: $border-radius;

  &--hLine {
    position: absolute;
    width: 20px;
    top: 24px;
    left: -12px;
    border-radius: 15px;
    height: 6px;
    background-color: $color-black;
  }

  &--vLine {
    position: absolute;
    width: 6px;
    left: 8px;
    background-color: $color-black;
  }

  &--opened {
    padding-bottom: 5px;
    margin-bottom: 10px;

    .department__container--vLine {
      bottom: 34px;
    }
  }

  &--level-1,
  &--level-2,
  &--level-3,
  &--level-4 {
    background-color: $color-white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-bottom-right-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
  }

  &--level-2 {
    width: 1570px;
  }
  &--level-3 {
    width: 1550px;
  }
  &--level-4 {
    width: 1530px;
  }

  .text {
    font-weight: 700;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .text--blue {
    font-size: 16px;
  }
}

.department__item {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  color: $color-white;
  height: 48px;
  position: relative;
  margin-bottom: 10px;

  &--level-1 {
    height: 80px;
    background: linear-gradient(45deg, #db1f35, #ff747a);
  }

  &--level-2 {
    background: linear-gradient(90deg, #ff747a, #6f2b8b);
  }

  &--level-3 {
    background: linear-gradient(90deg, #ff747a, #029faf);
  }

  &--level-4 {
    background: linear-gradient(90deg, #ff747a, #033e7d);
  }

  &--line:before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 6px;
    background-color: $color-black;
    left: -12px;
  }
  .vue-custom-tooltip.is-top:before {
    display: none;
  }
}
.department__container-inner {
  padding-left: 10px;
}
</style>
