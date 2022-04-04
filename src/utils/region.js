import store from "@/store";

export const getRegionTitleById = (id) => {
  return store.state.regions.find((r) => r._id === id)?.title;
};
