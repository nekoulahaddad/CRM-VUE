<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/employees_title.svg" alt="" />
      </div>
      <h1 class="page__title">Сотрудники</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="group" />
      </div>

      <!-- Контент -->
      <div class="list flex-1">
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="list__item item">
          <div class="item__column">Москва и М.О</div>
          <div class="item__column bg--blue">
            Менеджер по продажам (подвсные потолки)
          </div>
          <div class="item__column text--green">15.12.2021 г.</div>
          <div class="item__column bg--green">Отдел продаж</div>
          <div class="item__actions">
            <div class="item__icon">
              <img src="/icons/info_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/write_icon.svg" alt="" />
            </div>
            <div class="item__icon">
              <img src="/icons/trash_icon.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import getDataFromPage from "../api/getDataFromPage";

export default {
  components: { VFilter },
  data() {
    return {
      // open: false,
      openEdit: false,
      openDelete: false,
      open: {
        create: false,
        view: false,
        edit: false,
        delete: false,
        childrenExport: false,
      },
      dataset: [],
      addedItem: {},
      deletedItem: {},
      updatedItem: {},
      infoItem: {},
      isLoading: false,
      count: 0,
      filtersOptions: {},
      user: "",
    };
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.updateData(await getDataFromPage("/user/get", this.filtersOptions));
    },
    updateData(res) {
      this.isLoading = false;
      this.dataset = res.data.users;
      this.count = res.data.count ? res.data.count : 0;
      this.isLoading = true;
    },
    resetFilters() {
      this.$refs.filters.filterOptions = {};
      this.$refs.filters.activeIndex = 0;
      this.filtersOptions = {};
    },
  },
};
</script>
