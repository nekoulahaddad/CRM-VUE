import store from "@/store";

export const getCategoryTitleById = (id) => {
  return store.state.regions.find((c) => c._id === id)?.categoryName;
};
