<template>
  <div class="search">
    <form>
      <input class="search__input" type="text" placeholder="Поиск" />
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.search {
  &__input {
    border: 0;
    border-bottom: 1px solid #e6eaf0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    color: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    font-weight: 700;
    display: block;

    &::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
