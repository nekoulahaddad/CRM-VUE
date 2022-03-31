<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column">
      <a target="_blank" :href="`https://tdcsk.com/products/${item.slug}`">
        {{ item.title }}
      </a>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon" v-if="role === 'superadmin' || role === 'seo'">
          <VueCustomTooltip v-if="!showEdit" label="Изменить">
            <img
              alt=""
              @click="$emit('toggleEdit', 'products', item)"
              src="@/assets/icons/write_icon.svg"
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            @click="$emit('toggleEdit', 'products', item)"
            src="@/assets/icons/arrow_top_icon.svg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showEdit: Boolean,
    item: {
      type: Object,
    },
    role: String,
  },
};
</script>

<style lang="scss" scoped>
a {
  display: block;
}
</style>
