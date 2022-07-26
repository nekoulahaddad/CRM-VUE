<template>
  <div :class="containerClasses">
    <div
      class="dropdown"
      v-if="
        dropDown &&
        item &&
        dropDown._id &&
        dropDown._id === item._id &&
        role === 'superadmin'
      "
    >
      <a @click.prevent="toggleAddDepartment(item)" href="">
        Добавить подразделения
      </a>
      <a @click.prevent="toggleAddDirector(item)" href="">Выбор директора</a>
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
        <div class="table__icon" v-if="addDepartmentItem.includes(item._id)">
          <VueCustomTooltip label="Скрыть добавление подразделения">
            <img
              alt=""
              @click="toggleAddDepartment(item)"
              src="@/assets/icons/arrow_top_white_icon.svg"
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon" v-if="addDirectorItem.includes(item._id)">
          <VueCustomTooltip label="Скрыть выбор директора">
            <img
              alt=""
              @click="toggleAddDirector(item)"
              src="@/assets/icons/arrow_top_white_icon.svg"
            />
          </VueCustomTooltip>
        </div>
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
        <div class="table__icon" v-if="role === 'superadmin'">
          <img
            alt=""
            @click="toggleDropDown(item)"
            src="@/assets/icons/white_dots.svg"
          />
        </div>
        <div class="table__icon" v-if="role === 'superadmin'">
          <VueCustomTooltip label="Удалить">
            <img
              @click="deleteItem(item)"
              src="@/assets/icons/trash_icon_white.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
      </div>
    </div>

    <div
      class="department__item-inner"
      v-if="
        departmentItem.includes(item._id) ||
        employeeItem.includes(item._id) ||
        addDirectorItem.includes(item._id) ||
        addDepartmentItem.includes(item._id)
      "
    >
      <!-- Выбор директора -->
      <div class="add-director" v-if="addDirectorItem.includes(item._id)">
        <div class="text text--blue">Выбор директора:</div>
        <div class="list-info__group group">
          <div class="group__content">
            <div class="group__item text--bold-700">Текущий директор:</div>
            <div class="group__value">
              {{
                Array.isArray(item.directors) &&
                item.directors[0] &&
                transformFIO(item.directors[0])
              }}
            </div>
          </div>
        </div>
        <v-select
          :options="
            users.map((item) => ({
              label: this.transformFIO(item),
              value: item,
            }))
          "
          @input="setDirector"
        />
        <v-button @click="addDirector" :disabled="!director._id" red>
          Сохранить
        </v-button>
      </div>

      <!-- Добавить подразделение -->
      <div class="add-director" v-if="addDepartmentItem.includes(item._id)">
        <div class="text text--blue">Добавить подразделение:</div>
        <v-select
          :options="
            departments.map((item) => ({
              label: item.title,
              value: item,
            }))
          "
          @input="setDepartment"
        />
        <v-button @click="addDepartment" :disabled="!department._id" red>
          Сохранить
        </v-button>
      </div>

      <!-- Список подотделов -->
      <template
        v-if="item.children.length && departmentItem.includes(item._id)"
      >
        <template v-for="(child, index) in item.children">
          <div
            class="department__container--vline"
            :style="{ height: `${item.children.length * 58 - 16}px` }"
            v-if="index === item.children.length - 1 && false"
				:key="index"
          />
          <v-item
            :level="level + 1"
            :item="child"
            :role="role"
            :users="users"
            :dropDown="dropDown"
            :employeeItem="employeeItem"
            :departmentItem="departmentItem"
            :addDirectorItem="addDirectorItem"
            :addDepartmentItem="addDepartmentItem"
            :departments="departments"
            :orgTree="orgTree"
            @deleteItem="deleteItem"
            @updateBranch="updateBranch"
            @toggleShowEmployees="toggleShowEmployees"
            @toggleShowDepartment="toggleShowDepartment"
            @toggleDropDown="toggleDropDown"
            @toggleAddDirector="toggleAddDirector"
            @toggleAddDepartment="toggleAddDepartment"
          />
        </template>
      </template>

      <!-- Список сотрудников -->
      <div
        class="list"
        v-if="item.employees.length && employeeItem.includes(item._id)"
      >
        <div class="text text--blue">Сотрудники:</div>
        <div class="list__header">
          <div class="list__columns">
            <div class="list__column">Ф.И.О:</div>
            <div class="list__column d-flex justify-center">Должность:</div>
          </div>
        </div>
        <div
          v-for="employee in item.employees"
          :key="employee._id"
          class="list__row list__row--shadow list__row--white"
          :class="{ 'list__row--opened': employee._id === infoEmployee.id }"
        >
          <div
            class="
              list__columns list__body list__columns--shadow
              order-list-columns
              list__columns--white
            "
          >
            <div class="list__column">
              {{ transformFIO(employee) }}
            </div>
            <div class="list__column">
              <div class="bg bg--blue-light" v-if="employee.position">
                {{ employee.position }}
              </div>
            </div>

            <div class="list__column">
              <div
                :style="{ overflow: 'visible' }"
                class="bg"
                v-if="employee.position"
              >
                <div class="list__column">
                  <div class="table__actions">
                    <div class="table__icon">
                      <VueCustomTooltip
                        v-if="employee._id !== infoEmployee.id"
                        label="Просмотр"
                        background="blue"
                      >
                        <img
                          alt=""
                          src="@/assets/icons/info_icon.svg"
                          @click="setVisibleInfoEmployee(true, employee._id)"
                        />
                      </VueCustomTooltip>
                      <img
                        alt=""
                        src="@/assets/icons/arrow_top_icon.svg"
                        @click="setVisibleInfoEmployee(false, null)"
                        v-else
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-info
            v-if="infoEmployee.visible && employee._id === infoEmployee.id"
            :role="role"
            :employee="employee"
          />
        </div>

        <template v-if="addEmployee">
          <div class="text text--blue" style="font-size: 16px">
            Выберите сотрудника:
          </div>
          <v-select
            :options="
              users.map((item) => ({
                label: this.transformFIO(item),
                value: item,
              }))
            "
            @input="setUser"
          />
          <v-button @click="addUser" :disabled="!user._id" red>
            Сохранить
          </v-button>
        </template>
        <v-button
          @click="addEmployee = true"
          v-if="!addEmployee && role === 'superadmin'"
          red
        >
          Добавить сотрудника
        </v-button>
      </div>
    </div>
  </div>
</template>

<script>
import VInfo from "../VInfo/VInfo.vue";

export default {
  name: "v-item",
  components: { VInfo },
  props: {
    addDepartmentItem: Array,
    dropDown: Object,
    departments: Array,
    addDirectorItem: Array,
    departmentItem: Array,
    employeeItem: Array,
    role: String,
    line: Boolean,
    hLine: Boolean,
    orgTree: Object,
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
      infoEmployee: {
        visible: false,
        id: null,
      },
      department: {},
      director: {},
      user: {},
    };
  },
  methods: {
    async addDirector() {
      if (!this.director._id) {
        this.$toast.error("Вы не выбрали директора!");
        return;
      }

      this.item["directors"] = [this.director];

      try {
        this.updateBranch();
        this.$toast.success("Директор успешно выбран!");
        this.toggleAddDirector(this.item);
        this.director = {};
      } catch (e) {
        this.$toast.error("Не удалось выбрать директора!");
      }
    },
    async addDepartment() {
      if (!this.department._id) {
        this.$toast.error("Вы не выбрали подразделение!");
        return;
      }

      this.item["children"].push({
        _id: this.department._id,
        title: this.department.title,
        parentId: this.item._id,
        children: [],
        directors: [],
        employees: [],
      });

      try {
        await this.updateBranch();
        this.$toast.success("Подразделение успешно добавлено!");
        this.toggleAddDepartment(this.item);
        this.department = {};
      } catch (e) {
        this.$toast.error("Не удалось добавить подразделение!");
      }
    },
    setVisibleInfoEmployee(bool, id) {
      this.infoEmployee = {
        visible: bool,
        id,
      };
    },
    addUser() {
      const userFind = this.item["employees"].find(
        (e) => e._id === this.user._id
      );

      if (userFind) {
        this.$toast.error("Сотрудник уже присутствует в выбранном отделе!");
        return;
      }

      this.item["employees"].push(this.user);

      try {
        this.updateBranch();
        this.$toast.success("Сотрудник успешно добавлен!");
        this.user = {};
      } catch (e) {
        this.$toast.error("Не удалось добавить сотрудника!");
      }
    },
    updateBranch() {
      this.$emit("updateBranch");
      this.addEmployee = false;
    },
    setDirector(user) {
      this.director = user.value;
    },
    setUser(user) {
      this.user = user.value;
    },
    setDepartment(item) {
      this.department = item.value;
    },
    toggleAddDepartment(item) {
      this.$emit("toggleAddDepartment", item);
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
    deleteItem(item) {
      this.$emit("deleteItem", item);
    },
    toggle(id) {
      this.$emit("toggleOpened", id);
    },
    toggleAddDirector(item) {
      this.$emit("toggleAddDirector", item);
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
.add-director {
  padding-bottom: 10px;

  .v-select {
    margin-top: 10px;
  }
  button {
    margin-top: 10px;
  }
}
.vs__selected {
  width: 90% !important;
}
</style>
