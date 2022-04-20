<template>
  <form
    @submit.prevent="onUserAdd"
    enctype="multipart/form-data"
    accept="image/x-png,image/gif,image/jpeg"
    class="employee-edit"
  >
    <div class="form-top">
      <div class="form-top__left">
        <div class="group__title group__title--big text--blue">
          {{ $t("pages.employee.employeeMainInfo") }}
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("lastName") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <input
              required
              type="text"
              class="form-control"
              name="surname"
              :placeholder="$t('lastName')"
              :value.trim="infoItem ? infoItem.surname : surname"
              @input="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("firstName") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <input
              required
              type="text"
              class="form-control"
              name="name"
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
              name="lastname"
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
              name="email"
              :value="infoItem ? infoItem.email : email"
              @input="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("phone") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <phone-mask-input
              required
              style="width: 100%"
              name="phone"
              inputClass="form-control"
              :placeholder="$t('phone')"
              :value="infoItem ? infoItem.phone : phone"
              @onValidate="onValidate($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("position") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <input
              required
              type="text"
              class="form-control"
              :placeholder="$t('position')"
              name="position"
              :value="infoItem ? infoItem.position : position"
              @input="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("employeeNumber") }}</div>
          <div class="group__content">
            <input
              type="number"
              class="form-control hide-arrows"
              name="number"
              :placeholder="$t('employeeNumber')"
              :value="infoItem ? infoItem.number : number"
              @input="onChange($event)"
              onkeydown="return event.keyCode !== 69"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("speciality") }}</div>
          <div class="group__content">
            <input
              type="text"
              name="specialty"
              class="form-control"
              :placeholder="$t('speciality')"
              :value="infoItem ? infoItem.specialty : specialty"
              @input="onChange($event)"
            />
          </div>
        </div>
        <div class="group__title group__title--big text--blue">
          Личная информация:
        </div>
        <div class="group">
          <div class="group__title">{{ $t("zodiak") }}</div>
          <div class="group__content">
            <input
              type="text"
              name="zodiac_sign"
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
              name="element"
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
              name="chinese_year"
              class="form-control"
              :placeholder="$t('chineseYear')"
              :value="infoItem ? infoItem.chinese_year : chinese_year"
              @input="onChange($event)"
            />
          </div>
        </div>
        <!-- Дети -->
        <div class="group__title group__title--big text--blue">
          {{ $t("childs") }}
        </div>
        <div class="group">
          <div class="group__content group__childs">
            <template>
              <div
                class="children"
                v-for="(child, index) in children"
                :key="child._id"
              >
                <span class="d-flex align-items-center">
                  <img
                    alt=""
                    :src="
                      child.gender === 'муж'
                        ? require('@/assets/icons/boy.svg')
                        : require('@/assets/icons/girl.svg')
                    "
                    style="padding-right: 10px; width: 32px"
                  />{{ transformChildInfo(child) }}
                </span>

                <div class="d-flex">
                  <VueCustomTooltip
                    label="Изменить"
                    v-if="!addChildForm && !editChildForm"
                  >
                    <img
                      alt=""
                      class="children__write-icon"
                      src="@/assets/icons/write_icon.svg"
                      @click="editChild(index)"
                    />
                  </VueCustomTooltip>

                  <VueCustomTooltip
                    label="Удалить"
                    v-if="!addChildForm && !editChildForm"
                  >
                    <img
                      src="@/assets/icons/trash_icon.svg"
                      alt=""
                      @click="removeChild(index)"
                    />
                  </VueCustomTooltip>
                </div>
              </div>
            </template>
          </div>
          <div class="group__footer">
            <v-add-child
              :newChild="newChild"
              :addChildForm="addChildForm"
              :editChildForm="editChildForm"
              v-if="addChildForm || editChildForm"
              @cancel="
                (addChildForm = false),
                  (editChildForm = false),
                  (editChildIndex = null)
              "
              @addChild="addChild"
              @saveChild="saveChild"
            />
          </div>

          <v-button
            red
            @click="addChildForm = true"
            v-if="!addChildForm && !editChildForm"
          >
            {{ $t("add") }}
          </v-button>
        </div>
      </div>

      <div class="form-top__center">
        <div class="group__title group__title--big text--blue">
          {{ $t("pages.employee.employeeAddInfo") }}
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("department") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <v-select
              :options="
                departments.map((item) => ({
                  label: item.title,
                  value: item.value,
                }))
              "
              name="department"
              v-model="department"
              :reduce="(item) => item.value"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("subDepartment") }}</div>
          <div class="group__content">
            <input
              type="text"
              name="sub_department"
              class="form-control"
              :placeholder="$t('subDepartment')"
              :value="infoItem ? infoItem.sub_department : sub_department"
              @input="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("role") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <v-select
              :options="
                Object.entries($t('roles')).map(([r, key]) => ({
                  label: key,
                  value: r,
                }))
              "
              name="role"
              v-model="role"
              :reduce="(item) => item.value"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">{{ $t("education") }}</div>
          <div class="group__content">
            <v-select
              :options="
                $t('educations').map((education) => ({
                  label: education,
                  value: education,
                }))
              "
              v-model="education"
              :reduce="(item) => item.value"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("employmentDate") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <datetime
              required
              v-model="employment_date"
              input-class="forms__container--input"
              type="date"
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("region") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <v-select
              :options="
                regions.map((region) => ({
                  label: region.title,
                  value: region.value,
                }))
              "
              :reduce="(item) => item.value"
              name="region"
              v-model="region"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">
            {{ $t("birthday") }} <span class="required">*</span>
          </div>
          <div class="group__content">
            <datetime
              required
              v-model="date_of_birth"
              input-class="forms__container--input"
              type="date"
              :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
            />
          </div>
        </div>
        <!-- Прочее -->
        <div class="group__title group__title--big text--blue">
          {{ $t("another") }}
        </div>
        <div class="group">
          <div class="group__title">Редактировать сотрудников:</div>
          <div class="group__content">
            <v-select
              :options="[
                { label: 'Нет', value: false },
                { label: 'Да', value: true },
              ]"
              v-model="
                infoItem && infoItem.options && infoItem.options.userEditor
              "
              :reduce="(item) => item.value"
              name="checkbox"
            />
          </div>
        </div>
      </div>

      <div class="form-top__right">
        <div
          class="employee-photo"
          :class="{
            'employee-photo__empty':
              !infoItem || (infoItem && infoItem.avatar === 'Выбрать файл'),
            'employee-photo__edit': infoItem,
          }"
        >
          <img
            alt=""
            :src="
              infoItem && infoItem.avatar === 'Выбрать файл'
                ? url
                : infoItem && avatar === 'Выбрать файл'
                ? `${serverAddr + infoItem.avatar}`
                : url
            "
          />
        </div>

        <div class="employee-photo__upload">
          <input
            hidden
            @change="fileUpload($event)"
            name="avatar"
            type="file"
            id="employee-photo"
            accept="image/*"
          />
          <label for="employee-photo">Выбрать фото</label>
        </div>
        <div v-if="false" class="delete-avatar-btn" @click="deleteAvatar">
          Удалить фото
        </div>
      </div>
    </div>

    <div style="margin-top: 10px">
      <v-button red>{{ $t("save") }}</v-button>
    </div>
  </form>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import PhoneMaskInput from "vue-phone-mask-input";
import axios from "@/api/axios";
import VAddChild from "../VAddChild";

export default {
  props: {
    infoItem: {
      type: Object,
    },
  },
  computed: {
    editEmployee() {
      return this.infoItem.options.userEditor;
    },
    dep() {
      return this.infoItem ? this.infoItem.department.value : this.department;
    },
  },
  validations: {},
  components: { VAddChild, VButton, PhoneMaskInput },
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
      number: null,
      showAddChild: false,
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
      url: require("@/assets/icons/new_avatar.svg"),
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
    deleteAvatar() {
      this.avatar = "Выбрать файл";
      this.infoItem.avatar = "Выбрать файл";
      this.url = require("@/assets/icons/new_avatar.svg");
    },
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
    onValidate(e, index) {
      this.phone = e.number;
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
      if (this.number && this.number < 1) {
        this.$toast.error("Некорректный номер сотрудника!");
        return;
      }
      let userData = new FormData();
      if (this.surname) userData.append("surname", this.surname);
      if (this.name) userData.append("name", this.name);
      if (this.lastname) userData.append("lastname", this.lastname);
      userData.append("avatar", this.avatar);
      if (this.email) userData.append("email", this.email);
      if (this.education) userData.append("education", this.education);
      if (this.specialty) userData.append("specialty", this.specialty);
      userData.append("number", this.number);
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
            this.$emit("refresh", res.data.user);
            this.$toast.success("Пользователь успешно добавлен!");
            this.$store.commit("toggleAction", {
              key: "addEmployee",
            });
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
          .then((res) => {
            this.$toast.success("Пользователь успешно изменен!");
            this.$emit("refresh", res.data.user);
            this.$emit("toggleEdit", this.infoItem);
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
      this.role = this.infoItem.role;
      this.region = this.infoItem.region.value;
      this.department = this.infoItem.department.value;
      this.education = this.infoItem.education;
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
      data.map((item) => {
        if (!this.departments.find((i) => i.value === item.value)) {
          this.departments.push(item);
        }
      });
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit {
  .vdatetime-input,
  .form-select {
    width: 401px;
  }
  .form-control {
  }
  .group__title:not(:first-child) {
    margin-top: 15px;
    position: relative;
    padding-top: 10px;

    &:before {
      height: 2px;
      position: absolute;
      background-color: $color-gray-secondary;
      left: 0;
      right: 0;
      top: 0;
      content: "";
      display: block;
    }
  }

  .form-top {
    display: flex;
    justify-content: space-between;

    &__left {
      width: 100%;
      margin-right: 25px;
    }

    &__center {
      margin-right: 25px;
    }

    &__right {
      button {
        margin-top: 20px;
      }
    }

    .employee-photo {
      display: flex;
      align-items: end;
      justify-content: end;

      span {
        font-weight: 700;
        font-size: 14px;
        margin-right: 10px;
      }

      &__upload {
        display: flex;
        justify-content: end;
      }

      &__empty {
        width: 230px;
        height: 303px;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(0, 0, 0, 0.3);

        img {
          max-width: 100%;
        }
      }

      &__edit {
        width: 230px;
        height: 303px;

        img {
          max-width: 100%;
          border-radius: $border-radius;
        }
      }
    }

    label[for="employee-photo"] {
      border-radius: $border-radius;
      width: 230px;
      height: 37px;
      background-color: $color-red;
      color: $color-white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      margin-top: 20px;
      cursor: pointer;
    }

    img {
      cursor: auto;
    }
  }
  .group__title--big {
    font-size: 16px;
  }
  .photo {
    width: 123px;
    height: 123px;
    object-fit: contain;
  }
  .children {
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    height: 40px;
    width: 401px;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    justify-content: space-between;

    img {
      cursor: pointer;
    }

    span[role="tooltip"] {
      &:after {
        background-color: $color-black;
        color: $color-white;
        border-radius: $border-radius;
      }

      & + * {
        margin-left: 10px;
      }
    }
  }

  .group__childs {
    flex-direction: column;
    .children {
      & + * {
        margin-top: 10px;
      }
    }
  }
  .required {
    color: $color-red;
  }
  input[type="number"].hide-arrows::-webkit-outer-spin-button,
  input[type="number"].hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"].hide-arrows {
    -moz-appearance: textfield;
  }
  .vs__selected {
    width: 90%;
  }
  .delete-avatar-btn {
    background-color: #fff;
    color: #db1f35;
    border: 2px solid #db1f35;
    border-radius: 5px;
    width: 230px;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
