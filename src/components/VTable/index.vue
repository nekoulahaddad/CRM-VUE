<template>
  <table class="table table--separate">
    <thead class="thead">
      <tr class="thead__top">
        <td :colspan="colspan">
          <div class="table__title">{{ title }}</div>
        </td>
      </tr>
      <tr class="thead__bottom">
        <td v-for="(field, index) in fields" :key="index">{{ field }}</td>
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    colspan: {
      type: Number,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
