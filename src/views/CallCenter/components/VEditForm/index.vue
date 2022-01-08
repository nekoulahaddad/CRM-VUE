<template>
  <div class="list__info list-info callback-list-info">
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
    <div class="group">
      <div class="group__title">{{ $t("clientFirstName") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('clientFirstName')"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("clientMiddleName") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('clientMiddleName')"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("phone") }}</div>
      <div class="group__content">
        <input type="text" class="form-control" :placeholder="$t('phone')" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("region") }}</div>
      <div class="group__content">
        <input type="text" class="form-control" :placeholder="$t('region')" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("category") }}</div>
      <div class="group__content">
        <input type="text" class="form-control" :placeholder="$t('category')" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("description") }}</div>
      <div class="group__content">
        <textarea
          class="form-textarea"
          :placeholder="$t('description')"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
