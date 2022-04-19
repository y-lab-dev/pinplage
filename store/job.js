import firebase from '@/plugins/firebase';
const recruitdb = firebase.firestore().collection('recruit');

export const state = () => ({
  jobId: '',
  geometry: '',
  recruitArray: [],
  recruitDetail: {},
  recruitObject: {},
});

export const getters = {
  id(state) {
    return state.recruitObject.id;
  },
  geometry(state) {
    return state.geometry;
  },
  recruitArray(state) {
    return state.recruitArray;
  },
  recruitDetail(state) {
    return state.recruitDetail;
  },
  recruitObject(state) {
    return state.recruitObject;
  },
};

export const mutations = {
  getData(state, payload) {
    state.jobId = payload.id;
    state.geometry = payload.geometry;
  },
  setRecruitArray(state, { payload, target }) {
    const checkExist = state.recruitArray.some((recruit) => recruit.id === payload.id);
    if (!checkExist) {
      this._vm.$set(state.recruitArray, target, payload);
    }
  },
  modiyRecruitArray(state, { payload, target }) {
    this._vm.$set(state.recruitArray, target, payload);
  },
  removeRecruitArray(state, { target }) {
    this._vm.$delete(state.recruitArray, target);
  },
  setRecruitDetail(state, { payload }) {
    state.recruitDetail = payload;
  },
  setRecruitObject(state, { payload }) {
    state.recruitObject = payload;
  },
};
export const actions = {
  async getRecruitArray({ commit }) {
    await recruitdb
      .where('isConfirmed', '==', true)
      .where('isPublic', '==', true)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const recruit = change.doc.data();
            const postedRecruit = {
              id: change.doc.id,
              img: recruit.img,
              genre: recruit.genre,
              placeName: recruit.placeName,
              money: recruit.money,
              remark: recruit.remark,
              geometry: recruit.geometry,
              startTime1: recruit.startTime1,
              endTime1: recruit.endTime1,
              startTime2: recruit.startTime2,
              endTime2: recruit.endTime2,
              startTime3: recruit.startTime3,
              endTime3: recruit.endTime3,
              isPublic: recruit.isPublic,
              poster: recruit.uid,
              contactEmail: recruit.contactEmail,
              contactPhone: recruit.contactPhone,
              contactRemark: recruit.contactRemark,
              date: change.doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
            };
            commit('setRecruitArray', { payload: postedRecruit, target: change.newIndex });
          } else if (change.type === 'modified') {
            const recruit = change.doc.data();
            const modifiedRecruit = {
              id: change.doc.id,
              img: recruit.img,
              genre: recruit.genre,
              placeName: recruit.placeName,
              money: recruit.money,
              remark: recruit.remark,
              geometry: recruit.geometry,
              startTime1: recruit.startTime1,
              endTime1: recruit.endTime1,
              startTime2: recruit.startTime2,
              endTime2: recruit.endTime2,
              startTime3: recruit.startTime3,
              endTime3: recruit.endTime3,
              isPublic: recruit.isPublic,
              poster: recruit.uid,
              contactEmail: recruit.contactEmail,
              contactPhone: recruit.contactPhone,
              contactRemark: recruit.contactRemark,

              date: change.doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
            };
            commit('modifyRecruitArray', { payload: modifiedRecruit, target: change.newIndex });
          } else if (change.type === 'removed') {
            commit('removeRecruitArray', { target: change.oldIndex });
          }
        });
      });
  },
  async getRecruitDetail({ commit }, payload) {
    await recruitdb
      .doc(payload.id)
      .collection('detail')
      .doc('browse')
      .get()
      .then((doc) => {
        const recruitDetail = {
          content: doc.data().content,
          employee: doc.data().employee,
          shift: doc.data().shift,
          vacation: doc.data().vacation,
          school: doc.data().school,
          welfare: doc.data().welfare,
          training: doc.data().training,
          hair: doc.data().hair,
          opinion: doc.data().opinion,
          holiday: doc.data().holiday,
          carfare: doc.data().carfare,
          hp: doc.data().hp,
        };
        commit('setRecruitDetail', { payload: recruitDetail });
      });
    await recruitdb
      .doc(payload.id)
      .get()
      .then((doc) => {
        const recruitObject = {
          id: doc.id,
          img: doc.data().img,
          genre: doc.data().genre,
          placeName: doc.data().placeName,
          money: doc.data().money,
          remark: doc.data().remark,
          geometry: doc.data().geometry,
          startTime1: doc.data().startTime1,
          endTime1: doc.data().endTime1,
          startTime2: doc.data().startTime2,
          endTime2: doc.data().endTime2,
          startTime3: doc.data().startTime3,
          endTime3: doc.data().endTime3,
          isPublic: doc.data().isPublic,
          poster: doc.data().uid,
          contactEmail: doc.data().contactEmail,
          contactPhone: doc.data().contactPhone,
          contactRemark: doc.data().contactRemark,
        };
        commit('setRecruitObject', { payload: recruitObject });
      });
  },
};
