export const state = () => ({
  jobId: '',
});

export const getters = {
  id(state) {
    return state.jobId;
  },
};

export const mutations = {
  getId(state, payload) {
    state.jobId = payload.id;
  },
};
