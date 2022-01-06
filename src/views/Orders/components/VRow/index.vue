<template>
  <tr :class="classes" :key="item.id">
    <td>{{ item.number }}</td>
    <td class="text--blue">{{ transformName(item.client) }}</td>
    <td>{{ item.region.title }}</td>
    <td class="text--green">
      {{ transformDate(item.createdAt) }}
    </td>
    <td class="text--sapphire">
      {{ item && item.buyed ? transformDate(item.buyed) : "" }}
    </td>
    <td class="text--sapphire">
      {{ item.deliver ? transformDate(item.deliver) : "" }}
    </td>
    <td>
      {{ item.sum.toFixed(2) + " " + item.region.valute.icon }}
    </td>
    <td>
      {{
        (item.deliverySum ? item.deliverySum.toFixed(2) : "0.00") +
        " " +
        item.region.valute.icon
      }}
    </td>
    <td class="text--blue">
      {{ transformFIO(item.manager[0]) }}
    </td>
    <td v-html="transformStatus(item.status)"></td>
    <td>
      <div class="table__actions">
        <div class="table__icon">
          <img
            :class="{
              none: !item.oneC.requested,
              req: item.oneC.requested && !item.oneC.accepted,
            }"
            :title="getOneCStatus(item.oneC)"
            src="@/assets/icons/1c_icon.svg"
            alt=""
          />
        </div>
        <div class="table__icon">
          <img src="@/assets/icons/info_icon.svg" alt="" />
        </div>
        <div class="table__icon">
          <img src="@/assets/icons/write_icon.svg" alt="" />
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    gray: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      classes: {
        gray: this.$props.gray,
      },
    };
  },
};
</script>
