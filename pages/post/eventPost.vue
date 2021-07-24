<template>
  <div class="event-post-wrap">
    <v-container>
      <template>
        <Modal
          :modal-title="modalTitle"
          :modal-text="modalText"
          :modal-button="buttonText"
          :modal-toggle="modal"
          @changeValue="clickModal()"
        />
      </template>
      <p class="required-phrase">※は必須項目です</p>
      <v-row justify="center">
        <v-col cols="12">
          <input-image :img-path="imgPath" :label="imgLabel" @imgSubmit="imgAdd"></input-image>
          <v-text-field
            v-model="title"
            color="#61d4b3"
            label="※イベント名"
            prepend-icon="mdi-flag-variant"
            :rules="[() => !!title || requiredText]"
            required
          ></v-text-field>
          <v-select
            v-model="type"
            color="#61d4b3"
            :items="types"
            sv-model="Type"
            label="※イベントタイプ"
            prepend-icon="mdi-content-copy"
            :rules="[() => !!type || requiredText]"
            required
          ></v-select>
          <input-place :label="placeholder" @place="placeAdd"></input-place>
          <!-- ここからワイがイベント改善するよ -->
          <v-row>
            <v-col cols="1"><v-icon>mdi-calendar</v-icon></v-col>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <div id="date-picker">
                <vue-ctk-date-time-picker
                  v-model="startDate"
                  label="※日程(始まり)"
                  color="#61d4b3"
                  :formatted="formatView"
                  :format="formatStyle"
                  :locale="lang"
                ></vue-ctk-date-time-picker>
              </div>
            </v-col>
            <v-col cols="2"></v-col
            ><v-col cols="10">
              <div id="date-picker">
                <vue-ctk-date-time-picker
                  v-model="finishDate"
                  label="※日程(終わり)"
                  color="#61d4b3"
                  :formatted="formatView"
                  :format="formatStyle"
                  :locale="lang"
                ></vue-ctk-date-time-picker>
              </div>
            </v-col>
          </v-row>
          <!-- ここから削除対象 -->
          <v-text-field
            v-model="capacity"
            color="#61d4b3"
            label="定員"
            placeholder="ex.特になし,20人"
            prepend-icon="mdi-account-multiple"
          ></v-text-field>
          <v-text-field
            v-model="entryFee"
            color="#61d4b3"
            label="参加費"
            prepend-icon="mdi-cash-usd"
          ></v-text-field>
          <v-text-field
            v-model="hpUrl"
            color="#61d4b3"
            label="ホームページなど（URL）"
            prepend-icon="mdi-home-circle-outline"
          ></v-text-field>
          <v-textarea
            v-model="content"
            color="#61d4b3"
            auto-grow
            label="※詳細"
            rows="3"
            prepend-icon="mdi-pencil"
            :rules="[() => !!content || requiredText]"
            required
          ></v-textarea>
          <div class="post-button">
            <post-button
              :button-method="post"
              :button-type="buttonType"
              :button-disabled="
                title == '' ||
                type == '' ||
                placeId == '' ||
                placeName == '' ||
                startDate == '' ||
                finishDate == '' ||
                content == '' ||
                finishDate - startDate <= 0
              "
              >投稿</post-button
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
import InputImage from '~/components/Molecules/AppImageInput';
import InputPlace from '~/components/Molecules/AppInputPlace';
import Modal from '~/components/Molecules/AppModal';

export default {
  layout: 'onlyBack',
  components: {
    PostButton,
    InputImage,
    InputPlace,
    Modal,
  },
  data() {
    return {
      buttonType: 'submit',
      imgPath: 'events/image/',
      placeholder: '※場所',
      imgLabel: '画像',
      requiredText: 'この項目は必須です',
      title: '',
      type: '新歓',
      placeId: '',
      placeName: '',
      geometry: '',
      lang: 'ja',
      formatView: 'YYYY年MM月DD日 HH:mm',
      formatStyle: 'YYYY-MM-DD HH:mm',
      startDate: '',
      finishDate: '',
      capacity: '',
      img: '',
      entryFee: '',
      hpUrl: '',
      content: '',
      types: ['フリーイベント', 'セミナー'],
      publisherArray: {},
      publishers: [],
      addButton: '投稿',
      formIsValid: true,
      modal: false,
      modalTitle: '',
      modalText: '',
      buttonText: '',
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email' }),
  },
  methods: {
    post() {
      const that = this;
      const event = firebase.firestore().collection('events');
      const timestamp = firebase.firestore.Timestamp.now();
      const db = firebase.firestore();
      const user = db.collection('users');
      // イベント日付のフォーマット（リファクタリングの余地あり）
      const formatStart = new Date(this.startDate);
      const formatFinish = new Date(this.finishDate);
      const sYear = formatStart.getFullYear();
      const sMonth = 1 + formatStart.getMonth();
      const sDate = formatStart.getDate();
      const sHours = formatStart.getHours();
      const sMinutes = formatStart.getMinutes();
      const fYear = formatFinish.getFullYear();
      const fMonth = 1 + formatFinish.getMonth();
      const fDate = formatFinish.getDate();
      const fHours = formatFinish.getHours();
      const fMinutes = formatFinish.getMinutes();
      event
        .add({
          title: that.title,
          type: that.type,
          img: that.img,
          placeId: that.placeId,
          placeName: that.placeName,
          geometry: that.geometry,
          // 下二つはYYYY-MM-DD HH:MM
          startDate: that.startDate,
          finishDate: that.finishDate,
          // 下二つはYYYY年MM月DD日 HH:MM
          startView: sYear + '年' + sMonth + '月' + sDate + '日 ' + sHours + ':' + sMinutes,
          finishView: fYear + '年' + fMonth + '月' + fDate + '日 ' + fHours + ':' + fMinutes,
          createdAt: timestamp,
          updatedAt: timestamp,
          cancel: false,
          poster: that.uid,
          email: that.email,
          interest: 0,
          join: 0,
        })
        .then((doc) => {
          event
            .doc(doc.id)
            .collection('detail')
            .doc('browse')
            .set({
              startView: sYear + '年' + sMonth + '月' + sDate + '日 ' + sHours + ':' + sMinutes,
              finishView: fYear + '年' + fMonth + '月' + fDate + '日 ' + fHours + ':' + fMinutes,
              fee: that.entryFee,
              capacity: that.capacity,
              hpUrl: that.hpUrl,
              content: that.content,
            });
          user
            .doc(this.uid)
            .collection('event')
            .doc('post')
            .update({
              id: firebase.firestore.FieldValue.arrayUnion(doc.id),
            })
            .then(() => {
              that.modal = !this.modal;
              that.modalTitle = 'プラージュ獲得';
              that.modalText =
                '10プラージュ獲得しました！(反映されるまで少し時間がかかる場合がございます)';
              that.buttonText = 'Ok';
            })
            .catch((err) => {
              alert(err);
            });
        })
        .catch((err) => {
          alert(err);
        });
    },
    imgAdd(url) {
      this.img = url;
    },
    placeAdd(val) {
      this.placeId = val.placeId;
      this.placeName = val.placeName;
      this.geometry = val.geometry;
    },
    clickModal() {
      this.modal = !this.modal;
      this.$router.push({ name: 'timeline' });
    },
  },
};
</script>
<style scoped>
.event-post-wrap {
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
}
.required-phrase {
  margin-bottom: 0;
  margin-left: 4px;
  font-size: 0.8rem;
}
.post-button {
  text-align: center;
}
</style>
<style>
.field-input[data-v-5b500588] {
  font-size: 14px;
  min-height: 50px;
  padding-bottom: 2px;
  padding-left: 1px;
  border: 1px solid rgba(0, 0, 0, 0);
  border-bottom: 1px solid rgb(148, 148, 148);
  border-radius: 0.5px;
  width: 85.5%;
}
.date-time-picker,
.date-time-picker input,
.date-time-picker label,
.date-time-picker p,
.date-time-picker span {
  font-family: sans-serif;
}
</style>
