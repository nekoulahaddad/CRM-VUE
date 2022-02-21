<template>
  <div class="org-modal">
    <div class="org-modal__inner">
      <div class="org-modal__title">Выбрать директора:</div>
      <input
        type="text"
        class="form-control"
        placeholder="Введите ФИО сотрудника..."
      />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.org-modal {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 54px;
  background-color: $color-white;
  display: flex;
  align-items: center;
  z-index: 900;

  &__inner {
    padding-left: 10px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: $color-black;
    margin-bottom: 10px;
  }

  .form-control {
    width: 268px;
  }
}
</style>
