<template>
  <nav class="sidebar__menu menu">
    <vue-scroll>
      <ul class="menu__list">
        <li class="menu__item" v-for="(item, key) in $t('menu')" :key="key">
          <router-link
            class="menu__link"
            active-class="menu__link--active"
            :to="getPageUrl(key)"
            :class="{ 'menu__link--active': key === el }"
          >
            <div class="menu__icon">
              <simple-svg :src="getIconUrl(key)" />
            </div>
            <div class="menu__title">{{ item }}</div>
          </router-link>
        </li>
      </ul>
    </vue-scroll>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      el: null,
    };
  },
  computed: {
    activeElement: {
      get: function () {
        return this.el;
      },
      set: function (name) {
        this.el = name;
      },
    },
  },
  watch: {
    $route() {
      this.el = this.$route.name;
    },
  },
  methods: {
    getIconUrl(key) {
      return require(`@/assets/icons/${key}.svg`);
    },
    getPageUrl(key) {
      let url = `/dashboard/${key}`;
      const names = ["monitor", "calendar"];
      return names.includes(key) ? url : `${url}/1`;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.menu__link--active {
  svg path {
    fill: $color-red;
  }
}
</style>
