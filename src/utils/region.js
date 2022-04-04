import store from "@/store";

export const getRegionTitleById = (id) => {
  const region = store.state.regions.find((r) => r._id === id);
  return region ? region.title : null;
};
