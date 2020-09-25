import Cookies from 'js-cookie';

export const state = () => ({
  user: {
    uid: '',
    email: '',
    isLogin: false,
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
};

export const mutations = {
  getData(state, payload) {
    state.user.uid = payload.uid;
    state.user.email = payload.email;
  },
  switchLogin(state) {
    state.user.isLogin = true;
  },
};

export const actions = {
  login({ commit }, payload) {
    Cookies.set('accessToken', payload.token, { expires: 365 });
    commit('getData', {
      uid: payload.uid,
      email: payload.email,
    });
    commit('switchLogin');
  },
};
