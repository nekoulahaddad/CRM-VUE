export default {
  methods: {
    transformMark(mark) {
      switch (true) {
        case mark === 5:
          return `<span class="complete">${mark}</span>`;
        case mark > 3:
          return `<span class="moderate">${mark}</span>`;
        case mark > 2:
          return `<span class="process">${mark}</span>`;
        case mark > 0:
          return `<span class="failed">${mark}</span>`;
        default:
          return `<span>...</span>`;
      }
    },
  },
};
