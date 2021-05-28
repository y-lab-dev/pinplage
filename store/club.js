import firebase from '~/plugins/firebase';
const db = firebase.firestore().collection('circles');

export const state = () => ({
  clubTab: 'tab-1',
  circles: [],
  clubs: [],
  circlesSize: 0,
  clubsSize: 0,
});

export const getters = {
  tab(state) {
    return state.clubTab;
  },
  circles(state) {
    return state.circles;
  },
  clubs(state) {
    return state.clubs;
  },
};

export const mutations = {
  pauseTab(state, latestTab) {
    state.clubTab = latestTab;
  },
  setClubs(state, { club }) {
    state.clubs = [...state.clubs, club];
  },
  setCircles(state, { circle }) {
    state.circles = [...state.circles, circle];
  },
  setCirclesSize(state, { circlesSize }) {
    state.circlesSize = circlesSize;
  },
  setClubsSize(state, { clubsSize }) {
    state.circlesSize = clubsSize;
  },
};

export const actions = {
  getClubs({ state, commit }) {
    if (state.clubs.length !== 0) return;
    db.where('genre', '==', '部活')
      .orderBy('name')
      .get()
      .then((snapshot) => {
        commit('setClubsSize', { clubsSize: snapshot.size });
        snapshot.forEach((doc) => {
          const club = {
            id: doc.id,
            name: doc.data().name,
            icon: doc.data().icon,
          };
          commit('setClubs', { club });
        });
      });
  },
  getCircles({ state, commit }) {
    if (state.circles.length !== 0) return;
    db.where('genre', '==', 'サークル')
      .orderBy('name')
      .get()
      .then((snapshot) => {
        commit('setCirclesSize', { circlesSize: snapshot.size });
        snapshot.forEach((doc) => {
          const circle = {
            id: doc.id,
            name: doc.data().name,
            icon: doc.data().icon,
          };
          commit('setCircles', { circle });
        });
      });
  },
};
