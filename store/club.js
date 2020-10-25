export const state = () => ({
  clubTab: 'tab-1',
});

export const getters = {
  tab(state) {
    return state.clubTab;
  },
};

export const mutations = {
  pauseTab(state, latestTab) {
    state.clubTab = latestTab;
  },
};
