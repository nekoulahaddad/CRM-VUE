<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-vacancy-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Новая вакансия
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addVacancy',
            })
          "
          class="add-vacancy-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.add-vacancy-row {
  .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      font-size: 16px;
      position: relative;
    }
  }

  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
</style>
