<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/storage_title.svg" alt="" />
      </div>
      <h1 class="page__title">Склад</h1>
    </div>
    <div class="page__body d-flex">
      <div class="filter">
        <div class="filter__inner">
          <div class="filter__header">
            <div class="filter__title">Фильтр</div>
          </div>
          <div class="filter__body">
            <div class="filter__group group">
              <div class="group__title">Регионы:</div>
              <div class="group__content">
                <select class="form-select">
                  <option value="Все задачи">Все регионы</option>
                </select>
              </div>
            </div>
            <div class="filter__actions">
              <button class="btn btn--red filter__btn">Очистить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
