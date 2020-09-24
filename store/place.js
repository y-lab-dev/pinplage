export const state = () => ({
  placeId: '',
});

export const getters = {
  id(state) {
    return state.placeId;
  },
};

export const mutations = {
  getId(state, payload) {
    state.placeId = payload;
    console.log(payload);
  },
};
