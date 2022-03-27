<template>
  <div
    class="list__columns list__columns-shadow list__columns-white order-item"
  >
    <div class="list__column d-flex align-items-center">
      <input
        type="checkbox"
        :disabled="role !== 'superadmin'"
        class="form-checkbox"
        :checked="checked"
        @click="$store.commit('selectItem', item._id)"
      />
      {{ item.number }}
    </div>
    <div class="list__column text--blue">
      {{ transformName(item.client) }}
    </div>
    <div class="list__column">{{ item.region.title }}</div>
    <div class="list__column text-green">
      {{ transformDate(item.createdAt) }}
    </div>
    <div class="list__column text--sapphire">
      {{ item && item.buyed ? transformDate(item.buyed) : "" }}
    </div>
    <div class="list__column text--sapphire">
      {{ item.deliver ? transformDate(item.deliver) : "" }}
    </div>
    <div class="list__column">
      {{ item.sum && item.sum.toFixed(2) + " " + item.region.valute.icon }}
    </div>
    <div class="list__column">
      {{
        (item.deliverySum ? item.deliverySum.toFixed(2) : "0.00") +
        " " +
        item.region.valute.icon
      }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(item.manager[0]) }}
    </div>
    <div v-html="transformStatus(item.status)" class="list__column"></div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip :label="getOneCStatus(item.oneC)">
            <img
              :class="{
                none: item && item.oneC && !item.oneC.requested,
                req: item.oneC.requested && !item.oneC.accepted,
              }"
              src="@/assets/icons/1c_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <VueCustomTooltip v-if="infoItem._id !== item._id" label="Просмотр">
            <img
              alt=""
              src="@/assets/icons/info_icon.svg"
              @click="$emit('toggleInfo', item)"
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', item)"
          />
        </div>
        <div class="table__icon" style="width: 28px">
          <template v-if="role === 'superadmin'">
            <img
              v-if="item.status.value === 'delivered'"
              style="opacity: 0.2"
              src="@/assets/icons/write_icon.svg"
              alt=""
            />
            <VueCustomTooltip
              v-else-if="editedItem._id !== item._id"
              label="Изменить"
            >
              <img
                src="@/assets/icons/write_icon.svg"
                @click="$emit('toggleEdit', item)"
                alt=""
              />
            </VueCustomTooltip>
            <img
              alt=""
              v-else
              src="@/assets/icons/arrow_top_icon.svg"
              @click="$emit('toggleEdit', item)"
            />
          </template>
          <div class="table__hidden-icon" v-else></div>
        </div>
        <div class="table__icon">
          <VueCustomTooltip v-if="role === 'superadmin'" label="Удалить">
            <img
              alt=""
              src="@/assets/icons/trash_icon.svg"
              @click="$emit('toggleDelete', item)"
            />
          </VueCustomTooltip>
          <div class="table__hidden-icon" v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import oneCMixins from "@/mixins/oneC";

export default {
  mixins: [oneCMixins],
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
    checked: Boolean,
    editedItem: {
      type: Object,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    role: String,
  },
};
</script>

<style lang="scss">
.order-item {
  .list__column:first-child {
    text-align: left;
  }
  .none {
    opacity: 0.3;
    filter: grayscale(100%);
  }
}
</style>
