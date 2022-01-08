<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ report.number || index + 1 + ($route.params.page - 1) * 15 }}
    </div>
    <div class="list__column">
      <div class="bg bg--blue-light">{{ report.title }}</div>
    </div>
    <div class="list__column text--green">
      {{ transformDate(report.created) }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(report.initiator) }}
    </div>
    <div class="list__column">
      {{ transformFIO(report.executor) }}
    </div>
    <div class="list__column text text--sapphire">
      {{
        report.executor.region.title.length > 15
          ? report.executor.region.title.slice(0, -14) + "..."
          : report.executor.region.title
      }}
    </div>
    <div class="list__column" v-html="transformStatus(report.status)" />
    <div class="list__column" v-html="transformMark(report.mark)" />
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            alt=""
            src="@/assets/icons/info_icon.svg"
            v-if="infoItem._id !== report._id"
            @click="$emit('toggleInfo', report)"
          />
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', report)"
            v-else
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
    },
    infoItem: {
      type: Object,
    },
    report: {
      type: Object,
      required: true,
    },
  },
};
</script>
