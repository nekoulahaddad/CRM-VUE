<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-employee-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить сотрудника
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addEmployee',
            })
          "
          class="add-employee-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-employee-row__inner">
      <v-employee-form />
    </div>
  </div>
</template>

<script>
import VEmployeeForm from "../VEmployeeForm";

export default {
  components: { VEmployeeForm },
};
</script>

<style lang="scss">
.add-employee-row {
  .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      position: relative;
    }
  }

  .list__column--title {
    font-size: 16px;
  }

  &__inner {
    padding: 10px;
  }

  button {
    width: 230px;
    height: 37px;
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
