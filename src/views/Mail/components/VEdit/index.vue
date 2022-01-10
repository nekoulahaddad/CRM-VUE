<template>
  <div class="list__info list-info mail-edit-form">
    <form @submit.prevent="">
      <div class="edit__inner">
        <div class="group__title text--blue">
          {{ $t("pages.mail.edit") }}
        </div>
        <div class="group">
          <div class="group__title">{{ $t("manager") }}</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              :placeholder="$t('manager')"
              v-model="fio"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("orderNumber") }}</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              :placeholder="$t('orderNumber')"
              v-model="orderNumber"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("comment") }}</div>
          <div class="group__content">
            <textarea
              class="form-textarea"
              :placeholder="$t('comment')"
              v-model="comment"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <v-button red>{{ $t("save") }}</v-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    VButton,
  },
  data() {
    return {
      users: [],
      fio: "",
      comment: null,
      orderNumber: null,
      isLoading: false,
    };
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    async getUsersByFIO() {
      axios(`/user/getmanagers/${this.fio}/${this.item.region._id}`).then(
        async (res) => {
          let result = await res;
          this.users = result.data;
        }
      );
    },
    selectUser(user) {
      this.manager = user._id;
      this.fio = `${user.surname} ${user.name.charAt(0)}.${
        user.lastname ? user.lastname.charAt(0) + "." : ""
      }`;
      this.users = [];
    },
    onCallbackUpdate() {
      this.changeStatus(false);
      let callbackData = {
        callbackId: this.item._id,
        manager: this.manager,
        comment: this.comment,
        orderNumber: this.orderNumber,
      };
      axios({
        url: `/callbacks/update/`,
        data: callbackData,
        method: "POST",
      }).then(() => {
        this.$emit("toggleOpen");
        this.$emit("editCallback");
        this.changeStatus(true);
      });
    },
  },
  created() {
    this.orderNumber = this.item.orderNumber;
    this.comment = this.item.comment;
    this.fio = `${
      this.item.manager[0].surname
    } ${this.item.manager[0].name.charAt(0)}.${
      this.item.manager[0].lastname
        ? this.item.manager[0].lastname.charAt(0) + "."
        : ""
    }`;
    this.manager = this.item.manager[0]._id;
  },
};
</script>

<style lang="scss">
.mail-list-info {
  .group {
    max-width: 976px;

    select {
      max-width: 401px;
    }
  }
}
</style>
