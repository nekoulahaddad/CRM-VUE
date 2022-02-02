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

      <!-- Заказы -->
      <template v-if="name === 'orders'">
        <a href="" class="page-actions__button" @click.prevent="">
          <img src="@/assets/icons/create_order.svg" alt="" />
        </a>
      </template>

      <!-- Сотрудники -->
      <template v-if="name === 'employee'">
        <VueCustomTooltip label="Добавить сотрудника">
          <a
            href=""
            class="page-actions__button"
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'addEmployee',
              })
            "
          >
            <img src="@/assets/icons/add_employee.svg" alt="" />
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
        <VueCustomTooltip label="Добавить">
          <a
            href=""
            @click.prevent="
              $store.commit('toggleAction', {
                key: 'createEducationSection',
              })
            "
            class="page-actions__button"
            :class="{
              'page-actions__button--active2':
                $store.state.actions.createEducationSection,
            }"
          >
            <simple-svg :src="require('@/assets/icons/create_education.svg')" />
          </a>
        </VueCustomTooltip>
      </template>

      <!-- Задачи -->
      <template v-if="name === 'tasks'">
        <a
          href=""
          class="page-actions__button"
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addTask',
            })
          "
        >
          <img src="@/assets/icons/tasks_add.svg" alt="" />
        </a>
      </template>

      <!-- Поставщики -->
      <template v-if="name === 'delivery'">
        <a href="" class="page-actions__button">
          <img src="@/assets/icons/add_delivery.svg" alt="" />
        </a>
      </template>

      <!-- Клиенты -->
      <template v-if="name === 'clients' && false">
        <a href="" class="page-actions__button">
          <img src="@/assets/icons/client_add.svg" alt="" />
        </a>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
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
      border: 3px solid $color-red;
    }

    & + * {
      margin-left: 20px;
    }
  }
}
</style>
