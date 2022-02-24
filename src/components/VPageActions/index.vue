<template>
  <div class="page-actions">
    <div class="page-actions__inner">
      <VueCustomTooltip label="Очистить кеш">
        <a href="" @click.prevent="clearCache" class="page-actions__button">
          <img src="@/assets/icons/clear_cache.svg" alt="" />
        </a>
      </VueCustomTooltip>

      <!-- Рабочий стол -->
      <template v-if="name === 'desktop'">
        <VueCustomTooltip label="Создать задачу">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="toggleAction('addDbTask')"
            :class="{
              'page-actions__button--active': $store.state.actions.addDbTask,
            }"
          >
            <simple-svg :src="require('@/assets/icons/add_db_task.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Календарь -->
      <template v-if="name === 'calendar'">
        <VueCustomTooltip label="Создать мероприятие">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="toggleAction('addEvent')"
            :class="{
              'page-actions__button--active': $store.state.actions.addEvent,
            }"
          >
            <simple-svg :src="require('@/assets/icons/add_event.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Обращения -->
      <template v-if="name === 'callbacks'">
        <VueCustomTooltip label="Создать обращение">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="toggleAction('addCallback')"
            :class="{
              'page-actions__button--active': $store.state.actions.addCallback,
            }"
          >
            <simple-svg :src="require('@/assets/icons/add_callback.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Закупка -->
      <template v-if="name === 'buying'">
        <VueCustomTooltip label="Добавить закупку">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="toggleAction('addPurchase')"
            :class="{
              'page-actions__button--active': $store.state.actions.addPurchase,
            }"
          >
            <simple-svg :src="require('@/assets/icons/add_purchase.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Товары -->
      <template v-if="name === 'goods'">
        <VueCustomTooltip label="Добавить категорию">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="toggleAction('addGoodsCategory')"
            :class="{
              'page-actions__button--active':
                $store.state.actions.addGoodsCategory,
            }"
          >
            <simple-svg :src="require('@/assets/icons/add_category.svg')" />
          </a>
        </VueCustomTooltip>

        <VueCustomTooltip label="Импорт Excel">
          <a
            href=""
            class="page-actions__button"
            :class="{
              'page-actions__button--active': $store.state.actions.importGoods,
            }"
            @click.prevent="toggleAction('importGoods')"
          >
            <simple-svg :src="require('@/assets/icons/import_excel.svg')" />
          </a>
        </VueCustomTooltip>

        <VueCustomTooltip label="Список всех пользователей">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="getInfoAboutAllUsers"
          >
            <simple-svg :src="require('@/assets/icons/all_users.svg')" />
          </a>
        </VueCustomTooltip>

        <VueCustomTooltip label="Скачать все товары">
          <a href="" class="page-actions__button" @click.prevent="">
            <img src="@/assets/icons/all_items.svg" alt="" />
          </a>
        </VueCustomTooltip>

        <VueCustomTooltip label="Выгрузить товары данного региона">
          <a href="" class="page-actions__button" @click.prevent="">
            <img src="@/assets/icons/region_items.svg" alt="" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Заказы -->
      <template v-if="name === 'orders'">
        <VueCustomTooltip label="Выгрузить заказы">
          <a
            class="page-actions__button"
            href=""
            @click.prevent="downloadExcel"
          >
            <img src="@/assets/icons/download.svg" alt="" />
          </a>
        </VueCustomTooltip>
        <VueCustomTooltip label="Добавить заказ">
          <a
            href=""
            class="page-actions__button"
            :class="{
              'page-actions__button--active': $store.state.actions.addOrder,
            }"
            @click.prevent="toggleAction('addOrder')"
          >
            <simple-svg :src="require('@/assets/icons/create_order.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Сотрудники -->
      <template v-if="name === 'employee'">
        <VueCustomTooltip label="Добавить сотрудника">
          <a
            href=""
            class="page-actions__button"
            :class="{
              'page-actions__button--active': $store.state.actions.addEmployee,
            }"
            @click.prevent="toggleAction('addEmployee')"
          >
            <simple-svg :src="require('@/assets/icons/add_employee.svg')" />
          </a>
        </VueCustomTooltip>
        <!-- Excel уволенных сотрудников -->
        <VueCustomTooltip label="Excel уволенных сотрудников">
          <a
            href=""
            @click.prevent="
              downloadItem('users', 'xlsx', 'Уволенные_сотрудники')
            "
            class="page-actions__button"
          >
            <img src="@/assets/icons/fired.svg" alt="" />
          </a>
        </VueCustomTooltip>

        <!-- Excel дней рождений за месяц -->
        <VueCustomTooltip label="Excel дней рождений за месяц">
          <a
            href=""
            @click.prevent="
              downloadItem('birthday', 'xlsx', 'Дни_рождения_сотрудников')
            "
            class="page-actions__button"
          >
            <img src="@/assets/icons/birthday_cake.svg" alt="" />
          </a>
        </VueCustomTooltip>

        <!-- Excel всех сотрудников -->
        <VueCustomTooltip label="Excel всех сотрудников">
          <a
            href=""
            @click.prevent="downloadItem('allusers', 'xlsx', 'Все_сотрудники')"
            class="page-actions__button"
          >
            <img src="@/assets/icons/employees.svg" alt="" />
          </a>
        </VueCustomTooltip>

        <!-- Excel детей сотрудников -->
        <VueCustomTooltip label="Excel детей сотрудников">
          <a
            href=""
            @click.prevent="
              downloadItem('children', 'xlsx', 'Дети_сотрудников')
            "
            class="page-actions__button"
          >
            <img src="@/assets/icons/baby.svg" alt="" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Обучение -->
      <template v-if="name === 'education'">
        <VueCustomTooltip label="Добавить раздел">
          <a
            href=""
            @click.prevent="toggleAction('createEducationSection')"
            class="page-actions__button"
            :class="{
              'page-actions__button--active':
                $store.state.actions.createEducationSection,
            }"
          >
            <simple-svg :src="require('@/assets/icons/create_education.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Задачи -->
      <template v-if="name === 'tasks'">
        <VueCustomTooltip label="Создать задачу">
          <a
            href=""
            class="page-actions__button"
            :class="{
              'page-actions__button--active': $store.state.actions.addTask,
            }"
            @click.prevent="toggleAction('addTask')"
          >
            <simple-svg :src="require('@/assets/icons/add_task.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Поставщики -->
      <template v-if="name === 'delivery'">
        <VueCustomTooltip label="Добавить поставщика">
          <a
            href=""
            class="page-actions__button"
            :class="{
              'page-actions__button--active': $store.state.actions.addDelivery,
            }"
            @click.prevent="toggleAction('addDelivery')"
          >
            <simple-svg :src="require('@/assets/icons/add_delivery.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Департаменты -->
      <template v-if="name === 'departments'">
        <a
          href=""
          class="page-actions__button"
          :class="{
            'page-actions__button--active': $store.state.actions.addDepartment,
          }"
          @click.prevent="toggleAction('addDepartment')"
        >
          <simple-svg :src="require('@/assets/icons/add_department.svg')" />
        </a>
      </template>

      <!-- Клиенты -->
      <template v-if="name === 'clients' && false">
        <a href="" class="page-actions__button">
          <img src="@/assets/icons/client_add.svg" alt="" />
        </a>
      </template>

      <!-- Вакансии -->
      <template v-if="name === 'vacancies'">
        <VueCustomTooltip label="Добавить вакансию">
          <a
            href=""
            class="page-actions__button"
            :class="{
              'page-actions__button--active': $store.state.actions.addVacancy,
            }"
            @click.prevent="toggleAction('addVacancy')"
          >
            <simple-svg :src="require('@/assets/icons/add_vacancy.svg')" />
          </a>
        </VueCustomTooltip>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      active: null,
    };
  },
  computed: {
    name() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    addTask() {},
    async getInfoAboutAllUsers() {
      try {
        this.changeStatus(false);
        await axios({
          url: `/seo/getinfoaboutallusers`,
          method: "GET",
        });
        this.$toast.success("Начинаю генерировать Excel!");
      } catch (error) {
        this.$toast.error(error.response.data.message);
      } finally {
        this.changeStatus(true);
      }
    },
    async downloadUsers() {
      this.changeStatus(false);
      axios({
        url: `/excel/users`,
        data: {
          region: this.$store.getters.getFilterOptions,
        },
        method: "POST",
      })
        .then(async (res) => {
          this.$toast.success(res.data.message);
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
    toggleAction(key) {
      this.$store.commit("toggleAction", { key });

      if (this.$store.state.actions[key]) {
        this.$scrollTo("body", 300);
      }
    },
    async downloadItem(route, type, prefix) {
      axios({
        url: `/excel/${route}`,
        data: {
          age: 18,
        },
        method: "POST",
        responseType: "blob",
      }).then((response) => {
        const link = document.createElement("a");
        const blob = new Blob([response.data]);
        let urll = window.URL.createObjectURL(blob);
        link.href = urll;
        link.download = `${prefix}.${type}`;
        link.click();
        window.URL.revokeObjectURL(urll);
        URL.revokeObjectURL(link.href);
      });
    },
    async downloadExcel() {
      try {
        axios({
          url: `/excel/getorders`,
          data: this.$store.state.filterOptions,
          method: "POST",
          responseType: "blob",
        }).then((response) => {
          const link = document.createElement("a");
          const blob = new Blob([response.data]);
          let urll = window.URL.createObjectURL(blob);
          link.href = urll;
          link.download = `Заказы.xlsx`;
          link.click();
          window.URL.revokeObjectURL(urll);
          URL.revokeObjectURL(link.href);
        });
      } catch {
        this.$toast.error("Ошибка при скачивании файла");
      }
    },
    clearCache() {
      axios
        .get("https://tdcsk.com/api/cache-clear", {
          headers: {
            Origin: process.env.VUE_APP_DEVELOP_URL,
            "Access-Control-Allow-Origin": process.env.VUE_APP_DEVELOP_URL,
          },
        })
        .then(() => {
          this.$toast.success("Кэш успешно очищен!");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.page-actions {
  display: flex;

  &__inner {
    display: flex;

    span[role="tooltip"] {
      &:after {
        background-color: $color-black;
        color: $color-white;
        border-radius: $border-radius;
      }

      & + * {
        margin-left: 20px;
      }
    }
  }

  &__button {
    position: relative;
    top: 2px;
    width: 59px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius;
    background-color: $color-red;

    &--active {
      background: none;
      border: 1px solid $color-red;

      svg path {
        fill: $color-red;
      }
    }

    & + * {
      margin-left: 20px;
    }
  }
  svg path {
  }
}
</style>
