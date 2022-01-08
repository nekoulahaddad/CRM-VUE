<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ index + 1 + ($route.params.page - 1) * 15 }}
    </div>
    <div class="list__column text--blue">{{ transformName(client) }}</div>
    <div class="list__column">{{ client.email }}</div>
    <div class="list__column">{{ client.phone }}</div>
    <div class="list__column text--sapphire">{{ client.region.title }}</div>
    <div class="list__column text--green">
      {{ transformDate(client.createdAt) }}
    </div>
    <div class="list__column">
      {{
        client.company
          ? client.balance + " " + client.region.valute.icon
          : client.total.toFixed(2) + " " + client.region.valute.icon
      }}
    </div>
    <div class="list__column">{{ client.clubCard }}</div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            @click="$emit('toggleInfo', client)"
            src="/icons/info_icon.svg"
            alt=""
          />
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
    index: {
      type: Number,
    },
  },
};
</script>
