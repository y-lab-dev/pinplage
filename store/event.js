export const state = () => ({
  eventId: '',
  geometry: '',
});

export const getters = {
  id(state) {
    return state.eventId;
  },
  geometry(state) {
    return state.geometry;
  },
};

export const mutations = {
  getData(state, payload) {
    state.eventId = payload.id;
    state.geometry = payload.geometry;
  },
};
