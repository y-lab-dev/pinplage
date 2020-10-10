export default function ({ store, redirect }) {
  if (!store.getters['user/isAuthenticated']) {
    return redirect('/login');
  } else {
    store.dispatch('user/getUserInfo');
    return redirect('/timeline');
  }
}
