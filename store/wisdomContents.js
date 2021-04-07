import firebase from '@/plugins/firebase';

const wisdoms = firebase.firestore().collection('wisdoms');
const users = firebase.firestore().collection('users');

export const state = () => ({
  wisdomId: '',
  content: {
    wisdomId: String,
    poster: String,
    likeAmount: Number,
    resolved: Boolean,
    content: String,
    category: String,
    createdAt: Date,
    posterName: String,
    posterIcon: String,
  },
  answers: [],
});

export const getters = {
  wisdomId(state) {
    return state.wisdomId;
  },
  content(state) {
    return state.content;
  },
  answers(state) {
    return state.answers;
  },
};

export const mutations = {
  setWisdomId(state, { id }) {
    state.wisdomId = id;
  },
  setContent(state, { content }) {
    state.content = content;
  },
  setPosterInfo(state, { posterInfo }) {
    this._vm.$set(state.content, 'posterName', posterInfo.name);
    this._vm.$set(state.content, 'posterIcon', posterInfo.icon);
  },
  setReply(state, { answer, target }) {
    this._vm.$set(state.answers, target, answer);
  },
  clearAnswers(state) {
    state.answers = [];
  },
};

export const actions = {
  clearAnswers({ commit }) {
    commit('clearAnswers');
  },
  setWisdomId({ commit, dispatch }, { id }) {
    commit('setWisdomId', { id });
    dispatch('getContents');
  },
  getContents({ state, commit, dispatch }) {
    wisdoms.doc(state.wisdomId).onSnapshot((doc) => {
      const wisdom = doc.data();
      const content = {
        wisdomId: doc.id,
        poster: wisdom.poster,
        likeAmount: wisdom.like,
        resolved: wisdom.resolved,
        content: wisdom.content,
        category: wisdom.category,
        createdAt: wisdom.createdAt.toDate(),
      };
      commit('setContent', { content });
      dispatch('getPosterData');
      dispatch('getReply');
    });
  },
  async getPosterData({ state, commit }) {
    const posterInfo = await users
      .doc(state.content.poster)
      .get()
      .then((doc) => {
        return { name: doc.data().name, icon: doc.data().icon };
      });
    commit('setPosterInfo', { posterInfo });
  },
  getReply({ state, commit }) {
    wisdoms
      .doc(state.wisdomId)
      .collection('reply')
      .orderBy('createdAt')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const answer = {
              wisdomId: change.doc.id,
              replyer: change.doc.data().replyer,
              likeAmount: change.doc.data().like,
              content: change.doc.data().content,
              createdAt: change.doc.data().createdAt.toDate(),
              bestAnswer: change.doc.data().bestAnswer,
            };
            commit('setReply', { answer, target: change.newIndex });
          }
        });
      });
  },
  unSubscribed({ state }) {
    const unsubscribed = firebase
      .firestore()
      .collection('wisdoms')
      .orderBy('createdAt', 'desc')
      .where('college', '==', 'shizuoka-h')
      .limit(state.limit)
      .onSnapshot(() => {});

    unsubscribed();
  },
};
