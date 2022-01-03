export default {
  methods: {
    transformStatus(status) {
      switch (status.value) {
        case "moderate":
          return `<span class="text--green-dark">${status.title}</span>`;
        case "completed":
          return `<span class="bg bg--green-light">${status.title}</span>`;
        case "declained":
          return `<span class="text--red">${status.title}</span>`;
        case "failed":
          return `<span class="text--red">${status.title}</span>`;
        case "process":
          return `<span class="process">${status.title}</span>`;
        case "tested":
          return `<span class="text--green-dark">${status.title}</span>`;
        case "nocall":
          return `<span class="nocall">${status.title}</span>`;
        case "awaiting":
          return `<span class="awaiting">${status.title}</span>`;
        case "processing":
          return `<span class="awaiting">${status.title}</span>`;
        case "assigned":
          return `<span class="text--blue-delos">${status.title}</span>`;
        case "accepted":
          return `<span class="text--blue">${status.title}</span>`;
        case "not accepted":
          return `<span class="not_accepted">${status.title}</span>`;
        case "under revision":
          return `<span class="under_revision">${status.title}</span>`;
        case "delivered":
          return `<span class="delivered">${status.title}</span>`;
        case "partially delivered":
          return `<span class="partially_delivered">${status.title}</span>`;
        default:
          return;
      }
    },
  },
};
