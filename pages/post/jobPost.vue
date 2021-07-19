<template>
  <div class="job-post-wrap">
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
            v-model="name"
            color="#61d4b3"
            label="※店舗名/アルバイト名"
            prepend-icon="mdi-flag-variant"
            :rules="[() => !!name || requiredText]"
            required
          ></v-text-field>
          <input-place :label="placeholder" @place="placeAdd"></input-place>
          <v-select
            v-model="genre"
            :items="genres"
            sv-model="genre"
            color="#61d4b3"
            label="※ジャンル"
            prepend-icon="mdi-content-copy"
            :rules="[() => !!genre || requiredText]"
            required
          ></v-select>
          <v-text-field
            v-model="money"
            color="#61d4b3"
            label="※時給"
            prepend-icon="mdi-currency-cny"
            :rules="[() => !!money || requiredText]"
            required
          ></v-text-field>
          <div style="display: inline-flex">
            <v-dialog
              ref="dialog1"
              v-model="startTimeModal"
              :return-value.sync="startTime"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startTime"
                  color="#61d4b3"
                  label="※勤務時間(始まり)"
                  prepend-icon="mdi-clock"
                  readonly
                  class="mr-3"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker v-if="startTimeModal" v-model="startTime" full-width color="#61d4b3">
                <v-btn text color="#61d4b3" @click="startTimeModal = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="blue" @click="$refs.dialog1.save(startTime)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
            <v-dialog
              ref="dialog2"
              v-model="endTimeModal"
              :return-value.sync="endTime"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endTime"
                  color="#61d4b3"
                  label="※(終わり)"
                  prepend-icon
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker v-if="endTimeModal" v-model="endTime" full-width color="#61d4b3">
                <v-btn text color="#61d4b3" @click="endTimeModal = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="blue" @click="$refs.dialog2.save(endTime)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </div>
          <v-textarea
            v-model="content"
            color="#61d4b3"
            label="※仕事内容"
            auto-grow
            rows="3"
            prepend-icon="mdi-pencil"
            :rules="[() => !!content || requiredText]"
            required
          ></v-textarea>
          <v-textarea
            v-model="shift"
            color="#61d4b3"
            label="※シフト詳細"
            auto-grow
            rows="3"
            prepend-icon="mdi-calendar-clock"
            :rules="[() => !!shift || requiredText]"
            required
          ></v-textarea>
          <v-text-field
            v-model="contactEmail"
            color="#61d4b3"
            label="※連絡先(メールアドレス)"
            prepend-icon="mdi-email-multiple"
            :rules="[() => !!contactEmail || requiredText]"
            required
          ></v-text-field>
          <v-text-field
            v-model="holiday"
            color="#61d4b3"
            label="定休日"
            prepend-icon="mdi-seat-individual-suite"
          ></v-text-field>
          <v-textarea
            v-model="welfare"
            color="#61d4b3"
            label="福利厚生"
            auto-grow
            rows="3"
            prepend-icon="mdi-hand-heart"
          ></v-textarea>
          <v-text-field
            v-model="carfare"
            color="#61d4b3"
            label="交通費"
            prepend-icon="mdi-train-car"
          ></v-text-field>
          <v-text-field
            v-model="refer"
            color="#61d4b3"
            label="紹介料"
            prepend-icon="mdi-cash-usd"
          ></v-text-field>
          <v-text-field
            v-model="hpUrl"
            color="#61d4b3"
            label="ホームページなど（URL）"
            prepend-icon="mdi-home-circle-outline"
          ></v-text-field>
          <v-textarea
            v-model="secret"
            color="#61d4b3"
            label="ここだけの話"
            auto-grow
            rows="3"
            prepend-icon="mdi-lock"
          ></v-textarea>
          <div class="post-button">
            <post-button
              :button-method="post"
              :button-type="buttonType"
              :button-disabled="
                img == '' ||
                name == '' ||
                genre == '' ||
                placeId == '' ||
                placeName == '' ||
                money == '' ||
                startTime == '' ||
                endTime == '' ||
                content == '' ||
                shift == '' ||
                contactEmail == ''
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
      inputType: 'text',
      buttonType: 'submit',
      imgPath: 'jobs/image/',
      placeholder: '※場所',
      imgLabel: '※画像',
      requiredText: 'この項目は必須です',
      startTimeModal: false,
      endTimeModal: false,
      genres: [
        '生協紹介',
        '大学紹介',
        '実験・研究協力',
        '飲食/フード',
        'カフェ',
        '居酒屋',
        '販売・接客・サービス',
        'アパレル・ファッション関連',
        'レジャー・アミューズメント',
        'モデル・俳優・エキストラ',
        'クリエイティブ・編集',
        'マスコミ・出版',
        'ラジオ・テレビ局',
        'カメラマン',
        'エンジニア・サポート・保守',
        'イベント・キャンペーン',
        '教育',
        '塾講',
        '家庭教師',
        '試験監督',
        'エステ・理美容',
        '医療・介護・保育',
        'オフィスワーク',
        '営業',
        '配送・引越・ドライバー',
        '軽作業',
        '工場・倉庫・建築・土木',
        '警備・清掃・ビル管理',
        'その他',
        '誰か助けて！',
      ],
      img: '',
      name: '',
      genre: '',
      placeId: '',
      placeName: '',
      money: '',
      geometry: '',
      startTime: '',
      endTime: '',
      holiday: '',
      content: '',
      shift: '',
      welfare: '',
      carfare: '',
      refer: '',
      contactEmail: '',
      hpUrl: '',
      secret: '',
      res: '',
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
      const timestamp = firebase.firestore.Timestamp.now();
      const db = firebase.firestore();
      const job = db.collection('jobs');
      const user = db.collection('users');
      job
        .add({
          img: that.img,
          name: that.name,
          genre: that.genre,
          placeId: that.placeId,
          placeName: that.placeName,
          money: that.money,
          geometry: that.geometry,
          startTime: that.startTime,
          endTime: that.endTime,
          isRecruit: true,
          poster: that.uid,
          email: that.email,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        .then((doc) => {
          job.doc(doc.id).collection('detail').doc('browse').set({
            holiday: that.holiday,
            content: that.content,
            shift: that.shift,
            welfare: that.welfare,
            carfare: that.carfare,
            refer: that.refer,
            hp: that.hpUrl,
            contactEmail: that.contactEmail,
            secret: that.secret,
          });

          user
            .doc(this.uid)
            .collection('job')
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
.job-post-wrap {
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
}
.required-phrase {
  margin-bottom: 0;
  margin-left: 4px;
  font-size: 0.8rem;
  cursor: default;
}
.post-button {
  text-align: center;
}
</style>
