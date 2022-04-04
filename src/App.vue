<template>
  <div v-if="mobile" class="mobile-off">
    <div>ЦРМ система доступна только для версии десктоп и планшета.</div>
    <img src="@/assets/icons/mobile_off.svg" alt="" />
  </div>
  <router-view v-else />
</template>

<script>
import axios from "@/api/axios";
import isMobile from "is-mobile";
import LogRocket from "logrocket";
import { getRegionById } from "./utils/region";

export default {
  data() {
    return {
      mobile: isMobile(),
    };
  },
  methods: {
    clearCache() {
      axios
        .get("https://tdcsk.com/api/cache-clear", {
          headers: {
            Origin: process.env.VUE_APP_DEVELOP_URL,
            "Access-Control-Allow-Origin": process.env.VUE_APP_DEVELOP_URL,
          },
        })
        .then(() => {
          this.$toast.success("Кэш успешно очищен!");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    LogRocket.init("qiul8x/adnin");
  },
  created() {
    window.addEventListener("resize", () => {
      this.mobile = isMobile();
    });

    axios({
      url: "/regions/get",
    }).then((res) => {
      this.$store.commit("setRegions", res.data.regions);
    });
  },
};
</script>
