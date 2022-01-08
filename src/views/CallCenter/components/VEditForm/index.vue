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
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("phone") }}</div>
        <div class="group__content">
          <input type="text" class="form-control" :placeholder="$t('phone')" />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("region") }}</div>
        <div class="group__content">
          <input type="text" class="form-control" :placeholder="$t('region')" />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("category") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('category')"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("description") }}</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            :placeholder="$t('description')"
          ></textarea>
        </div>
      </div>
      <v-button red>{{ $t("save") }}</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

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
};
</script>
