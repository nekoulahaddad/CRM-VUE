<template>
  <button
    :disabled="disabled"
    @click="$emit('click')"
    :class="classes"
    class="btn"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    red: {
      type: Boolean,
      default: false,
    },
    white: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        "btn--full": this.full,
        "btn--red": this.red,
        "btn--white": this.white,
      };
    },
  },
};
</script>
