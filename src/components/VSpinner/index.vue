<template>
  <div class="spinner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="extraSmall ? 24 : small ? '32' : '38'"
      :height="extraSmall ? 24 : small ? '32' : '38'"
      viewBox="0 0 38 38"
      stroke="#db1f35"
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
              dur=".8s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    extraSmall: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
