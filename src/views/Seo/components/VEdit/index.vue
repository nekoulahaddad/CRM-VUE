<template>
  <div class="list__info list-info purchase-list-info">
    <form @submit.prevent="">
      <div class="group__title text--blue">
        {{ $t("pages.seo.editCategory") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("pageTitle") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('pageTitle')"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("keywords") }}</div>
        <div class="group__content">
          <textarea class="form-textarea" :placeholder="$t('keywords')" />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("pageDescription") }}</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            :placeholder="$t('pageDescription')"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("metaDescription") }}</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            :placeholder="$t('metaDescription')"
          />
        </div>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: { VButton },
};
</script>
