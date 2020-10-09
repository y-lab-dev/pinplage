export const state = () => ({
  jobId: '',
  geometry: '',
});

export const getters = {
  id(state) {
    return state.jobId;
  },
  geometry(state) {
    return state.geometry;
  },
};

export const mutations = {
  getData(state, payload) {
    state.jobId = payload.id;
    state.geometry = payload.geometry;
  },
};
