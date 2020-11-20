import { getUserFromCookie } from '~/helpers';

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    const user = getUserFromCookie(req);
    if (user) {
      await commit('user/switchLogin');
      const { user_id: uid, email } = user;
      const obj = { uid, email };
      await commit('user/getData', obj);
      await dispatch('user/getUserInfo');
    }
  },
};
