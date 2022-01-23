<template>
  <nav class="sidebar__menu menu" :style="{ height }">
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
      height: "100%",
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
  mounted() {
    this.height = `calc(${window.innerHeight}px - 220px)`;
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.menu {
  background-color: #f8f9fe;
  border-radius: $border-radius;
  width: 169px;
  margin-top: 8px;
  padding: 3px 0 3px 2px;
  position: relative;
  left: 2px;

  .sidebar--collapse & {
    width: 55px;
  }

  &__item {
    width: 160px;
    height: 45px;

    .sidebar--collapse & {
      width: 46px;
    }

    & + .menu__item {
      margin-top: 5px;
    }
  }

  &__icon {
    width: 46px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      position: relative;
      top: -1px;
      left: -1px;
      width: 30px;
      height: 30px;
    }
  }

  &__link {
    color: $color-black;
    display: flex;
    width: 100%;
    border-radius: $border-radius;
    height: 100%;
    align-items: center;
    border: 1px solid transparent;

    &--active {
      background-color: $color-white;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.08),
        0 4px 8px rgba(50, 50, 71, 0.006);
      border-color: #f2f2f7;

      .menu__title {
        color: $color-red;
      }
    }
  }

  &__title {
    font-weight: bold;
    margin-left: 10px;
    transition: opacity 0.2s 0.2s;

    .sidebar--collapse & {
      display: none;
    }
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #f6f6f6;
    width: 5px;
    height: 100%;
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }
}

.menu__link--active {
  svg path {
    fill: $color-red;
  }
}
</style>
