import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDgFemyTKXVrVt1MHd4gik0zox6lXiygfU',
  authDomain: 'mcaexpf-2020.firebaseapp.com',
  databaseURL: 'https://mcaexpf-2020.firebaseio.com',
  projectId: 'mcaexpf-2020',
  storageBucket: 'mcaexpf-2020.appspot.com',
  messagingSenderId: '516312906962',
  appId: '1:516312906962:web:389eec529241b08943410b',
  measurementId: 'G-132GKBK5TS',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  firebase.firestore();
}

export default firebase;
