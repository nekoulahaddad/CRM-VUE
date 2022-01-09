<template>
  <div class="list__info list-info callback-edit-form">
    <form @submit.prevent="">
      <div class="group__title text--blue">
        {{ $t("editCallback") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("clientLastName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('clientLastName')"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>
