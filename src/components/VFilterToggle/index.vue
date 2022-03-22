<template>
  <div class="d-flex align-items-center">
    <div
      v-if="goods && getCurrentRegion"
      class="d-flex align-items-center current-region"
    >
      <img src="@/assets/icons/location.svg" alt="" />
      <span>Регион:</span>
      <span style="font-weight: bold">
        {{ getCurrentRegion.title }}
      </span>
    </div>
    <div v-if="active" class="filter-toggle" @click="toggleFilter">
      <div class="filter-toggle__inner">
        <div class="filter-toggle__icon">
          <img src="@/assets/icons/filter.svg" alt="" />
        </div>
        <div class="filter-toggle__text">Фильтр</div>
      </div>
    </div>
    <img
      v-else
      src="@/assets/icons/filter_active.svg"
      @click="toggleFilter"
      class="filter-toggle"
      alt=""
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    active: Boolean,
    goods: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleFilter() {
      this.$emit("toggleFilter");
    },
  },
  computed: {
    ...mapGetters(["getCurrentRegion"]),
  },
  watch: {
    active() {
      if (this.active) {
        this.$scrollTo("body", 300);
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.filter-toggle {
  cursor: pointer;

  &__inner {
    width: 124px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 14px;
    padding-right: 14px;
    border-radius: $border-radius;
    border: 2px solid #db1f35;
    background-color: $color-white;
  }

  &__text {
    color: $color-red;
    font-size: 16px;
    font-weight: bold;
  }
}

img {
  cursor: pointer;
}
.current-region {
  margin-right: 30px;
  font-size: 16px;

  img {
    margin-right: 7px;
  }

  span {
    margin-right: 10px;
  }
}
</style>
