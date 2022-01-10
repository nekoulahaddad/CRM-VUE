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
              placeholder="Введите название задачи..."
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>
