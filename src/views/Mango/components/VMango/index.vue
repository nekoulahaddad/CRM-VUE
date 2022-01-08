<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ index + 1 + ($route.params.page - 1) * 15 }}
    </div>
    <div class="list__column">
      <div class="bg bg--blue-light">
        {{ transformPhone(item.from.number) }}
      </div>
    </div>
    <div class="list__column text--green">
      {{ transformPhone(item.to.number) }}
    </div>
    <div class="list__column">
      <div class="bg bg--green-light">
        {{ transformTime(item.createdAt) }}
      </div>
    </div>
    <div class="list__columns">
      <div class="table__actions">
        <div class="table__icon">
          <img
            @click="$emit('togglePlay', item)"
            v-if="status && play._id === item._id"
            src="@/assets/icons/pause_icon.svg"
            title="Пауза"
            alt="Пауза"
          />
          <img
            v-else
            @click="$emit('togglePlay', item)"
            src="@/assets/icons/play_icon.svg"
            title="Воспроизвести"
            alt="Воспроизвести"
          />
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
      required: true,
    },
    index: {
      type: Number,
    },
    play: {
      type: Object,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
