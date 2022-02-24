<template>
  <div class="search">
    <input
      ref="searchInput"
      class="search__input"
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
      @keydown.enter.prevent="$emit('submit', $event.target.value)"
    />
    <img
      alt=""
      class="search__icon"
      src="@/assets/icons/close_icon.svg"
      width="20px"
      height="20px"
      v-if="value.length"
      @click="clear"
    />
    <img
      alt=""
      class="search__icon"
      src="@/assets/icons/search.svg"
      @click="$emit('submit')"
      v-else
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    value: String,
  },
  data() {
    return {};
  },
  methods: {
    clear() {
      this.$refs.searchInput.value = "";
      this.$emit("input", "");
      this.$emit("submit", "");
    },
  },
};
</script>

<style lang="scss">
.search {
  position: relative;

  &__input {
    border: 0;
    border-bottom: 1px solid #e6eaf0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    color: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    font-weight: 700;
    display: block;

    &::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }
  }

  &__icon {
    position: absolute;
    top: 7px;
    right: 5px;
    cursor: pointer;
  }
}
</style>
