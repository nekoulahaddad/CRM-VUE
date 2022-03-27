export default {
  methods: {
    transformRole(role) {
      switch (role) {
        case "director":
          return "Директор";
        case "seo":
          return "SEO";
        case "content":
          return "Контент - менеджер";
        case "manager":
          return `Менеджер по продажам ${
            this.$store.state.number ? `№${this.$store.state.number}` : ""
          }`;
        case "buyer":
          return "Закупщик";
        case "admin":
          return "Директор";
        case "worker":
          return "Сотрудник";
        case "call":
          return "Call - центр";
        case "superadmin":
          return "Суперадмин";
        default:
          break;
      }
    },
  },
};
