<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/delivery_title.svg" alt="" />
      </div>
      <h1 class="page__title">Поставщики</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="providers" />
      </div>
      <div class="flex-1">
        <v-spinner v-if="!isLoading" />
        <table v-else class="table">
          <thead class="thead">
            <tr class="thead__top">
              <td colspan="7">
                <div class="table__title">Клиенты</div>
              </td>
            </tr>
            <tr class="thead__bottom">
              <td>№:</td>
              <td>Компания:</td>
              <td>ФИО:</td>
              <td>Дата создания:</td>
              <td>Email:</td>
              <td>Адрес:</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in dataset" :key="item.id">
              <td>{{ index + 1 + ($route.params.page - 1) * 15 }}</td>
              <td>{{ item.name }}</td>
              <td class="text--blue">
                {{ item.specialist ? item.specialist.name : "" }}
              </td>
              <td class="text--green">
                {{ item.specialist ? item.specialist.phone : "" }}
              </td>
              <td>{{ item.specialist ? item.specialist.email : "" }}</td>
              <td class="text--sapphire">{{ item.office_address }}</td>
              <td>
                <div class="table__actions">
                  <div class="table__icon">
                    <img src="/icons/info_icon.svg" alt="" />
                  </div>
                  <div class="table__icon">
                    <img src="/icons/write_icon.svg" alt="" />
                  </div>
                  <div class="table__icon">
                    <img src="/icons/trash_icon.svg" alt="" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import getDataFromPage from "@/api/getDataFromPage";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: { VFilter, VSpinner },
  data() {
    return {
      isLoading: false,
      dataset: [],
      filtersOptions: {
        region: "all",
      },
      open: false,
      addedItem: {},
      deleted: false,
      deletedItem: {},
      edit: false,
      editedItem: {},
      info: false,
      count: 0,
      search: "",
      isSearch: false,
    };
  },
  watch: {
    $route: function () {
      this.fetchData();
    },
    filtersOptions: {
      handler: function () {
        this.isSearch = false;
        this.search = "";
        this.fetchData();
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleInfo(item) {
      if (!this.info) {
        this.editedItem = item;
      } else {
        setTimeout(() => {
          this.editedItem = {};
        }, 500);
      }
      this.info = !this.info;
    },
    toggleOpen() {
      this.open = !this.open;
    },
    toggleDelete(id) {
      this.deleted = !this.deleted;
      this.deletedItem._id = id;
    },
    toggleEdit(item) {
      if (!this.edit) {
        this.editedItem = item;
      } else {
        setTimeout(() => {
          this.editedItem = {};
        }, 500);
      }
      this.edit = !this.edit;
    },
    addProvider(provider) {
      this.addedItem = provider;
      let dataset = this.dataset;
      if (dataset.length !== 15) {
        dataset.push(provider);
        this.dataset = dataset;
      }
      this.count++;
      setTimeout(() => {
        this.addedItem = {};
      }, 500);
    },
    removeProvider(provider) {
      this.deletedItem = provider;
      let index = this.dataset.findIndex((item) => item._id === provider._id);
      setTimeout(() => {
        let dataset = this.dataset;
        dataset.splice(index, 1);
        this.dataset = dataset;
      }, 500);
      this.deletedItem = {};
    },
    editProvider(provider) {
      this.editedItem = provider;
      setTimeout(() => {
        let dataset = this.dataset;
        let index = dataset.findIndex((item) => item._id === provider._id);
        dataset[index] = provider;
        this.dataset = dataset;
      }, 500);
      this.editedItem = {};
    },
    async fetchData() {
      try {
        const { data } = await getDataFromPage(
          "/providers/get",
          this.filtersOptions
        );

        this.isLoading = false;
        this.dataset = data.providers;
        this.count = data.count;
        this.isLoading = true;
      } catch (e) {}
    },
    getSearchData() {
      this.changeStatus(false);
      this.isSearch = true;
      let search = this.search;
      if (search.length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        this.changeStatus(true);
        return;
      }

      axios({
        url: "/providers/getfromsearch",
        data: { search },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        const providers = result.data.providers;
        if (providers.length) {
          this.$toast.success("Результаты запросов!");
        } else {
          this.$toast.error("Результаты не найдены!");
          this.search = "";
        }
        this.dataset = providers;
        this.isLoading = true;
        this.changeStatus(true);
      });
    },
  },
};
</script>
