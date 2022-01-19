<template>
  <div class="page-actions">
    <div class="page-actions__inner">
      <a href="" @click.prevent="clearCache" class="page-actions__button">
        <img src="@/assets/icons/clear_cache.svg" alt="" />
      </a>

      <!-- Рабочий стол -->
      <template v-if="name === 'desktop'">
        <a href="" class="page-actions__button">
          <img src="@/assets/icons/tasks_add.svg" alt="" />
        </a>
      </template>

      <!-- Обучение -->
      <template v-if="name === 'education'">
        <a
          href=""
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'createEducationSection',
            })
          "
          class="page-actions__button"
        >
          <img src="@/assets/icons/education_add.svg" alt="" />
        </a>
      </template>

      <!-- Задачи -->
      <template v-if="name === 'tasks'">
        <a href="" class="page-actions__button">
          <img src="@/assets/icons/tasks_add.svg" alt="" />
        </a>
      </template>

      <!-- Клиенты -->
      <template v-if="name === 'clients'">
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
  &__inner {
  }

  &__button {
    position: relative;
    top: 2px;

    & + * {
      margin-left: 20px;
    }
  }
}
</style>
