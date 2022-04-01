export default function ({ store, redirect }) {
  if (store.getters['user/isAuthenticated']) {
    return redirect('/timeline');
  }
}
