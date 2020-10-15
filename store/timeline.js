export const state = () => ({
  timelineTab: 'tab-1',
});

export const getters = {
  tab(state) {
    return state.timelineTab;
  },
};

export const mutations = {
  pauseTab(state, latestTab) {
    state.timelineTab = latestTab;
  },
};
