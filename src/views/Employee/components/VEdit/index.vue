<template>
  <div class="list__info list-info employee-edit-form">
    <form @submit.prevent="">
      <div class="group__title text--blue">
        {{ $t("pages.employee.employeeMainInfo") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("lastName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('lastName')"
            :value.trim="item ? item.surname : surname"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("firstName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('firstName')"
            :value.trim="item ? item.name : name"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("middleName") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('middleName')"
            :value.trim="item ? item.lastname : lastname"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("mail") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('mail')"
            :value="item ? item.email : email"
            @input="onChange($event)"
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
            :value="item ? item.phone : phone"
            v-maska="['+# ### ### ## ##', '+### ### ## ## ##', 'a*']"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group__title text--blue">
        {{ $t("pages.employee.employeeAddInfo") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("department") }}</div>
        <div class="group__content">
          {{ departments }}
          <select
            class="form-select"
            :value="item ? item.department.value : department"
            @change="onChange($event)"
          >
            <option
              v-for="(item, index) in departments"
              :selected="item ? item.value === item.department.value : false"
              :value="item.value"
            >
              {{ item.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("subDepartment") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('subDepartment')"
            :value="item ? item.sub_department : sub_department"
            @input="onChange($event)"
          />
        </div>
      </div>

      <div class="group">
        <div class="group__title">{{ $t("position") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('position')"
            :value="item ? item.position : position"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("employeeNumber") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('employeeNumber')"
            :value="item ? item.personal_number : personal_number"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("role") }}</div>
        <div class="group__content">
          <select
            class="form-select"
            :value="item ? item.role : role"
            @change="onChange($event)"
          >
            <option v-for="(role, index) in $t('roles')" :value="index">
              {{ role }}
            </option>
          </select>
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("education") }}</div>
        <div class="group__content">
          <select
            class="form-select"
            :value="item ? item.education : education"
            @change="onChange($event)"
          >
            <option v-for="education in $t('educations')" :value="education">
              {{ education }}
            </option>
          </select>
        </div>
      </div>

      <div class="group">
        <div class="group__title">{{ $t("speciality") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('speciality')"
            :value="item ? item.specialty : specialty"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("employmentDate") }}</div>
        <div class="group__content">
          <datetime
            v-model="employment_date"
            required
            input-class="forms__container--input"
            type="date"
            :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("region") }}</div>
        <div class="group__content">
          <select
            class="form-select"
            :value="item ? item.region.value : region"
            @change="onChange($event)"
          >
            <option v-for="(region, index) in regions" :value="region.value">
              {{ region.title }}
            </option>
          </select>
        </div>
      </div>

      <!-- Личные данные -->
      <div class="group__title text--blue">
        {{ $t("pages.employee.employeePersonalInfo") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("birthday") }}</div>
        <div class="group__content">
          <datetime
            v-model="date_of_birth"
            required
            input-class="forms__container--input"
            type="date"
            :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("zodiak") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('zodiak')"
            :value="item ? item.zodiac_sign : zodiac_sign"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("element") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('element')"
            :value="item ? item.element : element"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("chineseYear") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('chineseYear')"
            :value="item ? item.chinese_year : chinese_year"
            @input="onChange($event)"
          />
        </div>
      </div>

      <!-- Дети -->
      <div class="group__title text--blue">
        {{ $t("childs") }}
      </div>
      <div class="group__title text--blue">
        {{ $t("another") }}
      </div>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "@/api/axios";
import { maska } from "maska";
import { Datetime } from "vue-datetime";

export default {
  components: { Datetime },
  directives: {
    maska,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      date: new Date().toString(),
      employment_date: new Date().toString(),
      date_of_birth: new Date().toString(),
      users: [],
      regions: [],
      name: null,
      surname: null,
      lastname: null,
      region: null,
      department: null,
      sub_department: null,
      personal_number: null,
      role: null,
      position: null,
      education: null,
      specialty: null,
      zodiac_sign: null,
      element: null,
      chinese_year: null,
      departments: [],
      photoFull: false,
      phone: null,
      email: null,
      children: [],
      options: {
        userEditor: false,
      },
      avatar: "Выбрать файл",
      passport_photo: ["Выбрать файлы"],
      url: "@/assets/icons/preview.svg",
      editImg: "@/assets/icons/table/edit.svg",
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      addChildForm: false,
      editChildForm: false,
      editChildIndex: null,
      newChild: {
        fio: "",
        birthDate: "",
        gender: "муж",
      },
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    fileUpload(e) {
      const files = e.target.files;
      if (e.target.name === "avatar") {
        this[e.target.name] = files[0];
        this.url = URL.createObjectURL(files[0]);
      } else {
        this[e.target.name] = files;
      }
    },
    saveChild() {
      let child = this.newChild;
      this.children[this.editChildIndex] = child;
      this.newChild = {
        fio: "",
        birthDate: "",
        gender: "муж",
      };
      this.editChildForm = false;
      this.editChildIndex = null;
    },
    removeChild(index) {
      this.children.splice(index, 1);
    },
    editChild(index) {
      let child = this.children[index];
      this.newChild = {
        fio: child.fio,
        birthDate: child.birthDate,
        gender: child.gender,
      };
      this.editChildIndex = index;
      this.editChildForm = true;
    },
    addChild() {
      if (this.newChild) {
        let child = this.newChild;
        this.children.push(child);
      }
      this.newChild = {
        fio: "",
        birthDate: "",
        gender: "муж",
      };
      this.addChildForm = false;
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    async getUsersByFIO() {
      axios(`/user/getsearch/${this.fio}`).then(async (res) => {
        let result = await res;
        this.users = result.data;
      });
    },
    onUserAdd() {
      this.changeStatus(false);
      let userData = new FormData();
      if (this.surname) userData.append("surname", this.surname);
      if (this.name) userData.append("name", this.name);
      if (this.lastname) userData.append("lastname", this.lastname);
      userData.append("avatar", this.avatar);
      if (this.email) userData.append("email", this.email);
      if (this.education) userData.append("education", this.education);
      if (this.specialty) userData.append("specialty", this.specialty);
      if (this.personal_number)
        userData.append("personal_number", this.personal_number);
      if (this.phone) userData.append("phone", this.phone);
      if (this.department) userData.append("department", this.department);
      if (this.sub_department)
        userData.append("sub_department", this.sub_department);
      if (this.region) userData.append("region", this.region);
      if (this.position) userData.append("position", this.position);
      if (this.salary) userData.append("salary", this.salary);
      if (this.award) userData.append("award", this.award);
      if (this.graphic) userData.append("graphic", this.graphic);
      userData.append("employment_date", this.employment_date);
      if (this.city) userData.append("city", this.city);
      if (this.street) userData.append("street", this.street);
      if (this.house) userData.append("house", this.house);
      if (this.role) userData.append("role", this.role);
      if (this.appartment) userData.append("appartment", this.appartment);
      if (this.passport) userData.append("passport", this.passport);
      if (this.inn) userData.append("inn", this.inn);
      if (this.item) {
        userData.append("options", JSON.stringify(this.item.options));
      } else {
        userData.append("options", JSON.stringify(this.options));
      }
      if (this.children.length) {
        userData.append("children", JSON.stringify(this.children));
      }
      if (!this.item) {
        for (let i = 0; i < this.passport_photo.length; i++) {
          userData.append("passport_photo", this.passport_photo[i]);
        }
      }
      userData.append("date_of_birth", this.date_of_birth);
      if (this.zodiac_sign) userData.append("zodiac_sign", this.zodiac_sign);
      if (this.element) userData.append("element", this.element);
      if (this.chinese_year) userData.append("chinese_year", this.chinese_year);
      if (this.additional_phone) {
        userData.append("additional_phone", this.additional_phone);
      }
      if (this.item) {
        userData.append("userId", this.item._id);
      }

      if (!this.item) {
        axios({
          url: `/user/post/`,
          data: userData,
          method: "POST",
        })
          .then(async (res) => {
            let result = await res;
            this.$emit("refresh", result.data.user);
            this.$emit("toggleOpen");
            this.$toast.success("Пользователь успешно добавлен!");
            this.changeStatus(true);
          })
          .catch(async (err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
          });
      } else {
        axios({
          url: `/user/update/`,
          data: userData,
          method: "POST",
        })
          .then(({ data }) => {
            this.$emit("refresh", data.user);
            this.$emit("toggleOpen");
            this.$toast.success("Пользователь успешно обновлен!");
            this.changeStatus(true);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
          });
      }
    },
  },
  mounted() {
    if (this.item) {
      this.employment_date = this.item.employment_date;
      this.date_of_birth = this.item.date_of_birth;
      this.children = this.item.children ? this.item.children : [];
    }
    axios({
      url: "/regions/get",
    }).then(async ({ data }) => {
      this.regions = data.regions;
    });
    axios({
      url: "/departments/all",
    }).then(({ data }) => {
      this.departments = data;
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  .group {
    max-width: 976px;

    select {
      max-width: 401px;
    }
  }
  .group__title {
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        display: block;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        top: 0;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
  select,
  input[type="text"] {
    font-weight: 500;
  }
  .vdatetime-popup__header {
    background: $color-red;
  }
}
</style>
