<template>
  <button
    :disabled="disabled"
    @click="$emit('click')"
    :class="classes"
    class="btn"
  >
    <svg
      v-if="disabled"
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 38 38"
      stroke="#fff"
    >
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="2">
          <circle stroke-opacity=".2" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur=".4s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
    <slot v-else />
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
    redWhite: {
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
        "btn--red-white": this.redWhite,
      };
    },
  },
};
</script>
