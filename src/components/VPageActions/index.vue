<template>
  <div class="page-actions">
    <div class="page-actions__inner">
      <a href="" @click.prevent="clearCache" class="page-actions__button">
        <img src="@/assets/icons/clear_cache.svg" alt="" />
      </a>

      <!-- Рабочий стол -->
      <template v-if="name === 'desktop'">
        <a href="" class="page-actions__button" @click.prevent="addTask">
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
          :class="{
            'page-actions__button--active2':
              $store.state.actions.createEducationSection,
          }"
        >
          <simple-svg :src="require('@/assets/icons/create_education.svg')" />
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

export default {
  computed: {
    name() {
      return this.$route.name;
    },
  },
  methods: {
    addTask() {
      this.$modal.show("addTask");
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
