export default {
  methods: {
    transformPayment(p) {
      // if(o){
      //     return `Картой онлайн`
      // } else {
      switch (p) {
        case "cash":
          return `Наличными`;
        case "bankTransfer":
          return `Банковский перевод`;
        case "cartSite":
          return `Картой онлайн`;
        case "cartReceiving":
          return `Картой при получении`;
        default:
          return;
      }
      // }
    },
  },
};
