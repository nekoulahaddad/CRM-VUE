<template>
  <div class="add-child">
    <div class="group">
      <div class="group__title">ФИО:</div>
      <div class="group__content">
        <input type="text" class="form-control" :placeholder="$t('lastName')" />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Дата рождения:</div>
      <div class="group__content">
        <datetime
          required
          type="datetime"
          input-class="forms__container--input"
          :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Пол:</div>
      <div class="group__content">
        <select class="form-select">
          <option value="">М</option>
          <option value="">Ж</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.add-child {
  margin-bottom: 10px;

  .form-control {
    width: 976px;
  }
  .vdatetime-input,
  .form-select {
    width: 401px;
  }
}
</style>
