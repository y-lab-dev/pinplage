<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <input-image :img-path="imgPath" @imgSubmit="imgAdd"></input-image>
        <v-text-field
          v-model="title"
          color="#61d4b3"
          label="イベント名"
          prepend-icon="mdi-flag-variant"
        ></v-text-field>
        <v-select
          v-model="type"
          color="#61d4b3"
          :items="types"
          sv-model="Type"
          label="イベントタイプ"
          prepend-icon="mdi-content-copy"
        ></v-select>
        <input-place
          :input-type="inputType"
          :input-placeholder="placeholder"
          @place="placeAdd"
        ></input-place>
        <v-dialog
          ref="dialogs"
          v-model="dateModal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              color="#61d4b3"
              label="日程"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" scrollable color="#61d4b3">
            <v-btn text color="#61d4b3" @click="dateModal = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="blue" @click="$refs.dialogs.save(date)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
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
                label="時間(始まり)"
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
            v-model="finishTimeModal"
            :return-value.sync="finishTime"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="finishTime"
                color="#61d4b3"
                label="時間(終わり)"
                prepend-icon
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-if="finishTimeModal" v-model="finishTime" full-width color="#61d4b3">
              <v-btn text color="#61d4b3" @click="finishTimeModal = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="$refs.dialog2.save(finishTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </div>
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
          label="詳細"
          rows="3"
          prepend-icon="mdi-pencil"
        ></v-textarea>
        <post-button
          :button-method="post"
          :button-type="buttonType"
          :button-disabled="
            img == '' ||
            title == '' ||
            type == '' ||
            placeId == '' ||
            placeName == '' ||
            date == '' ||
            startTime == '' ||
            finishTime == '' ||
            capacity == '' ||
            entryFee == '' ||
            content == ''
          "
          >投稿</post-button
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
import PostButton from '~/components/Atoms/AppButton';
import InputImage from '~/components/Molecules/AppImageInput';
import InputPlace from '~/components/Molecules/AppInputPlace';

export default {
  layout: 'onlyBack',
  components: {
    PostButton,
    InputImage,
    InputPlace,
  },
  data() {
    return {
      inputType: 'text',
      buttonType: 'submit',
      imgPath: 'events/image/',
      placeholder: '場所',
      title: '',
      type: '新歓',
      placeId: '',
      placeName: '',
      date: '',
      startTime: '',
      finishTime: '',
      capacity: '',
      img: '',
      entryFee: '無料',
      hpUrl: '',
      content: '',
      types: ['フリーイベント', 'セミナー'],
      publisherArray: {},
      publishers: [],
      addButton: '投稿',
      formIsValid: true,
      dateModal: false,
      startTimeModal: false,
      finishTimeModal: false,
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

      event
        .add({
          title: that.title,
          type: that.type,
          img: that.img,
          placeId: that.placeId,
          placeName: that.placeName,
          date: that.date,
          createdAt: timestamp,
          updatedAt: timestamp,
          cancel: false,
          poster: that.uid,
          email: that.email,
          interest: 0,
          join: 0,
        })
        .then((doc) => {
          event.doc(doc.id).collection('detail').doc('browse').set({
            startTime: that.startTime,
            finishTime: that.finishTime,
            fee: that.entryFee,
            capacity: that.capacity,
            hpUrl: that.hpUrl,
            content: that.content,
          });
        })
        .then(() => {
          that.$router.push({ name: 'timeline' });
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
    },
  },
};
</script>
