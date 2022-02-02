<template>
  <div class="list__info list-info delivery-list-info">
    <div class="group__title text--blue">
      {{ $t("pages.delivery.info") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("companyName") }}
        </div>
        <div class="group__value">{{ item.name }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("site") }}
        </div>
        <div class="group__value">{{ item.site }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("region") }}
        </div>
        <div class="group__value">{{ item.region.title }}</div>
      </div>
    </div>
    <div class="group__title text--blue">
      {{ $t("director") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("fio") }}
        </div>
        <div class="group__value">{{ item.director.name }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("birthday") }}
        </div>
        <div class="group__value">{{ transformDate(item.director.birth) }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("phone") }}
        </div>
        <div class="group__value">{{ item.director.phone }}</div>
      </div>
    </div>

    <!-- Специалист -->
    <div class="group__title text--blue">
      {{ $t("specialist") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("fio") }}
        </div>
        <div class="group__value">{{ item.specialist.name }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("birthday") }}
        </div>
        <div class="group__value">
          {{ transformDate(item.specialist.birth) }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("phone") }}
        </div>
        <div class="group__value">{{ item.specialist.phone }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">
          {{ $t("email") }}
        </div>
        <div class="group__value">{{ item.specialist.email }}</div>
      </div>
    </div>

    <template
      v-if="item.specialist.messengers && item.specialist.messengers.length"
    >
      <div
        v-for="messenger in item.specialist.messengers"
        :key="messenger.name"
        class="list-info__group group"
      >
        <div class="group__content">
          <div class="group__item text--bold-600">
            {{ messenger.name }}
          </div>
          <div class="group__value">{{ messenger.phone }}</div>
        </div>
      </div>
    </template>

    <!-- Категории -->
    <template v-if="categories.length">
      <div class="group__title text--blue">
        {{ $t("categories") }}
      </div>
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-600">
            {{ $t("categories") }}
          </div>
          <div class="group__value">
            <span
              v-for="(chip, index) in categories ? categories : item.categories"
              :key="chip.categoryName"
            >
              {{ chip.categoryName }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { REGION_MOSCOW_ID } from "../../../../constants";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      categories: this.item && this.item.categories ? this.item.categories : [],
      region: REGION_MOSCOW_ID,
    };
  },
  async mounted() {
    await axios({
      url: "/regions/get",
    }).then(async (res) => {
      let result = await res;
      this.regions = result.data.regions;
    });

    if (this.item) {
      await axios({
        url: `/providers/getcategories/`,
        data: {
          parent_id: this.item._id,
          region: this.region,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        this.item.categories = result.data.categories;
        this.categories = result.data.categories;
      });
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.delivery-list-info {
  .group__title {
    position: relative;
    font-size: 16px;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        display: block;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        top: 0;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
}
</style>
