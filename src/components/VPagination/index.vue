<template>
  <paginate
    v-model="page"
    :page-count="Math.ceil(count / perPage)"
    :click-handler="clickHandler"
    :page-range="5"
    :prev-text="'<'"
    :next-text="'>'"
    :prev-class="'pagination__item'"
    :next-class="'pagination__item'"
    :container-class="'pagination'"
    :page-class="'pagination__item'"
  >
  </paginate>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      default: 12,
    },
    clickHandler: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      page: 1,
    };
  },
  watch: {
    $route: function () {
      this.page = this.$route.params.page;
    },
  },
  beforeMount() {
    this.page = this.$route.params.page;
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0 10px;
  &__arrow,
  &__item {
    a {
      border: 2px solid #dfe3e8;
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #212b36;
      font-weight: bold;
      width: 32px;
      height: 32px;
      background-color: $color-white;
    }
    &.active a {
      border-color: $color-red;
      color: $color-red;
    }
    & + .pagination__item {
      margin-left: 8px;
    }
  }
  .disabled {
    a {
      border-color: #919eab;
      background-color: #919eab;
      color: #c4cdd5;
    }
  }
}
</style>
