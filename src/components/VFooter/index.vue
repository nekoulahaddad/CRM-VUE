<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__left">
        <v-user-info />
      </div>
      <div class="footer__right">
        <v-language-switcher />
        <v-date-time />
      </div>
    </div>
  </footer>
</template>

<script>
import VDateTime from "@/components/VDateTime";
import VUserInfo from "@/components/VUserInfo";
import VLanguageSwitcher from "@/components/VLanguageSwitcher";

export default {
  components: { VDateTime, VLanguageSwitcher, VUserInfo },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.footer {
  background-color: $color-white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
