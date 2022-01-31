<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column">
      <a target="_blank" :href="`https://tdcsk.com/products/${item.slug}`">
        {{ item.title }}
      </a>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip label="Изменить">
            <img
              @click="$emit('toggleEdit', 'products', item)"
              src="@/assets/icons/write_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  display: block;
}
</style>
