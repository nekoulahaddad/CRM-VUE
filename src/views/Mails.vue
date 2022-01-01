<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/mails_title.svg" alt="" />
      </div>
      <h1 class="page__title">Заявки</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="callbacks" />
      </div>
      <div class="flex-1">
        <table class="table">
          <thead class="thead">
            <tr class="thead__top">
              <td colspan="11">
                <div class="table__title">Заявки</div>
              </td>
            </tr>
            <tr class="thead__bottom">
              <td>№:</td>
              <td>Клиент</td>
              <td>Регион:</td>
              <td>Дата создания:</td>
              <td>Тип:</td>
              <td>Менеджер:</td>
              <td>Номер заказа:</td>
              <td>Комментарий:</td>
              <td>Статус</td>
              <td>Файл</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dataset" :key="item.id">
              <td>{{ item.number }}</td>
              <td class="text--blue">
                {{
                  item.client && item.client[0]
                    ? transformName(item.client[0])
                    : item.name
                }}
              </td>
              <td>{{ item.regionTitle }}</td>
              <td class="text--green">{{ transformTime(item.createdAt) }}</td>
              <td>{{ item.formType }}</td>
              <td>
                {{
                  item.manager && item.manager[0]
                    ? transformFIO(item.manager[0])
                    : ""
                }}
              </td>
              <td>{{ item.orderNumber }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import getDataFromPage from "@/api/getDataFromPage";
import dateMixins from "@/mixins/date";
import nameMixins from "@/mixins/name";
import fioMixins from "@/mixins/fio";

export default {
  mixins: [dateMixins, fioMixins, nameMixins],
  components: { VFilter },
  data() {
    return {
      count: 0,
      dataset: [],
      filtersOptions: {
        dates: "all",
        created: null,
        deliver: null,
        buyed: null,
        type: "callbacks",
        number: 1,
        status: "all",
        region: null,
        executor: this.role === "manager" ? this.$store.state._id : null,
      },
      isLoading: false,
      edit: false,
      view: false,
      editedItem: {},
      deleted: false,
      deletedItem: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const { data } = await getDataFromPage(
          `/${this.filtersOptions.type}/get`,
          this.filtersOptions
        );

        this.dataset = data.callbacks;
        console.log(this.dataset);
      } catch (e) {}
    },
  },
};
</script>
