<template>
  <nav class="sidebar__menu menu">
    <ul class="menu__list">
      <li class="menu__item" v-for="(item, key) in $t('menu')" :key="key">
        <router-link
          class="menu__link"
          active-class="menu__link--active"
          :to="getPageUrl(key)"
          :class="{ 'menu__link--active': key === el }"
        >
          <div class="menu__icon">
            <img :src="getIconUrl(key)" alt="" />
          </div>
          <div class="menu__title">{{ item }}</div>
        </router-link>
      </li>
    </ul>
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
      return `/dashboard/${key}/1`;
    },
  },
};
</script>
