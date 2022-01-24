export default {
  methods: {
    transformDeliveryType(p) {
      switch (p) {
        case "transport":
          return `Доставка транспортом`;
        case "courier":
          return `Доставка курьером`;
        case "pickup":
          return `Самовывоз`;
        default:
          return;
      }
    },
  },
};
