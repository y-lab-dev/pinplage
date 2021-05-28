# STORE

### use this template to create {store}.js

```
import firebase from '~/plugins/firebase';
const db = firebase.firestore().collection('hoge');

export const state = () => ({
  hoge: '',
});

export const getters = {
  hoge(state) {
    return state.hoge;
  },
};

export const mutations = {
  setHoge(state, { payload }) {
    state.clubTab = payload;
  },
};

export const actions = {
  gethoge({ commit }) {
    db.doc('hoo')
      .get()
      .then((doc) => {
        commit('setHoge', { payload: doc.data() });
      });
  },
};

```

**This directory is not required, you can delete it if you don't want to use it.**
