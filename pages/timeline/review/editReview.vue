<template>
  <div style="height: 100%" align="center">
    <div ref="map" />
    <v-card width="98vw">
      <v-container style="height: 100%" fluid>
        <v-row justify="center" align-content="center" style="height: 100%" fluid>
          <v-col>
            <v-row justify="center" align-content="center">
              <v-col align-content="center">
                <h3 align="center">クチコミ</h3>
                <v-card-subtitle align="center">※は必須項目です</v-card-subtitle>
                <input-place :label="placeholder" @place="placeAdd"></input-place>
                <v-row justify="center" align="center">
                  <v-col cols="5">※おすすめ度</v-col>
                  <v-col cols="7">
                    <star-rating
                      v-model="rating"
                      :show-rating="showRating"
                      :star-size="starSize"
                      @rating-selected="setRating"
                    ></star-rating>
                  </v-col>
                </v-row>
                <v-row justify="center" align-content="center">
                  <v-col cols="5">利用した時間帯</v-col>
                  <v-col cols="7" class="pt-0">
                    <dl>
                      <dd>
                        <v-row class="pa-0">
                          <v-col cols="4" align="center" class="pa-0">
                            <input
                              id="scene0"
                              v-model="scene"
                              value="朝"
                              type="radio"
                              class="scene"
                              @click="radioDeselection(this, 1)"
                            />
                            <label class="check_label" for="scene0">朝</label>
                          </v-col>
                          <v-col cols="4" align="center" class="pa-0">
                            <input
                              id="scene1"
                              v-model="scene"
                              value="昼"
                              type="radio"
                              class="scene"
                              @click="radioDeselection(this, 2)"
                            />
                            <label class="check_label" for="scene1">昼</label>
                          </v-col>
                          <v-col cols="1" align="center" class="pa-0">
                            <input
                              id="scene2"
                              v-model="scene"
                              value="夜"
                              type="radio"
                              class="scene"
                              @click="radioDeselection(this, 3)"
                            />
                            <label class="check_label" for="scene2">夜</label>
                          </v-col>
                        </v-row>
                      </dd>
                    </dl>
                  </v-col>
                </v-row>
                <v-file-input
                  v-show="!img"
                  color="#61d4b3"
                  accept="image/png, image/jpeg, image/bmp"
                  prepend-icon="mdi-camera"
                  label="※画像"
                  :clearable="false"
                  @change="imgAdd"
                ></v-file-input>
                <v-textarea
                  v-model="content"
                  color="#61d4b3"
                  auto-grow
                  label="コメント"
                  rows="5"
                  prepend-icon="mdi-message-processing"
                ></v-textarea>
                <cool-select
                  v-model="selected"
                  class="tags"
                  :items="hashtags"
                  placeholder="#ハッシュタグ"
                />
                <v-row>
                  <v-col>
                    <v-icon class="float">mdi-cash-multiple</v-icon>
                    <v-textarea
                      v-model="budget"
                      type="number"
                      color="#61d4b3"
                      auto-grow
                      maxlength="6"
                      label="使用した金額"
                      rows="1"
                      class="budget"
                      oninput="value = value.replace(/[^0-9]+/i,'');"
                    ></v-textarea>
                    <h3 class="float">円</h3>
                    <div class="cb"></div>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="6">
                    <v-textarea
                      v-model="genre"
                      color="#61d4b3"
                      auto-grow
                      label="ジャンル"
                      rows="1"
                      prepend-icon="mdi-pencil"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="4">
                    <cool-select v-model="selectGenre" :items="genres" placeholder="選ぶ" />
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="12" align="center">
                    <v-dialog v-model="postDialog" persistent max-width="290">
                      <template v-slot:activator="{ on, attrs }">
                        <div style="padding: 10px 9px">
                          <v-btn
                            rounded
                            width="80vw"
                            class="white--text button-color center"
                            outlined
                            v-bind="attrs"
                            :type="buttonType"
                            :disabled="rating == 0 || placeName == ''"
                            v-on="on"
                            >編集完了</v-btn
                          >
                        </div>
                      </template>
                      <v-card>
                        <v-card-title>編集内容を保存しますか？</v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="pink darken-1" text @click="postDialog = false"
                            >キャンセル</v-btn
                          >
                          <v-btn class="white--text button-color" tile @click.once="post()"
                            >保存する</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="finishedDialog" persistent max-width="290">
                      <v-card>
                        <v-card-title>{{ comment }}</v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="pink darken-1" text @click.once="finish()">閉じる</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="12" align="center">
                    <v-dialog v-model="deleteDialog" persistent max-width="290">
                      <template v-slot:activator="{ on, attrs }">
                        <div style="padding: 10px 9px">
                          <v-btn
                            rounded
                            width="80vw"
                            color="error"
                            outlined
                            v-bind="attrs"
                            v-on="on"
                            >削除する</v-btn
                          >
                        </div>
                      </template>
                      <v-card>
                        <v-card-title>このクチコミを削除しますか？</v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="pink darken-1" text @click="deleteDialog = false"
                            >キャンセル</v-btn
                          >
                          <v-btn class="white--text button-color" tile @click="notRead()"
                            >削除する</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="deletedDialog" persistent max-width="290">
                      <v-card>
                        <v-card-title>削除しました。</v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="pink darken-1" text @click="finish()">閉じる</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { CoolSelect } from 'vue-cool-select';
import StarRating from 'vue-star-rating';
import InputPlace from '~/components/Molecules/AppInputPlace';
import firebase from '~/plugins/firebase';

const reviewTags = firebase.firestore().collection('reviewTags');

export default {
  layout: 'onlyBack',
  components: {
    CoolSelect,
    StarRating,
    InputPlace,
  },
  data() {
    return {
      placeholder: '※場所を入力',
      inputType: 'text',
      buttonType: 'submit',
      contentPlaceholder: '内容',
      placeId: '',
      mainImg: '',
      img: '',
      subImg: [],
      content: '',
      rating: 0,
      showRating: false,
      starSize: 30,
      budget: null,
      scene: [],
      hashtags: [],
      genres: [],
      selectGenre: '',
      genre: '',
      keywords: [],
      postValidation: false,
      fiels: ['place_id', 'name', 'type'],
      imgPath: 'reviews/image/',
      imgLavel: '画像',
      imgText: '画像が選択されていません',
      selected: null,
      remove: 0,
      reviewId: '',
      postDialog: false,
      finishedDialog: false,
      deleteDialog: false,
      deletedDialog: false,
      comment: '',
    };
  },
  computed: {
    ...mapGetters({
      uid: 'user/uid',
      email: 'user/email',
      id: 'place/id',
      pname: 'place/pname',
    }),
  },
  watch: {
    selected() {
      if (this.selected !== null) {
        if (this.selected !== '') {
          this.content = this.content + '\n' + this.selected;
          this.selected = '';
        }
      }
    },
    selectGenre() {
      if (this.selectGenre !== null) {
        if (this.selectGenre !== '') {
          this.genre = this.selectGenre;
          this.selectGenre = null;
        }
      }
    },
  },
  mounted() {
    const self = this;
    const reviews = firebase.firestore().collection('reviews');
    reviews
      .doc(self.$store.state.review.reviewId)
      .get()
      .then((doc) => {
        self.reviewId = doc.id;
        self.placeName = doc.data().name;
        self.placeholder = doc.data().name;
        self.rating = doc.data().rating;
        self.content = doc.data().comment;
        self.placeId = doc.data().placeId;
        self.genre = doc.data().genre;
        self.img = doc.data().mainImgUrl;
        self.scene = doc.data().scene;
      })
      .catch((err) => {
        alert('エラー' + err);
      });
    reviews
      .doc(self.$store.state.review.reviewId)
      .collection('detail')
      .doc('browse')
      .get()
      .then((doc) => {
        self.budget = doc.data().budget;
      })
      .catch((err) => {
        alert('エラー' + err);
      });
    reviewTags
      .doc('hashtags')
      .get()
      .then((doc) => {
        self.hashtags = doc.data().hashtags;
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
    reviewTags
      .doc('genres')
      .get()
      .then((doc) => {
        self.genres = doc.data().genres;
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  },
  methods: {
    onClickLocation() {
      const place = this.mapAutoComplete.getPlace();
      this.placeId = place.place_id;
      this.placeName = place.name;
    },
    setRating(rating) {
      this.rating = rating;
    },
    imgAdd(url) {
      this.img = url;
    },
    placeAdd(val) {
      this.placeId = val.placeId;
      this.placeName = val.placeName;
    },
    radioDeselection(already, numeric) {
      if (this.remove === numeric) {
        this.scene = '';
        this.remove = 0;
      } else {
        this.remove = numeric;
      }
    },
    post() {
      console.log('aa');
      const self = this;
      let str = '';
      let tags = [];
      if (this.content !== '') {
        str = this.content.replace('＃', '#');
        tags = str.match(/[#＃][Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm);
        if (tags) {
          const tags2 = tags.filter((n) => n !== '#');
          const arr = this.hashtags.concat(tags2);
          let newHashtags = this.hashtags;
          newHashtags = [...new Set(arr)];
          if (this.hashtags !== newHashtags) {
            reviewTags.doc('hashtags').update({
              hashtags: newHashtags,
            });
          }
        }
      }
      if (this.genre !== '') {
        const arr2 = this.genres.concat(this.genre);
        this.genres = [...new Set(arr2)];
        reviewTags.doc('genres').update({
          genres: self.genres,
        });
      }

      const review = firebase
        .firestore()
        .collection('reviews')
        .doc(this.$store.state.review.reviewId);
      const timestamp = firebase.firestore.Timestamp.now();
      review
        .update({
          placeId: self.placeId,
          name: self.placeName,
          mainImgUrl: self.img,
          comment: str,
          rating: self.rating,
          scene: self.scene,
          hashtags: tags,
          genre: self.genre,
          uid: self.uid,
          email: self.email,
          isRead: true,
        })
        .then((doc) => {
          review
            .collection('detail')
            .doc('browse')
            .update({
              budget: self.budget,
              imgUrl: self.subImg,
              updatedAt: timestamp,
            })
            .then(() => {
              self.postDialog = false;
              self.finishedDialog = true;
              self.comment = '編集を保存しました。';
            })
            .catch((err) => {
              alert(err);
            });
        })
        .catch((err) => {
          alert(err);
        });
    },
    finish() {
      this.finishedDialog = false;
      this.$router.go(-1);
    },
    notRead() {
      const self = this;
      const review = firebase
        .firestore()
        .collection('reviews')
        .doc(this.$store.state.review.reviewId);
      review
        .update({
          isRead: false,
        })
        .then((doc) => {
          self.comment = '削除しました。';
          self.deleteDialog = false;
          self.deletedDialog = true;
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<style scoped>
input[type='radio'] {
  display: none;
}
input[type='radio'].scene:checked + label {
  background: orange;
  color: #fff;
}
.check_label {
  display: block;
  float: left;
  margin: 5px;
  width: 60px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
  color: gray;
  border: 2px solid grey;
  border-radius: 5px;
}
.cb {
  clear: both;
}
.float {
  float: left;
  margin: 8px 4px 12px 4px;
  padding-top: 12px;
}
.budget {
  float: left;
  width: 120px;
}

.tags {
  box-shadow: none !important;
  width: 180px;
  padding: 2px 2px;
}
.button-color {
  background: linear-gradient(to right, #36aa37 0%, #2da8aa 50%);
  opacity: 0.6;
}
</style>
<style>
.IZ-select__input {
  box-shadow: none !important;
  padding: 2px 2px !important;
}
</style>
