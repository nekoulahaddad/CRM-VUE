<template>
  <div :class="containerClasses">
    <div class="department__container--line" v-if="hLine" />
    <div :class="classes">
      <span class="item__title">{{ item.title }} {{ hLine }}</span>
      <div class="table__actions">
        <div class="table__icon" v-if="item.children.length">
          <VueCustomTooltip
            label="Показать разделы"
            v-if="!openedItems.includes(item._id)"
          >
            <img
              alt=""
              @click="$emit('toggleOpened', item._id)"
              src="@/assets/icons/sub_deps.svg"
            />
          </VueCustomTooltip>
          <VueCustomTooltip v-else label="Скрыть разделы">
            <img
              alt=""
              @click="$emit('toggleOpened', item._id)"
              src="@/assets/icons/arrow_top_white_icon.svg"
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Удалить">
            <img
              @click="$emit('deleteItem', item)"
              src="@/assets/icons/trash_icon_white.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
      </div>
    </div>
    <template v-if="openedItems.includes(item._id)">
      <v-item
        :level="level + 1"
        :item="child"
        v-for="(child, index) in item.children"
        :key="index"
        :openedItems="openedItems"
        @toggleOpened="$emit('toggleOpened', child._id)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: "VItem",
  props: {
    line: Boolean,
    hLine: Boolean,
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    openedItems: Array,
  },
  methods: {
    lineHeight(count) {
      return `100%`;
    },
  },
  computed: {
    containerClasses() {
      return {
        department__container: true,
        [`department__container--level-${this.level}`]: true,
        "department__container--has-child": !!this.item.children.length,
      };
    },
    classes() {
      return {
        item: true,
        department__item: true,
        "department__item--line": this.line,
        [`department__item--level-${this.level}`]: true,
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.item {
  cursor: auto !important;
}

.department__container {
  position: relative;
  margin-left: 20px;
  border-radius: $border-radius;

  &--has-child {
  }

  &--line {
    position: absolute;
    width: 6px;
    top: 5px;
    height: calc(100% - 26px);
    left: 8px;
    background-color: $color-black;
  }

  &--level-1 {
    margin-left: 0;
  }

  &--level-2,
  &--level-3,
  &--level-4 {
    background-color: $color-white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-bottom-right-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
  }

  &--level-3 {
    width: 1540px;
  }
  &--level-4 {
    width: 1510px;
  }
}

.department__item {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  color: $color-white;
  height: 48px;
  position: relative;

  &--level-1 {
    height: 80px;
    background: linear-gradient(45deg, #db1f35, #ff747a);
  }

  &--level-2 {
    background: linear-gradient(90deg, #ff747a, #6f2b8b);
  }

  &--level-3 {
    background: linear-gradient(90deg, #ff747a, #029faf);
  }

  &--level-4 {
    background: linear-gradient(90deg, #ff747a, #033e7d);
  }

  &--line:before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 6px;
    background-color: $color-black;
    left: -12px;
  }
  .vue-custom-tooltip.is-top:before {
    display: none;
  }
}
</style>
