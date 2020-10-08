export const state = () => ({
  eventId: '',
});

export const getters = {
  id(state) {
    return state.eventId;
  },
};

export const mutations = {
  getId(state, payload) {
    state.eventId = payload.id;
  },
};
