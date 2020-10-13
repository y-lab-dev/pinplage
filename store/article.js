export const state = () => ({
  articleId: '',
});

export const getters = {
  id(state) {
    return state.articleId;
  },
};

export const mutations = {
  getData(state, payload) {
    state.articleId = payload.id;
  },
};
