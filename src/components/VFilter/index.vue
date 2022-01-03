<template>
  <div class="page__buttons" v-if="type === 'education'">
    <v-button
      :red="activeIndex === 0"
      :white="activeIndex !== 0"
      @click="selectOptions($event, 0, 'education', 'crm')"
    >
      CRM
    </v-button>
    <v-button
      :red="activeIndex === 1"
      :white="activeIndex !== 1"
      @click="selectOptions($event, 1, 'education', 'shop')"
    >
      Интернет-магазин
    </v-button>
    <v-button
      :red="activeIndex === 2"
      :white="activeIndex !== 2"
      @click="selectOptions($event, 2, 'education', 'lpa')"
    >
      ЛНА
    </v-button>
    <v-button
      :red="activeIndex === 3"
      :white="activeIndex !== 3"
      @click="selectOptions($event, 3, 'education', 'price')"
    >
      Прайс-лист
    </v-button>
  </div>
  <div v-else class="filter">
    <div class="filter__inner">
      <div class="filter__header">
        <div class="filter__title">Фильтр</div>
      </div>
      <div class="filter__body">
        <template v-if="type === 'group'">
          <div class="filter__body">
            <div class="filter__group group">
              <div class="group__title">Регионы:</div>
              <div class="group__content">
                <select
                  class="form-select"
                  @change="selectOptions($event, null, 'region', null)"
                  :value="filterOptions.region"
                >
                  <option selected value="all">Все регионы</option>
                  <option v-for="item in regions" :value="item.value">
                    {{ item.title }}
                  </option>
                </select>
              </div>
            </div>
            <div class="filter__group group">
              <div class="group__title">Отделы:</div>
              <div class="group__content">
                <select
                  class="form-select"
                  @change="selectOptions($event, null, 'department')"
                  :value="
                    filterOptions.department ? filterOptions.department : 'all'
                  "
                >
                  <option v-for="item in info" :value="item.value">
                    {{ item.title }}
                  </option>
                </select>
              </div>
            </div>
            <div class="filter__actions">
              <button @click="clearOptions" class="btn btn--red filter__btn">
                Очистить
              </button>
            </div>
          </div>
        </template>

        <!-- Клиенты -->
        <template v-else-if="type === 'clients'">
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select @change="selectOptions" class="form-select">
                <option value="all" selected>Все регионы</option>
                <option
                  v-for="region in regions"
                  :key="region.id"
                  @change="selectOptions($event, null, 'region', null)"
                  class="form-select"
                  :value="region.value"
                >
                  {{ region.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Сортировка:</div>
            <div class="group__content">
              <select
                @change="selectOptions($event, 0, 'orders', null)"
                class="form-select"
              >
                <option selected value="clients">Интернет-магазин</option>
                <option value="corporates">Корпоративные</option>
              </select>
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!-- Mango -->
        <template v-else-if="type === 'mango'">
          <div class="filter__group group">
            <div class="group__title">Дата:</div>
            <div class="group__content">
              <select class="form-select">
                <option value="Все задачи">Выберите дату</option>
              </select>
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!-- Закупка -->
        <template v-else-if="type === 'purchase'">
          <div class="filter__group group">
            <div class="group__title">Период:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
              >
                <option selected value="Все задачи">Все время</option>
                <option v-for="item in dates" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Автор:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите автора задачи..."
              />
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите исполнителя задачи..."
              />
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Статусы:</div>
            <div class="group__content">
              <select
                class="form-select"
                :value="filterOptions.status ? filterOptions.status : 'all'"
                @change="selectOptions($event, null, 'status', null)"
              >
                <option selected value="all">Все статусы</option>
                <option value="true">Обработана</option>
                <option value="false">Не обработана</option>
              </select>
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <template v-else-if="type === 'callCenterIssues'">
          <div class="filter__group group">
            <div class="group__title">Период:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
              >
                <option selected value="Все задачи">Все время</option>
                <option v-for="item in dates" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Автор:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите автора задачи..."
              />
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите исполнителя задачи..."
              />
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Статусы:</div>
            <div class="group__content">
              <select
                class="form-select"
                :value="filterOptions.status ? filterOptions.status : 'all'"
                @change="selectOptions($event, null, 'status', null)"
              >
                <option selected value="all">Все статусы</option>
                <option value="true">Обработана</option>
                <option value="false">Не обработана</option>
              </select>
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <template v-else-if="type === 'callbacks'">
          <div class="filter__group group">
            <div class="group__title">Период:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
              >
                <option selected value="Все задачи">Все время</option>
                <option v-for="item in dates" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Статус заказа:</div>
            <div class="group__content">
              <select
                class="form-select"
                :value="filterOptions.status ? filterOptions.status : 'all'"
                @change="selectOptions($event, null, 'status', null)"
              >
                <option selected value="all">Все статусы</option>
                <option value="true">Обработана</option>
                <option value="false">Не обработана</option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Тип заявки:</div>
            <div class="group__content">
              <select class="form-select">
                <option value="Все задачи">Все типы</option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Менеджеры:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите менеджера"
              />
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!-- Задачи -->
        <template v-else-if="type === 'tasks'">
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Отделы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'department')"
                :value="
                  filterOptions.department ? filterOptions.department : 'all'
                "
              >
                <option v-for="item in info" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите исполнителя задачи..."
              />
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Автор:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите автора задачи..."
              />
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!-- Поставщики -->
        <template v-else-if="type === 'providers'">
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!-- Отчеты -->
        <template v-else-if="type === 'reports'">
          <div class="filter__group group">
            <div class="group__title">Дата:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
              >
                <option selected value="Все задачи">Все время</option>
                <option v-for="item in dates" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Отделы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'department')"
                :value="
                  filterOptions.department ? filterOptions.department : 'all'
                "
              >
                <option v-for="item in info" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите исполнителя задачи..."
              />
            </div>
          </div>

          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!-- Заказы -->
        <template v-else-if="type === 'orders'">
          <div class="filter__group group">
            <div class="group__title">Форма продажи:</div>
            <div class="group__content">
              <select class="form-select">
                <option value="Все задачи">B2B</option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Период:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
              >
                <option selected value="Все задачи">Все время</option>
                <option v-for="item in dates" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item.value">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Статус заказа:</div>
            <div class="group__content">
              <select
                class="form-select"
                :value="filterOptions.status ? filterOptions.status : 'all'"
                @change="selectOptions($event, null, 'status', null)"
              >
                <option selected value="all">Все статусы</option>
                <option value="true">Обработана</option>
                <option value="false">Не обработана</option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Менеджеры:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите менеджера"
              />
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!--  -->

        <!-- Товары -->
        <template v-else-if="type === 'goods'">
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'regionButtons', null)"
              >
                <option selected value="all">Все регионы</option>
                <option v-for="item in regions" :value="item._id">
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>
      </div>
    </div>

    <div v-if="type === 'orders'" class="filter__footer filter-footer">
      <div class="filter-footer__group">
        <div class="filter-footer__title">Заказы:</div>
        <div class="filter-footer__value">
          {{ vueNumberFormat(cost.toString().split(".")[0]) }}
        </div>
      </div>
      <div class="filter-footer__group">
        <div class="filter-footer__title">Доставка:</div>
        <div class="filter-footer__value">
          {{ vueNumberFormat(totalDeliverySum.toString().split(".")[0]) }}
        </div>
      </div>
      <div class="filter-footer__group">
        <div class="filter-footer__title">Отгружено:</div>
        <div class="filter-footer__value">
          {{ vueNumberFormat(shippedSum.toString().split(".")[0]) }}
        </div>
      </div>
      <div class="filter-footer__group">
        <div class="filter-footer__title">Прибыль:</div>
        <div class="filter-footer__value">
          {{ vueNumberFormat(profit.toString().split(".")[0]) }}
        </div>
      </div>
    </div>

    <div v-if="type === 'clients'" class="filter__footer filter-footer">
      <div class="filter-footer__group">
        <div class="filter-footer__title">Кол-во клиентов:</div>
        <div class="filter-footer__value">{{ countClients }}</div>
      </div>
      <div class="filter-footer__group">
        <div class="filter-footer__title">Сумма покупок:</div>
        <div class="filter-footer__value">
          {{ vueNumberFormat(cost.toString().split(".")[0]) }}
        </div>
      </div>
      <div class="filter-footer__group">
        <div class="filter-footer__title">Отгружено:</div>
        <div class="filter-footer__value">
          {{ vueNumberFormat(shippedSum.toString().split(".")[0]) }}
        </div>
      </div>
      <div class="filter-footer__group">
        <div class="filter-footer__title">Прибыль:</div>
        <div class="filter-footer__value">
          {{ vueNumberFormat(profit.toString().split(".")[0]) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import roleMixins from "@/mixins/role";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  mixins: [roleMixins],
  props: {
    type: {
      type: String,
      required: false,
      default: () => "group",
    },
    user: {
      type: Object,
      required: false,
      default: () => {},
    },
    isLoading: {
      type: Boolean,
    },
    countClients: {
      type: Number,
    },
    totalCost: {
      type: Number,
    },
    totalProfit: {
      type: Number,
    },
    totalShippedSum: {
      type: Number,
    },
    totalDeliverySum: {
      type: Number,
    },
  },
  components: {
    VButton,
  },
  beforeMount() {
    this.filterOptions = this.defaultOptions;
    axios({
      url: "/regions/get",
    }).then(async ({ data }) => {
      this.regions = data.regions;
      for (let r of this.regions) {
        this.regionsPool.push(r._id);
      }
      this.setRegions(this.regionsPool);
    });

    if (this.type === "group" || this.type === "reports") {
      axios({
        url: "/user/getdepartments",
      }).then(async ({ data }) => {
        let departments = data.departments;

        let allCount = 0;
        departments.forEach((element) => {
          allCount += element.count;
        });
        departments.unshift({
          count: allCount,
          title: "Все отделы",
          value: "all",
          _id: 1,
        });
        this.info = departments;
      });
      return;
    } else if (this.type === "goods") {
      this.activeIndex = null;
      this.filterOptions.nesting = +this.$route.params.nesting - 1;
      this.filterOptions.parent_id = this.$route.params.parent_id;
    }
    if (
      this.type === "orders" ||
      this.type === "tasks" ||
      this.type === "vacancies"
    ) {
      axios({
        url: "/departments/get",
        method: "POST",
      }).then(({ data }) => {
        let departments = data.departments;

        departments.unshift({
          title: "Все отделы",
          value: "all",
        });
        this.info = departments;
      });
    }
    if (this.type === "tasks") {
      if (this.user) {
        this.filterOptions.executor = this.user._id;
        this.selectUser(this.user);
      }
    }
    if (this.type === "mango") {
      axios({
        url: "/calls/getnumbers",
      }).then(async ({ data }) => {
        this.phones = data.numbers;
      });
      this.dates.unshift({
        title: "За все время",
        value: "all",
      });
    }
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
    count: {
      get: function () {
        return this.countClients;
      },
    },
    cost: {
      get: function () {
        return this.totalCost;
      },
    },
    profit: {
      get: function () {
        return this.totalProfit;
      },
    },
    shippedSum: {
      get: function () {
        return this.totalShippedSum;
      },
    },
  },
  data() {
    return {
      filter: false,
      sameDateFormat: {
        from: "DD.MM.YYYY, HH:mm",
        to: "HH:mm",
      },
      dateInput: {
        inputClass: "grid__container--filters-btn",
        placeholder: "Выберите дату",
        format: "DD.MM.YYYY",
        id: "dateInput",
      },
      calendarDateInput: {
        labelStarts: "Начало",
        labelEnds: "Конец",
      },
      dashBoard: [
        { title: "Интернет-магазин", value: "online" },
        { title: "Логистика", value: "logistics" },
      ],
      activeIndex: 0,
      info: [],
      showSlider: false,
      regions: [],
      regionsPool: [],
      dates: [
        {
          title: "За сегодня",
          value: "today",
        },
        {
          title: "За неделю",
          value: "week",
        },
        {
          title: "За месяц",
          value: "month",
        },
        {
          title: "За год",
          value: "year",
        },
      ],
      author: "",
      authors: [],
      fio: "",
      users: [],
      filterOptions: {},
      defaultOptions: {
        department: "all",
        status: "all",
        region: "all",
        regionValue: null,
        executor: null,
        initiator: "all",
        dates: "all",
        type: null,
        parent_value: null,
        nesting: null,
      },
      phone: "all",
      phones: [],
    };
  },
  methods: {
    ...mapMutations({
      setRegion: "set_region",
      resetRegion: "reset_region",
      resetParentValue: "reset_parent_value",
    }),
    clearOptions() {
      if (this.type === "tasks") {
        this.fio = "";
        this.author = "";
        this.filterOptions.region = "all";
        this.filterOptions.initiator = "all";
        this.filterOptions.department = "all";
        this.filterOptions.status = "all";
        this.filterOptions.executor = null;
        this.$parent.filtersOptions = {};
        this.activeIndex = 0;
      }
      if (this.type === "monitor") {
        this.$parent.startDate = null;
        this.$parent.endDate = null;
        let input = document.getElementById("dateInput");
        input.value = "Выберите дату";
        this.$emit("refreshDates", false, false, this.regionsPool);
      }
      if (this.type === "reports") {
        this.fio = "";
        this.filterOptions.region = "all";
        this.filterOptions.departments = "all";
        this.filterOptions.executor = null;
        this.$parent.filtersOptions = {};
        this.activeIndex = 0;
      }
      if (this.type === "mango") {
        this.$parent.startDate = null;
        this.$parent.endDate = null;
        this.filterOptions.phone = "all";
        let input = document.getElementById("dateInput");
        input.value = "Выберите дату";
        this.$parent.filtersOptions = {};
        this.activeIndex = 0;
      }
      if (this.type === "group") {
        this.fio = "";
        this.filterOptions.region = "all";
        this.filterOptions.departments = "all";
        this.$parent.filtersOptions = {};
        this.activeIndex = 0;
      }
      if (this.type === "vacancies") {
        this.filterOptions.region = "all";
        this.filterOptions.departments = "all";
        this.$parent.filtersOptions = {};
        this.activeIndex = 1;
      }
      if (this.type === "goods") {
        this.filterOptions.parent_value = null;
        this.filterOptions.nesting = null;
        this.filterOptions.region = "all";
        this.$parent.filtersOptions = {};
        this.resetRegion();
        this.activeIndex = -1;
      }
      if (this.type === "orders") {
        this.fio = "";
        this.filterOptions.region = "all";
        this.filterOptions.status = "all";
        this.filterOptions.dates = "all";
        this.filterOptions.executor = null;
        this.$parent.filtersOptions = {
          dates: "all",
          created: null,
          deliver: null,
          buyed: null,
          number: 1,
          status: null,
          region: null,
          executor: this.role === "manager" ? this.$store.state._id : null,
          search: "",
        };
        this.$parent.startDate = null;
        this.$parent.endDate = null;
        let input = document.getElementById("dateInput");
        input.value = "Выберите дату";
        this.$parent.searchStr = "";
        this.activeIndex = 0;
      }
      if (this.type === "callbacks") {
        this.fio = "";
        this.filterOptions.region = "all";
        this.filterOptions.status = "all";
        this.filterOptions.executor = null;
        this.filterOptions.dates = "all";
        this.$parent.filtersOptions = {
          dates: "all",
          created: null,
          deliver: null,
          buyed: null,
          number: 1,
          status: null,
          region: null,
          executor: this.role === "manager" ? this.$store.state._id : null,
          search: "",
        };
        this.$parent.startDate = null;
        this.$parent.endDate = null;
        let input = document.getElementById("dateInput");
        input.value = "Выберите дату";
        this.$parent.searchStr = "";
        this.activeIndex = 0;
      }
      if (this.type === "clients") {
        this.fio = "";
        this.filterOptions.region = "all";
        this.filterOptions.dates = "all";
        this.$parent.filtersOptions = {
          dates: "all",
          region: "all",
          search: "",
        };
        this.$parent.startDate = null;
        this.$parent.endDate = null;
        let input = document.getElementById("dateInput");
        input.value = "Выберите дату";
        this.$parent.searchStr = "";
        this.$parent.activeElement = -1;
      }
      if (this.type === "providers") {
        this.filterOptions.region = "all";
        this.$parent.filtersOptions = {};
        this.$parent.search = "";
        this.$parent.isSearch = false;
        this.resetRegion();
        this.activeIndex = -1;
      }
      if (this.type === "callCenterIssues" || this.type === "purchase") {
        this.fio = "";
        this.filterOptions.region = "all";
        this.filterOptions.status = "all";
        this.filterOptions.executor = null;
        this.filterOptions.initiator = null;
        this.author = "";
        this.filterOptions.dates = "all";
        this.$parent.filtersOptions = {
          dates: "all",
          created: null,
          status: null,
          region: null,
          executor: this.role === "manager" ? this.$store.state._id : null,
          search: "",
        };
        this.$parent.searchStr = "";
        this.activeIndex = 0;
      }
      if (
        this.$route.fullPath !== `/dashboard/${this.$route.name}/1` &&
        this.$route.fullPath !== "/dashboard/monitor"
      ) {
        this.$router.push(`/dashboard/${this.$route.name}/1`);
      }
    },
    selectOptions(e, index, type, value) {
      this.$parent.isLoading = false;
      switch (type) {
        case "department":
          this.filterOptions.department = value || e.target.value;
          this.activeIndex = index;
          break;
        case "orders":
          this.filterOptions.type = e.target.value;
          this.activeIndex = index;
          this.$forceUpdate();
          break;
        case "providers":
          this.filterOptions.type = value;
          this.activeIndex = index;
          this.$forceUpdate();
          break;
        case "education":
          this.$parent.type = value;
          this.activeIndex = index;
          this.$forceUpdate();
          break;
        case "monitor":
          this.$parent.type = e.target.value;
          this.activeIndex = this.dashBoard.indexOf(e.target.value);
          this.$forceUpdate();
          break;
        case "status":
          this.filterOptions.status = e.target.value;
          break;
        case "region":
          this.filterOptions.region = e.target.value;
          break;
        case "regionStats":
          this.filtersOptions.region = e.target.value;
          break;
        case "dates":
          this.filterOptions.dates = e.target.value;

          break;
        case "regionButtons":
          if (e.target.value != null) {
            const region = this.regions.find((r) => r._id == e.target.value);
            this.filterOptions.region = region._id;
            this.filterOptions.regionValue = region.value;
            this.setRegion(region._id);
            this.$emit("updatebyfilter");
            this.activeIndex = 0;
            this.$parent.changeOrder = false;
            this.$parent.downloadExcelFile = true;
          }
          break;
        case "phone":
          this.filterOptions.phone = value || e.target.value;
          break;
        default:
          break;
      }
      this.$parent.filtersOptions = this.filterOptions;

      if (
        !this.$route.fullPath.includes(`/${this.$route.name}/1`) &&
        this.$route.fullPath !== "/monitor"
      ) {
        this.$router.push(`/dashboard/${this.$route.name}/1`);
      }
      this.$parent.isLoading = true;
    },
    selectRegion(id) {
      let value = id.target.value;
      if (value == "all") {
        this.setAllRegions();
      } else {
        let region = this.regions.find((r) => r.value == value);
        this.regionsPool = [region._id];
        this.setRegions(this.regionsPool);
      }
    },
    setRegions(pool) {
      this.$emit("setRegionsPool", pool);
    },
  },
};
</script>
