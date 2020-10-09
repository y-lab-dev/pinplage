export const state = () => ({
  reviewId: '',
});

export const getters = {
  id(state) {
    return state.reviewId;
  },
};

export const mutations = {
  getId(state, payload) {
    state.reviewId = payload;
  },
};
