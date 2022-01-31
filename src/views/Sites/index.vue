<template>
  <div class="page delivery-page">
    <v-page-header
      :title="$t('pages.sites.pageTitle')"
      icon="sites_title"
      :filterToggle="false"
    />
  </div>
</template>

<script>
import VPageHeader from "@/components/VPageHeader";

export default {
  components: { VPageHeader },
};
</script>
