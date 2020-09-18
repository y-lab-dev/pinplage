export const state = () => ({
  threadId: '',
});

export const getters = {
  id(state) {
    return state.threadId;
  },
};

export const mutations = {
  getId(state, payload) {
    state.threadId = payload.id;
    console.log(payload);
  },
};
