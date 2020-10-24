export const state = () => ({
  articleId: '',
  category: '',
  author: '',
});

export const getters = {
  id(state) {
    return state.articleId;
  },
  category(state) {
    return state.category;
  },
  author(state) {
    return state.author;
  },
};

export const mutations = {
  getData(state, payload) {
    state.articleId = payload.id;
    state.category = payload.category;
  },
  getAuthorData(state, payload) {
    state.author = payload;
  },
};
