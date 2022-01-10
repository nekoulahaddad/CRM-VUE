<template>
  <div class="list__info list-info mail-edit-form">
    <form @submit.prevent="">
      <div class="edit__inner">
        <div class="edit__title text--blue">
          {{ $t("pages.mail.edit") }}
        </div>
        <div class="group">
          <div class="group__title">{{ $t("manager") }}</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              :placeholder="$t('manager')"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("orderNumber") }}</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              :placeholder="$t('orderNumber')"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("comment") }}</div>
          <div class="group__content">
            <textarea
              class="form-textarea"
              :placeholder="$t('comment')"
            ></textarea>
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <v-button red>{{ $t("save") }}</v-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: {
    VButton,
  },
};
</script>

<style lang="scss">
.mail-list-info {
  .group {
    max-width: 976px;

    select {
      max-width: 401px;
    }
  }
}
</style>
