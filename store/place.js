export const state = () => ({
  place: {
    placeId: '',
    pname: '',
  },
});

export const getters = {
  id(state) {
    return state.place.placeId;
  },
  pname(state) {
    return state.place.pname;
  },
};

export const mutations = {
  getId(state, payload) {
    state.place.placeId = payload;
  },
  getName(state, payload) {
    state.place.pname = payload;
  },
};
