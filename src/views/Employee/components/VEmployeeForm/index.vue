<template>
  <form
    @submit.prevent="onUserAdd"
    enctype="multipart/form-data"
    accept="image/x-png,image/gif,image/jpeg"
  >
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
          :value.trim="infoItem ? infoItem.surname : surname"
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
          :value.trim="infoItem ? infoItem.name : name"
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
          :value.trim="infoItem ? infoItem.lastname : lastname"
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
          :value="infoItem ? infoItem.email : email"
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
          :value="infoItem ? infoItem.phone : phone"
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
        <select
          class="form-select"
          :value="infoItem ? infoItem.department.value : department"
          @change="onChange($event)"
        >
          <option
            v-for="(item, index) in departments"
            :key="index"
            :selected="
              infoItem ? item.value === infoItem.department.value : false
            "
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
          :value="infoItem ? infoItem.sub_department : sub_department"
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
          :value="infoItem ? infoItem.position : position"
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
          :value="infoItem ? infoItem.personal_number : personal_number"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("role") }}</div>
      <div class="group__content">
        <select
          class="form-select"
          :value="infoItem ? infoItem.role : role"
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
          :value="infoItem ? infoItem.education : education"
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
          :value="infoItem ? infoItem.specialty : specialty"
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
          :value="infoItem ? infoItem.region.value : region"
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
          :value="infoItem ? infoItem.zodiac_sign : zodiac_sign"
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
          :value="infoItem ? infoItem.element : element"
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
          :value="infoItem ? infoItem.chinese_year : chinese_year"
          @input="onChange($event)"
        />
      </div>
    </div>

    <!-- Дети -->
    <div class="group__title text--blue">
      {{ $t("childs") }}
    </div>
    <div class="group">
      <div class="group__footer">
        <v-add-child />
      </div>

      <v-button red>{{ $t("add") }}</v-button>
    </div>

    <div class="group__title text--blue">
      {{ $t("another") }}
    </div>

    <v-button red>{{ $t("save") }}</v-button>
  </form>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import axios from "@/api/axios";
import VAddChild from "../VAddChild";
import { Datetime } from "vue-datetime";

export default {
  props: {
    infoItem: {
      type: Object,
    },
  },
  components: { VAddChild, VButton, datetime: Datetime },
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
      if (this.infoItem) {
        userData.append("options", JSON.stringify(this.infoItem.options));
      } else {
        userData.append("options", JSON.stringify(this.options));
      }
      if (this.children.length) {
        userData.append("children", JSON.stringify(this.children));
      }
      if (!this.infoItem) {
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
      if (this.infoItem) {
        userData.append("userId", this.infoItem._id);
      }

      if (!this.infoItem) {
        axios({
          url: `/user/post/`,
          data: userData,
          method: "POST",
        })
          .then((res) => {
            this.$emit("addToUsers", res.data.user);
            this.$emit("toggleOpen");
            this.$toast.success("Пользователь успешно добавлен!");
          })
          .catch(async (err) => {
            this.$toast.error(err.response.data.message);
          })
          .finally(() => {
            this.changeStatus(true);
          });
      } else {
        axios({
          url: `/user/update/`,
          data: userData,
          method: "POST",
        })
          .then(({ data }) => {
            this.$emit("changeUser", data.user);
            this.$emit("toggleEdit", this.infoItem);
            this.$toast.success("Пользователь успешно изменен!");
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          })
          .finally(() => {
            this.changeStatus(true);
          });
      }
    },
  },
  mounted() {
    if (this.infoItem) {
      this.employment_date = this.infoItem.employment_date;
      this.date_of_birth = this.infoItem.date_of_birth;
      this.children = this.infoItem.children ? this.infoItem.children : [];
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
