<template>
  <div class="page__buttons" v-if="type === 'education'">
    <v-button
      v-for="(item, index) in $t('pages.education.buttons')"
      :red="activeIndex === index"
      :white="activeIndex !== index"
      @click="selectOptions($event, index, 'education', item.id, item.title)"
    >
      {{ item.value }}
    </v-button>
  </div>
  <div v-else class="filter" :class="{ 'filter--collapse': filterCollapse }">
    <div class="filter__inner">
      <div class="filter__header">
        <div class="filter__title">Фильтр</div>
      </div>
      <div class="filter__body">
        <template v-if="type === 'group'">
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
                  {{ item.title }} ({{ item.count }})
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

        <!-- Монитор -->
        <template v-else-if="type === 'monitor'">
          <div class="filter__group group">
            <div class="group__title">Отделы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'monitor', null)"
              >
                <option
                  v-for="(item, index) of dashBoard"
                  :value="item.value"
                  :selected="index === 0"
                >
                  {{ item.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group" v-if="role === 'director'">
            <div class="group__title">{{ $t("regions") }}</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectRegion($event)"
                :value="filterOptions.region ? filterOptions.region : 'all'"
              >
                <option value="all" selected>{{ $t("allRegions") }}</option>
                <option
                  v-for="region in regions"
                  :key="region.id"
                  class="form-select"
                  :value="region.value"
                >
                  {{ region.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Дата:</div>
            <div class="group__content">
              <date-picker
                format="DD.MM.YYYY"
                language="ru"
                :dateInput="dateInput"
                :sameDateFormat="sameDateFormat"
                :showHelperButtons="true"
                :switchButtonInitial="true"
                switchButtonLabel="Все время"
                :calendarDateInput="calendarDateInput"
                @date-applied="selectPeriodDate"
              />
            </div>
          </div>
          <div class="filter__actions">
            <button @click="clearOptions" class="btn btn--red filter__btn">
              Очистить
            </button>
          </div>
        </template>

        <!-- Клиенты -->
        <template v-else-if="type === 'clients'">
          <div class="filter__group group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'region', null)"
                :value="filterOptions.region"
              >
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
              <date-picker
                format="DD.MM.YYYY"
                language="ru"
                :dateInput="dateInput"
                :sameDateFormat="sameDateFormat"
                :showHelperButtons="true"
                :switchButtonInitial="true"
                switchButtonLabel="Все время"
                :calendarDateInput="calendarDateInput"
                @date-applied="selectPeriodDate"
              />
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
                :value="defaultOptions.dates"
              >
                <option selected value="all">Все время</option>
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
              <autocomplete
                :search="searchByInitiator"
                placeholder="Введите автора задачи..."
                :get-result-value="getResultValue"
              >
                <template #result="{ result, props }">
                  <li @click="selectInitiator(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <autocomplete
                :search="searchByExecutor"
                placeholder="Введите исполнителя задачи..."
                :get-result-value="getResultValue"
              >
                <template #result="{ result, props }">
                  <li @click="selectUser(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
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
                <option value="отказ">Отказ</option>
                <option value="в обработке">В обработке</option>
                <option value="подтвержденный">Подтвержденный</option>
                <option value="в наличии">В наличии</option>
                <option value="отсутствует у поставщика">
                  Отсутствует у поставщика
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

        <template v-else-if="type === 'callCenterIssues'">
          <div class="filter__group group">
            <div class="group__title">Период:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
                :value="defaultOptions.dates"
              >
                <option selected value="all">Все время</option>
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
              <autocomplete
                :search="searchByInitiator"
                placeholder="Введите автора задачи..."
                :get-result-value="getResultValue"
              >
                <template #result="{ result, props }">
                  <li @click="selectInitiator(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <autocomplete
                :search="searchByExecutor"
                placeholder="Введите исполнителя задачи..."
                :get-result-value="getResultValue"
              >
                <template #result="{ result, props }">
                  <li @click="selectUser(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
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
                :value="defaultOptions.dates"
              >
                <option selected value="all">Все время</option>
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
          <div class="filter__group group" v-if="false">
            <div class="group__title">Тип заявки:</div>
            <div class="group__content">
              <select class="form-select">
                <option value="Все задачи">Все типы</option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Менеджер:</div>
            <div class="group__content">
              <autocomplete
                ref="manager"
                :search="getUsersByFIO"
                placeholder="Введите менеджера..."
                :get-result-value="getResultValue"
                @input="autocompleteInput($event, 'executor')"
              >
                <template #result="{ result, props }">
                  <li @click="selectManager(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
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
            <div class="group__title">Статус:</div>
            <div class="group__content">
              <select
                class="form-select"
                name="status"
                @change="selectOptions($event, null, 'status', null)"
                :value="filterOptions.status ? filterOptions.status : 'all'"
              >
                <option value="all">Все задачи</option>
                <option value="assigned">Назначена</option>
                <option value="tested">На проверке</option>
                <option value="completed">Выполненые</option>
                <option value="under revision>">На доработке</option>
                <option value="accepted">Принята</option>
                <option value="not accepted>">Отклонена</option>
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
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <autocomplete
                ref="executor"
                :search="searchByExecutor"
                placeholder="Введите исполнителя задачи..."
                :get-result-value="getResultValue"
                @input="autocompleteInput($event, 'executor')"
              >
                <template #result="{ result, props }">
                  <li @click="selectUser(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
            </div>
          </div>
          <!-- Автор -->
          <div class="filter__group group">
            <div class="group__title">Автор:</div>
            <div class="group__content">
              <autocomplete
                ref="initiator"
                :search="searchByInitiator"
                placeholder="Введите автора задачи..."
                :getResultValue="getResultValue"
                @input="autocompleteInput($event, 'initiator')"
              >
                <template #result="{ result, props }">
                  <li @click="selectInitiator(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
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

        <!-- Отчеты -->
        <template v-else-if="type === 'reports'">
          <div class="filter__group group">
            <div class="group__title">Дата:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
                :value="defaultOptions.dates"
              >
                <option selected value="all">Все время</option>
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
                  {{ item.title }} ({{ item.count }})
                </option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Исполнитель:</div>
            <div class="group__content">
              <autocomplete
                ref="executor"
                :search="searchByExecutor"
                placeholder="Введите исполнителя задачи..."
                :get-result-value="getResultValue"
                @input="autocompleteInput($event, 'executor')"
              >
                <template #result="{ result, props }">
                  <li @click="selectUser(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
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
              <select
                class="form-select"
                @change="selectOptions($event, 0, 'orders', null)"
              >
                <option selected value="all">B2С</option>
                <option value="corporat">B2B</option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Период:</div>
            <div class="group__content">
              <select
                class="form-select"
                @change="selectOptions($event, null, 'dates', null)"
                :value="defaultOptions.dates"
              >
                <option selected value="all">Все время</option>
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
                <option value="nocall">Нет связи с клиентом</option>
                <option value="awaiting">Ждет подтверждения</option>
                <option value="processing">В работе</option>
                <option value="completed">Выполненые заказы</option>
                <option value="delivered">Доставленные заказы</option>
                <option value="partially delivered">
                  Частично доставленные
                </option>
                <option value="declained">Отмененные заказы</option>
              </select>
            </div>
          </div>
          <div class="filter__group group">
            <div class="group__title">Менеджер:</div>
            <div class="group__content">
              <autocomplete
                ref="manager"
                :search="getUsersByFIO"
                placeholder="Введите менеджера..."
                :get-result-value="getResultValue"
                @input="autocompleteInput($event, 'manager')"
              >
                <template #result="{ result, props }">
                  <li @click="selectManager(result)" v-bind="props">
                    {{ transformFIO(result) }}
                  </li>
                </template>
              </autocomplete>
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
                ref="regionSelect"
                class="form-select"
                :value="filterOptions.region"
                v-model="filterOptions.region"
                @change="selectOptions($event, null, 'regionButtons', null)"
              >
                <option value="all">Все регионы</option>
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
            <v-button v-if="showEditButton" white>
              Редактировать регион
            </v-button>
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
import axios from "@/api/axios";
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";
import { mapGetters, mapMutations } from "vuex";
import VButton from "@/components/VButton";

export default {
  props: {
    showEditButton: {
      type: Boolean,
      default: true,
    },
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
    DatePicker,
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

        let allCount = 0;
        departments.forEach((element) => {
          allCount += element.count;
        });
        departments.unshift({
          count: allCount,
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
    ...mapGetters({
      filterCollapse: "filter",
    }),
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
      defaultValue: "",
      executor: "",
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
      helperButtons: [
        {
          name: "Сегодня",
          from: this.$moment().startOf("day"),
          to: this.$moment().endOf("day"),
        },
        {
          name: "Вчера",
          from: this.$moment().subtract("day", 1).startOf("day"),
          to: this.$moment().subtract("day", 1).endOf("day"),
        },
        {
          name: "Неделя",
          from: this.$moment().startOf("day").subtract("day", 7),
          to: this.$moment().endOf("day"),
        },
        {
          name: "Т. неделя",
          from: this.$moment().startOf("week"),
          to: this.$moment().endOf("week"),
        },
        {
          name: "П. неделя",
          from: this.$moment().startOf("week").subtract("day", 7),
          to: this.$moment().endOf("week").subtract("day", 7),
        },
        {
          name: "Месяц",
          from: this.$moment().startOf("day").subtract("month", 1),
          to: this.$moment().endOf("day"),
        },
        {
          name: "Т. месяц",
          from: this.$moment().startOf("month"),
          to: this.$moment().endOf("month"),
        },
        {
          name: "П. месяц",
          from: this.$moment().startOf("month").subtract("month", 1),
          to: this.$moment().endOf("month").subtract("month", 1),
        },
        {
          name: "Год",
          from: this.$moment().startOf("year").subtract("year", 1),
          to: this.$moment().endOf("day"),
        },
        {
          name: "Т. год",
          from: this.$moment().startOf("year"),
          to: this.$moment().endOf("year"),
        },
        {
          name: "П. год",
          from: this.$moment().startOf("year").subtract("year", 1),
          to: this.$moment().endOf("year").subtract("year", 1),
        },
        {
          name: "Все время",
          from: this.$moment().startOf("year").year(1970),
          to: this.$moment().endOf("year"),
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
        region: this.$parent.filtersOptions.region
          ? this.$parent.filtersOptions.region
          : "all",
        regionValue: null,
        executor: null,
        manager: null,
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
    autocompleteInput(e, type) {
      if (e.target.value.trim().length < 1) {
        this.filterOptions[type] = null;
        this.selectOptions(null, null, type, null);
      }
    },
    clickOnExecutor(result) {},
    getResultValue(result) {
      if (!result) {
        return;
      }
      return this.transformFIO(result);
    },
    searchByInitiator(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios(
          `/user/${
            this.type === "callCenterIssues"
              ? "getcallmanagers"
              : this.type === "purchase"
              ? "getmanagers"
              : "getsearch"
          }/${input}`
        ).then((res) => {
          resolve(res.data);
        });
      });
    },
    searchByExecutor(input) {
      if (input.trim().length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getsearch/${input}`).then(async (res) => {
          resolve(res.data);
        });
      });
    },
    selectPeriodDate(startDate, endDate) {
      this.$parent.isLoading = false;
      this.$emit("refreshDates", startDate, endDate, this.regionsPool);
    },
    selectInitiator(user) {
      this.filterOptions.initiator = user._id;
      this.selectOptions(null, null, "initiator", null);
    },
    selectManager(user) {
      this.filterOptions.manager = user._id;
      this.selectOptions(null, null, "manager", null);
    },
    selectUser(user) {
      this.filterOptions.executor = user._id;
      this.fio = `${user.surname} ${user.name.charAt(0)}.${
        user.lastname ? user.lastname.charAt(0) + "." : ""
      }`;
      this.users = [];
      this.selectOptions(null, null, "executor", null);
    },
    async getUsersByFIO(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios(`/user/getmanagers/${input}`).then((result) => {
          resolve(result.data);
        });
      });
    },
    clearOptions() {
      if (this.type === "tasks") {
        this.$refs.executor.setValue("");
        this.$refs.initiator.setValue("");
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
        this.$refs.executor.setValue("");
        this.filterOptions.region = "all";
        this.filterOptions.departments = "all";
        this.defaultOptions.department = "all";
        this.defaultOptions.dates = "all";
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
        this.$refs.manager.setValue("");
        this.filterOptions.region = "all";
        this.filterOptions.status = "all";
        this.filterOptions.dates = "all";
        this.filterOptions.executor = null;
        this.defaultOptions.dates = "all";
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
        this.$parent.searchStr = "";
        this.activeIndex = 0;
      }
      if (this.type === "callbacks") {
        this.fio = "";
        this.$refs.manager.setValue("");
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
    selectOptions(e, index, type, value, title = null) {
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
          this.$parent.title = title;
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
          this.$store.commit("setFilterRegion", e.target.value);
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
        this.$route.fullPath !== `/dashboard/${this.$route.name}/1` &&
        this.$route.fullPath !== "/dashboard/monitor"
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
    setAllRegions() {
      this.regionsPool = [];
      for (let r of this.regions) {
        this.regionsPool.push(r._id);
      }
      this.setRegions(this.regionsPool);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.filter {
  margin-right: 16px;

  .group__content {
    & > div {
      width: 100%;
    }
  }

  &__actions {
    margin-top: 20px;
  }

  &--collapse {
    display: none;
  }

  .autocomplete-result-list {
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);

    li {
      background: none;
      cursor: pointer;
      padding-left: 10px;
      &:hover {
        background: $color-gray-secondary;
      }
    }
  }

  button.btn--white {
    border-width: 2px !important;
    height: 37px;
    width: 230px;
    margin-top: 10px;
  }
}
</style>
