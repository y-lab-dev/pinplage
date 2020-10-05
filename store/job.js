export const state = () => ({
  jobId: '',
  jobImg: '',
  placeName: '',
});

export const getters = {
  id(state) {
    return state.jobId;
  },
  img(state) {
    return state.jobImg;
  },
  placeName(state) {
    return state.placeName;
  },
};

export const mutations = {
  getId(state, payload) {
    state.jobId = payload.id;
    state.jobImg = payload.img;
    state.placeName = payload.place;
  },
};
