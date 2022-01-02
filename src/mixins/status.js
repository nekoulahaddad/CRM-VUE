export default {
  methods: {
    transformStatus(status) {
      switch (status.value) {
        case "moderate":
          return `<span class="moderate">${status.title}</span>`;
        case "completed":
          return `<span class="complete">${status.title}</span>`;
        case "declained":
          return `<span class="declained">${status.title}</span>`;
        case "failed":
          return `<span class="failed">${status.title}</span>`;
        case "process":
          return `<span class="process">${status.title}</span>`;
        case "tested":
          return `<span class="tested">${status.title}</span>`;
        case "nocall":
          return `<span class="nocall">${status.title}</span>`;
        case "awaiting":
          return `<span class="awaiting">${status.title}</span>`;
        case "processing":
          return `<span class="awaiting">${status.title}</span>`;
        case "assigned":
          return `<span class="assigned">${status.title}</span>`;
        case "accepted":
          return `<span class="accepted">${status.title}</span>`;
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
