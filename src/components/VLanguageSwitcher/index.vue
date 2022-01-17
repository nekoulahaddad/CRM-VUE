<template>
  <div class="language-switcher" @click="toggleSwitcher">
    <div
      class="language-switcher__button"
      :class="{ 'language-switcher__button--toggle': toggle }"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggle: false,
    };
  },
  methods: {
    toggleSwitcher() {
      this.toggle = !this.toggle;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.language-switcher {
  width: 37px;
  height: 15.42px;
  background-color: $color-red;
  cursor: pointer;
  position: relative;

  &__button {
    background-color: $color-white;
    width: 14.8px;
    height: 11.68px;
    top: 2px;
    left: 2px;
    transition: left 0.2s ease-in-out;
    position: absolute;

    &--toggle {
      left: 19px;
    }
  }
}
</style>
