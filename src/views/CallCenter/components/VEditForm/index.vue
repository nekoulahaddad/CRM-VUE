<template>
  <div class="list__info list-info callback-list-info">
    <form @submit.prevent="onProvidersAdd">
      <div class="group__title text--blue">
        {{ $t("editCallback") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("clientLastName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('clientLastName')"
            v-model="lastname"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("clientFirstName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('clientFirstName')"
            v-model="firstname"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("clientMiddleName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('clientMiddleName')"
            v-model="middlename"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("phone") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('phone')"
            v-model="phone"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("region") }}</div>
        <div class="group__content">
          <select class="form-select" name="region" v-model="region">
            <option
              v-for="(item, index) in regions"
              :selected="
                editedItem ? item.value === editedItem.region.value : false
              "
              :value="item"
            >
              {{ item.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("category") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('category')"
            v-model="category.categoryName"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("description") }}</div>
        <div class="group__content">
          <textarea class="form-textarea" :placeholder="$t('description')">
            {{ message }}
          </textarea>
        </div>
      </div>
      <v-button red>{{ $t("save") }}</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";

export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fio: "",
      currentInput: "",
      categories:
        this.editedItem && this.editedItem.categories
          ? this.editedItem.categories
          : [],
      firstname:
        this.editedItem && this.editedItem.client.name
          ? this.editedItem.client.name
          : "",
      lastname:
        this.editedItem && this.editedItem.client.surname
          ? this.editedItem.client.surname
          : "",
      middlename:
        this.editedItem && this.editedItem.client.lastname
          ? this.editedItem.client.lastname
          : "",
      phone:
        this.editedItem && this.editedItem.phone ? this.editedItem.phone : "",
      orderNumber:
        this.editedItem && this.editedItem.orderNumber
          ? this.editedItem.orderNumber
          : null,
      category:
        this.editedItem && this.editedItem.category
          ? this.editedItem.category.category
          : null,
      issuedTo:
        this.editedItem && this.editedItem.issuedTo
          ? this.editedItem.issuedTo
          : null,
      issuedBy:
        this.editedItem && this.editedItem.issuedBy
          ? this.editedItem.issuedBy
          : null,
      message:
        this.editedItem && this.editedItem.message
          ? this.editedItem.message
          : "",
      comment:
        this.editedItem && this.editedItem.comment
          ? this.editedItem.comment
          : "",
      status:
        this.editedItem && this.editedItem.status
          ? this.editedItem.status
          : null,
      statusList: ["отказ", "подтвержденный"],
      users: [],
      regions: [],
      region:
        this.editedItem && this.editedItem.region
          ? this.editedItem.region
          : null,
      title: this.editedItem ? "Редактировать обращения" : "Добавить обращения",
      confirmMsg: {
        header: "Вы уверены?",
        message: "Подтвердите действие.",
      },
      dialog: {
        header: "",
        message: "",
        callback: null,
        args: [],
      },
    };
  },
  components: { VButton },
  methods: {
    onProvidersAdd() {},
  },
  watch: {
    currentInput: function () {
      if (this.region === null) {
        this.$toast.warning("Укажите регион!", "Ошибка");
      }
    },
    region: async function () {
      if (this.region !== null) {
        this.currentInput = "";
        await axios({
          url: "/categories/get/",
          data: {
            options: {
              nesting: 0,
              region: this.region._id,
            },
          },
          method: "POST",
        }).then(async (res) => {
          this.category = null;
          this.categories = res.data.categories;
        });
      }
    },
  },
  async created() {
    await axios({
      url: "/regions/get",
    }).then(async (res) => {
      this.regions = res.data.regions;
    });

    if (this.editedItem) {
      await axios({
        url: "/categories/get/",
        data: {
          options: {
            nesting: 0,
            region: this.region._id,
          },
        },
        method: "POST",
      }).then(async (res) => {
        this.editedItem.categories = res.data.categories;
        this.categories = res.data.categories;
        this.tempViews = res.data.categories;
      });
    }
  },
};
</script>
