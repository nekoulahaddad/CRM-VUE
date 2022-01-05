<template>
  <div class="wrapper">
    <v-sidebar />
    <main class="main">
      <router-view />
    </main>
    <v-footer />
  </div>
</template>

<script>
import VSidebar from "@/components/VSidebar";
import VFooter from "@/components/VFooter";
import roleMixins from "@/mixins/role";
import axios from "@/api/axios";

export default {
  mixins: [roleMixins],
  components: {
    VFooter,
    VSidebar,
  },
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
  mounted() {
    const body = document.querySelector("body");
    const menu = document.querySelector(".menu");

    menu.onmouseover = function () {
      body.style.overflow = "hidden";
    };

    menu.onmouseout = function () {
      body.style.overflow = "auto";
    };
  },
};
</script>
