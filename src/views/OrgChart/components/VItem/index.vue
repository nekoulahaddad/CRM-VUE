<template>
  <div class="department__container">
    <div :class="classes">{{ item.title }}</div>
    <v-item
      :level="level + 1"
      :item="child"
      v-for="(child, index) in item.children"
      :key="index"
    />
  </div>
</template>

<script>
export default {
  name: "VItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  computed: {
    classes() {
      return {
        department__item: true,
        [`department__item--level-${this.level}`]: true,
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.department__item {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;

  &--level-1 {
    height: 80px;
    background: linear-gradient(45deg, #db1f35, #ff747a);
  }

  &--level-2 {
    height: 48px;
    margin-left: 20px;
    background: linear-gradient(90deg, #ff747a, #6f2b8b);
  }

  &--level-3 {
    height: 48px;
    margin-left: 40px;
    background: linear-gradient(90deg, #ff747a, #029faf);
  }

  &--level-4 {
    height: 48px;
    margin-left: 60px;
    background: linear-gradient(90deg, #ff747a, #033e7d);
  }
}
</style>
