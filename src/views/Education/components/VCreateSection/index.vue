<template>
  <div class="list create-section-list">
    <div class="list__row list__row--shadow list__row--opened">
      <div
        class="list__columns list__columns--shadow list__columns--white education-list-columns"
      >
        <div class="list__column">Добавить новый раздел:</div>
        <img
          @click="$emit('close')"
          class="close-icon"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>

      <div class="list__info list-info education-list-info">
        <form>
          <div class="edit__inner">
            <div class="group">
              <div class="group__title">Наименование раздела:</div>
              <div class="group__content">
                <input
                  class="form-control"
                  placeholder="Введите название раздела..."
                  type="text"
                />
              </div>
            </div>
            <div class="group">
              <div class="group__title">Описание раздела::</div>
              <div class="group__content">
                <textarea
                  class="form-textarea"
                  placeholder="Введите описание раздела..."
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.create-section-list {
  .close-icon {
    cursor: pointer;
    right: 10px;
    top: 13px;
    position: absolute;
  }
}
</style>
