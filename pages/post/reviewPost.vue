<template>
  <v-container>
    <div ref="map" />
    <v-row justify="center">
      <v-col cols="12" md="8" sm="6">
        <v-card>
          <v-card-text>
            <h2 class="center">クチコミ</h2>
            <input-place :label="placeholder" @place="placeAdd"></input-place>
            <rating :star-size="50" @rating-selected="rating = $event" @input="star"></rating>
            <br />
            <div>
              <dl>
                <dd>
                  <input id="scene0" v-model="scene" value="朝" type="checkbox" class="scene" />
                  <label class="check_label" for="scene0">朝</label>
                  <input id="scene1" v-model="scene" value="昼" type="checkbox" class="scene" />
                  <label class="check_label" for="scene1">昼</label>
                  <input id="scene2" v-model="scene" value="夜" type="checkbox" class="scene" />
                  <label class="check_label" for="scene2">夜</label>
                  <input id="scene3" v-model="scene" value="その他" type="checkbox" class="scene" />
                  <label class="check_label" for="scene3">その他</label>
                </dd>
              </dl>
            </div>
            <div class="cb"></div>
            <input-image :img-path="imgPath" @imgSubmit="imgAdd"></input-image>
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
            <v-icon class="float">mdi-cash-multiple</v-icon>
            <v-textarea
              v-model="budgetLow"
              color="#61d4b3"
              auto-grow
              label="最低予算"
              rows="1"
              class="budget"
            ></v-textarea>
            <h3 class="float">円～&nbsp;</h3>
            <v-textarea
              v-model="budgetHigh"
              color="#61d4b3"
              auto-grow
              label="最高予算"
              rows="1"
              class="budget"
            ></v-textarea>
            <h3 class="float">円&nbsp;</h3>
            <div class="cb"></div>
            <v-textarea
              v-model="genre"
              color="#61d4b3"
              auto-grow
              label="ジャンル (ラーメン,居酒屋,etc)"
              rows="1"
              prepend-icon="mdi-pencil"
            ></v-textarea>
            <div class="center">
              <!-- <post-button>投稿</post-button> -->
              <post-button
                class="center"
                :button-method="post"
                :button-type="buttonType"
                :button-disabled="rating == 0 || placeName == '' || content == ''"
                >投稿</post-button
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { CoolSelect } from 'vue-cool-select';
import algoliasearch from 'algoliasearch';
import PostButton from '~/components/Atoms/AppButton';
import Rating from '~/components/molecules/PostRating';
import InputImage from '~/components/Molecules/AppImageInput';
import InputPlace from '~/components/Molecules/AppInputPlace';
import firebase from '~/plugins/firebase';

const reviewHashtags = firebase.firestore().collection('reviewHashtags');

export default {
  layout: 'protected',
  components: {
    CoolSelect,
    PostButton,
    Rating,
    InputImage,
    InputPlace,
  },
  data() {
    return {
      searchClient: algoliasearch('ZI3A3BYLFT', 'dd660cd8b43da0cc68310ac6a365438b'),
      placeholder: '店名',
      inputType: 'text',
      buttonType: 'submit',
      contentPlaceholder: '内容',
      placeId: '',
      placeName: '',
      mainImg: '',
      subImg: [],
      content: '',
      rating: 0,
      budgetLow: null,
      budgetHigh: null,
      scene: [],
      hashtags: [],
      genre: '',
      keywords: [],
      postValidation: false,
      fiels: ['place_id', 'name', 'type'],
      imgPath: 'reviews/image/',
      selected: null,
    };
  },
  computed: {
    ...mapGetters({ uid: 'user/uid', email: 'user/email' }),
  },
  watch: {
    selected() {
      if (this.selected !== null) {
        this.content = this.content + '\n' + this.selected;
        this.selected = '';
      }
    },
  },
  mounted() {
    const self = this;
    reviewHashtags
      .doc('browse')
      .get()
      .then((doc) => {
        self.hashtags = doc.data().hashtags;
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
      console.log(place);
    },
    star(star) {
      this.rating = star;
    },
    imgAdd(url) {
      this.img = url;
    },
    placeAdd(val) {
      this.placeId = val.placeId;
      this.placeName = val.placeName;
    },
    post() {
      const self = this;
      const str = this.content.replace('＃', '#');
      const tags = str.match(/[#＃][Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm);
      const arr = this.hashtags.concat(tags);
      this.hashtags = [...new Set(arr)];
      reviewHashtags.doc('browse').update({
        hashtags: self.hashtags,
      });

      const review = firebase.firestore().collection('reviews');
      const timestamp = firebase.firestore.Timestamp.now();
      review
        .add({
          placeId: self.placeId,
          name: self.placeName,
          mainImgUrl: self.mainImg,
          comment: self.content,
          rating: self.rating,
          scene: self.scene,
          hashtags: tags,
          genre: self.genre,
          createdAt: timestamp,
          uid: self.uid,
          email: self.email,
          isRead: true,
        })
        .then((doc) => {
          review
            .doc(doc.id)
            .collection('detail')
            .doc('browse')
            .set({
              budgetLow: self.budgetLow,
              budgetHigh: self.budgetHigh,
              imgUrl: self.subImg,
              updatedAt: timestamp,
            })
            .then(() => {
              // self.$router.push({ name: 'timeline' });
              alert('コメントが投稿されました');
              this.$router.go(-1);
            })
            .catch((err) => {
              alert(err);
            });
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<style scoped>
.center {
  text-align: center;
}

input[type='checkbox'] {
  display: none;
}
input[type='checkbox'].scene:checked + label {
  background: #61d4b3;
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
  color: #61d4b3;
  border: 2px solid #61d4b3;
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
  width: 72px;
}

.tags {
  box-shadow: none !important;
  width: 180px;
  padding: 2px 2px;
}
</style>
<style>
.IZ-select__input {
  box-shadow: none !important;
  padding: 2px 2px !important;
}
</style>
