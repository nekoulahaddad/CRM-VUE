<template>
  <nav class="sidebar__menu menu">
    <ul class="menu__list">
      <li class="menu__item" v-for="(item, key) in $t('menu')" :key="key">
        <router-link
          :class="{ 'menu__link--active': key === activeEl }"
          active-class="menu__link--active"
          :to="getPageUrl(key)"
          class="menu__link"
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
      el: this.$route.name,
    };
  },
  computed: {
    activeEl: {
      get: function () {
        return this.el;
      },
      set: function (name) {
        this.el = name;
        return this.el;
      },
    },
  },
  methods: {
    getIconUrl(key) {
      return `/icons/${key}.svg`;
    },
    getPageUrl(key) {
      return `/dashboard/${key}/1`;
    },
  },
};
</script>
