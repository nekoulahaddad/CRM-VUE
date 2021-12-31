<template>
  <nav class="sidebar__menu menu">
    <ul class="menu__list">
      <li class="menu__item" v-for="(item, key) in $t('menu')" :key="key">
        <router-link
          active-class="menu__link--active"
          :to="{ name: key, params: { page: 1 } }"
          class="menu__link"
        >
          <div class="menu__icon">
            <img :src="getUrl(key)" alt="" />
          </div>
          <div class="menu__title">{{ item }}</div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    getUrl(key) {
      return `/icons/${key}.svg`;
    },
  },
};
</script>
