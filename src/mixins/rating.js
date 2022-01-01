export default {
  methods: {
    transformRating(rating) {
      switch (true) {
        case rating > 8:
          return `<span class="complete">${rating}</span>`;
        case rating > 5:
          return `<span class="moderate">${rating}</span>`;
        case rating > 3:
          return `<span class="process">${rating}</span>`;
        case rating > 0:
          return `<span class="failed">${rating}</span>`;
        default:
          return `<span>0</span>`;
      }
    },
  },
};
