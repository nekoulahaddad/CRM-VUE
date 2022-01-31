<template>
  <div
    class="list__columns list__columns--shadow set-list__columns list__columns--white"
  >
    <div class="list__column">{{ index + 1 }}</div>
    <div class="list__column bg bg--blue-light">{{ item.categoryName }}</div>
    <div class="list__column">
      <a :href="getUrl(item.url)" target="_blank">{{ item.url }}</a>
    </div>
    <div class="list__column text text--green">
      {{ transformTime(item.updatedAt) }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip label="Обновить">
            <img
              @click="$emit('updateSite', item._id)"
              src="@/assets/icons/reload.svg"
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
    index: Number,
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getUrl(url) {
      return `http://${url}`;
    },
  },
};
</script>
