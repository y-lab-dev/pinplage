import firebase from '@/plugins/firebase';
// const db = firebase.firestore();

export const state = () => ({
  wisdoms: [],
});

export const getters = {
  wisdoms(state) {
    return state.wisdoms;
  },
};

export const mutations = {
  setWisdoms(state, { payload, index }) {
    console.log(index);
    if (index === 0) {
      state.wisdoms = [payload, ...state.wisdoms];
    } else {
      state.wisdoms = [...state.wisdoms, payload];
    }
  },
};

export const actions = {
  getWisdoms({ commit }) {
    firebase
      .firestore()
      .collection('wisdoms')
      .orderBy('createdAt', 'desc')
      .where('college', '==', 'shizuoka-h')
      .limit(10)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          console.log(change);
          if (change.type === 'added') {
            const wisdom = change.doc.data();
            const postedWisdom = {
              wisdomId: change.doc.id,
              poster: wisdom.poster,
              resolved: wisdom.resolved,
              likeAmount: wisdom.like,
              content: wisdom.content,
              category: wisdom.category,
              createdAt: wisdom.createdAt.toDate(),
            };
            firebase
              .firestore()
              .collection('wisdoms')
              .doc(change.doc.id)
              .collection('reply')
              .get()
              .then((snapshot) => {
                postedWisdom.replyAmount = snapshot.size;
              });
            commit('setWisdoms', { payload: postedWisdom, index: change.newIndex });
          } else if (change.type === 'removed') {
            console.log('removed');
          }
        });
      });
  },
};
