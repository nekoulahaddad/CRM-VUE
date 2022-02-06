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
        <a href="" class="page-actions__button" @click.prevent="addTask">
          <img src="@/assets/icons/tasks_add.svg" alt="" />
        </a>
      </template>

      <!-- Товары -->
      <template v-if="name === 'goods'">
        <VueCustomTooltip label="Добавить категорию">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="
              active === 'add_category'
                ? (active = null)
                : (active = 'add_category')
            "
            :class="{
              'page-actions__button--active': active === 'add_category',
            }"
          >
            <simple-svg :src="require('@/assets/icons/add_category.svg')" />
          </a>
        </VueCustomTooltip>

        <VueCustomTooltip label="Импорт Excel">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'importGoods',
              })
            "
          >
            <img src="@/assets/icons/import_excel.svg" alt="" />
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
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'addOrder',
              })
            "
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
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'addEmployee',
              })
            "
          >
            <simple-svg :src="require('@/assets/icons/add_employee.svg')" />
          </a>
        </VueCustomTooltip>
        <!-- Excel уволенных сотрудников -->
        <VueCustomTooltip label="Excel уволенных сотрудников">
          <a
            href=""
            @click.prevent="downloadUsers"
            class="page-actions__button"
          >
            <img src="@/assets/icons/fired.svg" alt="" />
          </a>
        </VueCustomTooltip>

        <!-- Excel дней рождений за месяц -->
        <VueCustomTooltip label="Excel дней рождений за месяц">
          <a
            href=""
            @click.prevent="downloadUsersBirthday"
            class="page-actions__button"
          >
            <img src="@/assets/icons/birthday_cake.svg" alt="" />
          </a>
        </VueCustomTooltip>

        <!-- Excel всех сотрудников -->
        <VueCustomTooltip label="Excel всех сотрудников">
          <a
            href=""
            @click.prevent="downloadAllUsers"
            class="page-actions__button"
          >
            <img src="@/assets/icons/employees.svg" alt="" />
          </a>
        </VueCustomTooltip>

        <!-- Excel детей сотрудников -->
        <VueCustomTooltip label="Excel детей сотрудников">
          <a
            href=""
            @click.prevent="downloadKidsOfUsers"
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
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'createEducationSection',
              })
            "
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
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'addTask',
              })
            "
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
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'addDelivery',
              })
            "
          >
            <img src="@/assets/icons/add_delivery.svg" alt="" />
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
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addDepartment',
            })
          "
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
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'addVacancy',
              })
            "
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
    async downloadUsersBirthday(age) {
      this.changeStatus(false);
      axios({
        url: `/excel/birthday`,
        data: {
          age: age,
        },
        method: "POST",
      })
        .then((res) => {
          this.$toast.success(res.data.message);
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
    async downloadAllUsers() {
      this.changeStatus(false);
      axios({
        url: `/excel/allusers`,
        data: {
          region: this.filtersOptions.region,
        },
        method: "POST",
      })
        .then((res) => {
          this.$toast.success(res.data.message);
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
    async downloadKidsOfUsers() {
      this.changeStatus(false);
      axios({
        url: `/excel/children`,
        data: {
          age: 18,
        },
        method: "POST",
      })
        .then((res) => {
          this.$toast.success("Результаты запросов!");
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
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
          region: this.filtersOptions.region,
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
    async downloadExcel() {
      this.changeStatus(false);

      axios({
        url: `/excel/getorders`,
        data: this.$store.getters.getFilterOptions,
        method: "POST",
      }).then(async () => {
        this.$toast.success("Начинаю генерировать Excel!");
      });

      this.changeStatus(true);
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
