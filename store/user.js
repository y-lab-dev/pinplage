import Cookies from 'js-cookie';
import firebase from '~/plugins/firebase';

export const state = () => ({
  user: {
    isLogin: false,
    uid: '',
    email: '',
    icon: '',
    name: '',
    theme: '',
  },
  wisdom: {
    likedPost: [],
    likedReply: [],
    posted: [],
  },
});

export const getters = {
  uid(state) {
    return state.user.uid;
  },
  isAuthenticated(state) {
    return state.user.isLogin;
  },
  email(state) {
    return state.user.email;
  },
  name(state) {
    return state.user.name;
  },
  theme(state) {
    return state.user.theme;
  },
  icon(state) {
    return state.user.icon;
  },
  likedPost(state) {
    return state.wisdom.likedPost;
  },
  likedReply(state) {
    return state.wisdom.likedReply;
  },
  postedWisdom(state) {
    return state.wisdom.posted;
  },
};

export const mutations = {
  getData(state, payload) {
    state.user.uid = payload.uid;
    state.user.email = payload.email;
  },
  switchLogin(state) {
    state.user.isLogin = true;
  },
  logout(state) {
    state.user.isLogin = false;
  },
  setUserInfo(state, payload) {
    state.user.name = payload.name;
    state.user.icon = payload.icon;
    state.user.theme = payload.theme;
  },
  setUserWisdom(state, payload) {
    state.wisdom.likedPost = payload;
  },
  setUserLikedWisdomReply(state, payload) {
    state.wisdom.likedReply = payload;
  },
  setPostedWisdom(state, payload) {
    state.wisdom.posted = payload;
  },
  changeName(state, latestName) {
    state.user.name = latestName;
  },
  changeIcon(state, latestIcon) {
    state.user.icon = latestIcon;
  },
  changeTheme(state, latestTheme) {
    state.user.theme = latestTheme;
  },
};

export const actions = {
  async login({ commit }, payload) {
    await Cookies.remove('email');
    await Cookies.remove('pass');
    await Cookies.set('accessToken', payload.token, { expires: 90, samesite: 'lax' });
    commit('getData', {
      uid: payload.uid,
      email: payload.email,
    });
    commit('switchLogin');
  },
  async getUserInfo({ commit, state }) {
    const userInfo = await firebase
      .firestore()
      .collection('users')
      .doc(state.user.uid)
      .get()
      .then((doc) => {
        const userData = {
          name: doc.data().name,
          icon: doc.data().icon,
        };
        if (doc.data().theme) {
          userData.theme = doc.data().theme;
          return userData;
        } else {
          userData.theme = '基本';
          return userData;
        }
      });
    commit('setUserInfo', userInfo);
  },
  async getUserWisdom({ commit, state }) {
    const usersWisdoms = await firebase
      .firestore()
      .collection('users')
      .doc(state.user.uid)
      .collection('wisdom')
      .doc('likedPost')
      .get()
      .then((doc) => {
        return doc.data().id;
      });
    commit('setUserWisdom', usersWisdoms);
  },
  async getUserLikedWisdomReply({ commit, state }) {
    const usersWisdoms = await firebase
      .firestore()
      .collection('users')
      .doc(state.user.uid)
      .collection('wisdom')
      .doc('likedReply')
      .get()
      .then((doc) => {
        return doc.data().id;
      });
    commit('setUserLikedWisdomReply', usersWisdoms);
  },
  async getPostedWisdom({ commit, state }) {
    const postedWisdom = await firebase
      .firestore()
      .collection('users')
      .doc(state.user.uid)
      .collection('wisdom')
      .doc('post')
      .get()
      .then((doc) => {
        return doc.data().id;
      });
    commit('setPostedWisdom', postedWisdom);
  },
};
