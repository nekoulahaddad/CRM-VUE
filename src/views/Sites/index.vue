<template>
  <div class="page delivery-page">
    <v-page-header
      :title="$t('pages.sites.pageTitle')"
      icon="sites_title"
      :filterToggle="false"
    />
    <div class="page__body d-flex">
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import VPageHeader from "@/components/VPageHeader";
import { mapGetters } from "vuex";

export default {
  components: { VPageHeader },
  data() {
    return {
      showFilter: false,
    };
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
  },
};
</script>
