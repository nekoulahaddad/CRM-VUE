<template>
  <div :class="containerClasses">
    <div class="dropdown" v-if="dropDown && item && dropDown._id === item._id">
      <a @click.prevent href="">Добавить подразделения</a>
      <a @click.prevent href="">Выбор директора</a>
      <img
        alt=""
        src="@/assets/icons/close_icon.svg"
        class="close"
        @click="toggleDropDown(item)"
      />
    </div>
    <div class="department__container--hline" v-if="level > 1 && false"></div>
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
        <!-- Показать подотделы -->
        <div class="table__icon">
          <template v-if="item.children.length">
            <VueCustomTooltip
              label="Показать подотделы"
              v-if="!departmentItem.includes(item._id)"
            >
              <img
                alt=""
                @click="$emit('toggleShowDepartment', item)"
                src="@/assets/icons/sub_deps.svg"
              />
            </VueCustomTooltip>
            <VueCustomTooltip v-else label="Скрыть разделы">
              <img
                alt=""
                @click="$emit('toggleShowDepartment', item)"
                src="@/assets/icons/arrow_top_white_icon.svg"
              />
            </VueCustomTooltip>
          </template>
          <img
            alt=""
            v-else
            class="opacity-30"
            src="@/assets/icons/sub_deps.svg"
          />
        </div>
        <!-- Показать сотрудников -->
        <div class="table__icon">
          <template v-if="item.employees.length">
            <VueCustomTooltip
              v-if="!employeeItem.includes(item._id)"
              label="Показать сотрудников"
            >
              <img
                alt=""
                @click="$emit('toggleShowEmployees', item)"
                src="@/assets/icons/manager-white.svg"
              />
            </VueCustomTooltip>
            <VueCustomTooltip v-else label="Скрыть сотрудников">
              <img
                alt=""
                @click="$emit('toggleShowEmployees', item)"
                src="@/assets/icons/arrow_top_white_icon.svg"
              />
            </VueCustomTooltip>
          </template>
          <img
            alt=""
            v-else
            class="opacity-30"
            src="@/assets/icons/manager-white.svg"
          />
        </div>
        <div class="table__icon">
          <img
            alt=""
            @click="toggleDropDown(item)"
            src="@/assets/icons/white_dots.svg"
          />
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Удалить" v-if="role === 'superadmin'">
            <img
              @click="$emit('deleteItem', item)"
              src="@/assets/icons/trash_icon_white.svg"
              alt=""
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            class="opacity-30"
            src="@/assets/icons/trash_icon_white.svg"
          />
        </div>
      </div>
    </div>

    <div
      class="department__item-inner"
      v-if="
        departmentItem.includes(item._id) || employeeItem.includes(item._id)
      "
    >
      <!-- Список подотделов -->
      <template
        v-if="item.children.length && departmentItem.includes(item._id)"
      >
        <template v-for="(child, index) in item.children">
          <div
            class="department__container--vline"
            :style="{ height: `${item.children.length * 58 - 16}px` }"
            v-if="index === item.children.length - 1 && false"
          />
          <v-item
            :level="level + 1"
            :item="child"
            :role="role"
            :users="users"
            :dropDown="dropDown"
            :employeeItem="employeeItem"
            :departmentItem="departmentItem"
            @updateBranch="updateBranch"
            @toggleShowEmployees="toggleShowEmployees"
            @toggleShowDepartment="toggleShowDepartment"
            @toggleDropDown="toggleDropDown"
          />
        </template>
      </template>

      <!-- Список сотрудников -->
      <div
        class="list"
        v-if="item.employees.length && employeeItem.includes(item._id)"
      >
        <div class="text text--blue">Сотрудники:</div>
        <div
          v-for="employee in item.employees"
          :key="employee._id"
          class="list__row list__row--shadow list__row--white"
        >
          <div
            class="list__columns list__body list__columns--shadow order-list-columns list__columns--white"
          >
            <div class="list__column">
              {{ transformFIO(employee) }}
            </div>
          </div>
        </div>
        <template v-if="addEmployee">
          <div class="text" style="font-size: 16px">Выберите сотрудника:</div>
          <v-select
            :options="
              users.map((item) => ({
                label: this.transformFIO(item),
                value: item,
              }))
            "
            @input="setUser"
          />
        </template>
        <v-button @click="addEmployee = true" v-if="!addEmployee" red>
          Добавить сотрудника
        </v-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VItem",
  props: {
    dropDown: Object,
    departmentItem: Array,
    employeeItem: Array,
    role: String,
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
    users: Array,
  },
  data() {
    return {
      addEmployee: false,
    };
  },
  methods: {
    updateBranch() {
      this.$emit("updateBranch");
      this.addEmployee = false;
    },
    setUser(user) {
      this.item["employees"].push(user.value);
      this.updateBranch();
    },
    toggleShowDepartment(item) {
      this.$emit("toggleShowDepartment", item);
    },
    toggleShowEmployees(item) {
      this.$emit("toggleShowEmployees", item);
    },
    lineHeight(count) {
      return `100%`;
    },
    toggle(id) {
      this.$emit("toggleOpened", id);
    },
    toggleDropDown(item) {
      this.$emit("toggleDropDown", item);
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
  border-radius: $border-radius;
  position: relative;

  &--hline {
    position: absolute;
    width: 20px;
    top: 24px;
    left: -8px;
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
  .dropdown {
    position: absolute;
    right: 55px;
    top: 25px;
    z-index: 100;
    width: 249px;
    padding: 11px 14px 10px;
    height: 64px;
    border-radius: $border-radius;
    background-color: $color-white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);

    .close {
      position: absolute;
      top: 10px;
      right: 9px;
    }

    span {
      display: block;
      font-size: 14px;
      font-weight: 500;
      height: 21px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.3);
    }

    a {
      display: block;
      font-size: 14px;
      font-weight: 500;
      width: 200px;
      position: relative;
      cursor: pointer;
      height: 21px;
      line-height: 21px;

      &:hover {
        color: $color-red;
      }
    }
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
.department__item-inner {
  padding-left: 15px;
  position: relative;

  .department__container--vline {
    width: 6px;
    top: -12px;
    left: 5px;
    border-radius: $border-radius;
    background-color: #000;
    position: absolute;
  }
  button {
    width: 250px;
  }
}
</style>
