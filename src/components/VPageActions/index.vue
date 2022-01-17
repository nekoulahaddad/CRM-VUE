<template>
  <div class="page-actions">
    <div class="page-actions__inner">
      <a href="" @click.prevent="clearCache" class="page-actions__button">
        <img src="@/assets/icons/clear_cache.svg" alt="" />
      </a>
      <template v-if="name === 'education'">
        <a href="" class="page-actions__button">
          <img src="@/assets/icons/education_add.svg" alt="" />
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
