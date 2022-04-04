import store from "@/store";

export const getCategoryTitleById = (id) => {
  console.log(store.state.categories);
  return store.state.categories.find((c) => c._id === id)?.categoryName;
};
