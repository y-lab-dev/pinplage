import firebase from '~/plugins/firebase';
const db = firebase.firestore().collection('circles');

export const state = () => ({
  id: '',
  name: '',
  icon: '',
  clubDetails: {
    name: '',
    icon: '',
    introduction: '',
    link: {
      homepage: '',
      instagram: '',
      twitter: '',
    },
    picture: [],
    more: [],
  },
});

export const getters = {
  clubDetails(state) {
    return state.clubDetails;
  },
  name(state) {
    return state.name;
  },
  icon(state) {
    return state.icon;
  },
};

export const mutations = {
  setId(state, { id }) {
    state.id = id;
  },
  setNameAndIcon(state, { name, icon }) {
    state.name = name;
    state.icon = icon;
  },
  setClubDetails(state, { clubDetails }) {
    state.clubDetails = clubDetails;
  },
};

export const actions = {
  setId({ commit }, { id }) {
    commit('setId', { id });
  },
  setNameAndIcon({ commit }, { name, icon }) {
    commit('setNameAndIcon', { name, icon });
  },
  async getClubDetails({ state, commit }) {
    db.doc(await state.id)
      .collection('detail')
      .doc('browse')
      .get()
      .then((doc) => {
        const details = doc.data();
        const clubDetails = {
          picture: details.picture,
          introduction: details.introduction,
          link: {
            homepage: details.link.homepage,
            instagram: details.link.instagram,
            twitter: details.link.twitter,
          },
          more: [details.goal, details.place, details.time, details.money, details.number],
          // goal: details.goal,
          // place: details.place,
          // time: details.time,
          // money: details.money,
          // number: details.number,
          // ここのデータ構造、悪い意味でやばくね？？toKajibyKaji
        };
        commit('setClubDetails', { clubDetails });
      });
  },
};
