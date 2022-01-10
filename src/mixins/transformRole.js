export default {
  methods: {
    transformRole(role) {
      switch (role) {
        case "director":
          return "Директор";
        case "seo":
          return "SEO - оптимизатор";
        case "content":
          return "Контент - менеджер";
        case "manager":
          return `Менеджер по работе с клиентами №${
            this.$store.state.number ? this.$store.state.number : ""
          }`;
        case "admin":
          return "Руководитель";
        case "worker":
          return "Сотрудник";
        case "call":
          return "Сотрудник Call - центра";
        case "superadmin":
          return "Суперадмин";
        default:
          break;
      }
    },
  },
};
