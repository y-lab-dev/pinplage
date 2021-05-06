import firebase from '@/plugins/firebase';

export const state = () => ({
  wisdoms: [],
  maxLimit: 10,
  limit: 5,
  loading: false,
});

export const getters = {
  wisdoms(state) {
    return state.wisdoms;
  },
  maxLimit(state) {
    return state.maxLimit;
  },
  limit(state) {
    return state.limit;
  },
  loading(state) {
    return state.loading;
  },
};

export const mutations = {
  setWisdoms(state, { payload, target }) {
    const checkExist = state.wisdoms.some((wisdom) => wisdom.wisdomId === payload.wisdomId);
    if (!checkExist) {
      this._vm.$set(state.wisdoms, target, payload);
    }
  },
  setMaxLimit(state, { payload }) {
    state.maxLimit = payload;
  },
  modifyWisdom(state, { payload, target }) {
    this._vm.$set(state.wisdoms, target, payload);
  },
  removeWisdom(state, { target }) {
    this._vm.$delete(state.wisdoms, target);
  },
  incrementLimit(state) {
    console.log(state.limit);
    state.limit += 5;
  },
  switchLoading(state, { loading }) {
    state.loading = loading;
  },
};

export const actions = {
  getWisdoms({ state, commit, dispatch }) {
    firebase
      .firestore()
      .collection('wisdoms')
      .orderBy('createdAt', 'desc')
      .where('college', '==', 'shizuoka-h')
      .limit(state.limit)
      .onSnapshot((querySnapshot) => {
        console.log(querySnapshot.size);
        querySnapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const wisdom = change.doc.data();
            const postedWisdom = {
              wisdomId: change.doc.id,
              poster: wisdom.poster,
              resolved: wisdom.resolved,
              likeAmount: wisdom.like,
              content: wisdom.content,
              category: wisdom.category,
              createdAt: change.doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
            };
            postedWisdom.replyAmount = await firebase
              .firestore()
              .collection('wisdoms')
              .doc(change.doc.id)
              .collection('reply')
              .get()
              .then((snapshot) => {
                return snapshot.size;
              });
            commit('setWisdoms', { payload: postedWisdom, target: change.newIndex });
          } else if (change.type === 'modified') {
            const wisdom = change.doc.data();
            const modifiedWisdom = {
              wisdomId: change.doc.id,
              poster: wisdom.poster,
              resolved: wisdom.resolved,
              likeAmount: wisdom.like,
              content: wisdom.content,
              category: wisdom.category,
              createdAt: change.doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
            };
            modifiedWisdom.replyAmount = await firebase
              .firestore()
              .collection('wisdoms')
              .doc(change.doc.id)
              .collection('reply')
              .get()
              .then((snapshot) => {
                return snapshot.size;
              });
            commit('modifyWisdom', { payload: modifiedWisdom, target: change.newIndex });
          } else if (change.type === 'removed') {
            commit('removeWisdom', { target: change.oldIndex });
          }
        });
      });
  },
  getMaxLimit({ state, commit }) {
    firebase
      .firestore()
      .collection('wisdoms')
      .get()
      .then((snapshot) => {
        commit('setMaxLimit', { payload: snapshot.size });
      });
  },
  incrementLimit({ state, commit, dispatch }) {
    if (state.loading) return;
    commit('switchLoading', { loading: true });
    const test = async () => {
      await commit('incrementLimit');
      await dispatch('getMaxLimit');
      await dispatch('getWisdoms');
    };
    test().then(() => {
      console.log('switch loading');
      commit('switchLoading', { loading: false });
    });
  },
  unsubscribed({ state }) {
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
