export const state = () => ({
  articleId: '',
  category: '',
});

export const getters = {
  id(state) {
    return state.articleId;
  },
  category(state) {
    return state.category;
  },
};

export const mutations = {
  getData(state, payload) {
    state.articleId = payload.id;
    state.category = payload.category;
  },
};
