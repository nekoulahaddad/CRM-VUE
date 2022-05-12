<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ index + 1 + ($route.params.page - 1) * 15 }}
    </div>
    <div class="list__column text--blue">{{ transformName(client) }}</div>
    <div class="list__column">{{ client.email }}</div>
    <div class="list__column">{{ client.phone }}</div>
    <div class="list__column text--sapphire">
      {{ client.region && client.region.title }}
    </div>
    <div class="list__column text--green">
      {{ transformDate(client.createdAt) }}
    </div>
    <div class="list__column">
      {{
        client.region
          ? client.company
            ? client.balance + " " + client.region.valute.icon
            : client.total.toFixed(2) + " " + client.region.valute.icon
          : ""
      }}
    </div>
    <div class="list__column">{{ client.clubCard }}</div>
    <div class="list__column">
      <div class="table__actions">
        <div
          class="table__icon"
          v-if="
            client.orders.length &&
            (role === 'superadmin' ||
              role === 'director' ||
              role === 'buyer' ||
              role === 'manager')
          "
        >
          <VueCustomTooltip v-if="infoItem._id !== client._id" label="Просмотр">
            <img
              alt=""
              src="/icons/info_icon.svg"
              @click="$emit('toggleInfo', client)"
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', client)"
          />
        </div>
        <div class="table__icon" v-if="role === 'superadmin'">
          <VueCustomTooltip label="Удалить">
            <img
              alt=""
              src="/icons/trash_icon.svg"
              @click="$emit('toggleDelete', client)"
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
    client: {
      type: Object,
      required: true,
    },
    infoItem: {
      type: Object,
    },
    index: {
      type: Number,
    },
    role: String,
  },
};
</script>
