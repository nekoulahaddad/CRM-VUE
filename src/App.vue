<template>
  <div v-if="mobile()" class="mobile-off">
    <div>ЦРМ система доступна только для версии декстоп и планшета.</div>
    <img src="@/assets/icons/mobile_off.svg" alt="" />
  </div>
  <router-view v-else />
</template>

<script>
import axios from "@/api/axios";
import isMobile from "is-mobile";

export default {
  sockets: {
    connect() {
      if (
        this.role === "admin" ||
        this.role === "director" ||
        this.role === "manager" ||
        this.role === "superadmin"
      ) {
        this.$toast.info(
          "Вы подключились к cерверу для получения заказов!",
          "Уведомление"
        );
        this.$socket.client.emit("joinRoomOrders", {
          userId: this.$store.state.id,
          role: this.role,
        });
      }
      if (
        this.role === "admin" ||
        this.role === "director" ||
        this.role === "manager" ||
        this.role === "superadmin"
      ) {
        this.$toast.info(
          "Вы подключились к cерверу для получения заявок!",
          "Уведомление"
        );
        this.$socket.client.emit("joinRoomCallbacks", {
          userId: this.$store.state.id,
          role: this.role,
        });
      }
    },
  },
  methods: {
    mobile() {
      return isMobile();
    },
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
    beforeReload() {
      if (
        this.role === "admin" ||
        this.role === "director" ||
        this.role === "manager"
      ) {
        this.$toast.info("Вы потеряли соеденение с сервером!", "Уведомление");
        this.$socket.client.emit("leftRoomOrders", {
          userId: this.$store.state.id,
        });
        this.$socket.client.emit("leftRoomCallbacks", {
          userId: this.$store.state.id,
        });
      }
    },
  },
  created() {
    console.log(111);
  },
};
</script>
