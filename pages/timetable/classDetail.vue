<template>
  <div class="dialog">
    <div v-if="!targetClass.edited && type == 'search'">
      <div v-if="pickClass == ''">
        <v-list style="padding: 0 0">
          <v-list-item style="padding: 0 0">
            <v-list-item-title>授業の追加</v-list-item-title>
            <v-btn icon @click="manualAdd">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
        <v-text-field
          v-model="keyword"
          color="#61d4b3"
          label="授業名又は科目コード又は教員名"
          :rules="rules"
          hide-details="auto"
          style="padding: 0 0"
        ></v-text-field>
        <v-btn
          v-for="data in displayList"
          :key="JSON.stringify(data)"
          text
          small
          @click="dataPick(data)"
        >
          <span>{{ data.listTitle | listName }}</span>
        </v-btn>
        <v-pagination
          v-if="length != 0"
          v-model="page"
          :length="length"
          total-visible="maxPage"
          circle
          @input="pageChange"
        ></v-pagination>
      </div>
      <div v-else>
        <v-list dense>
          <v-list-item v-for="(item, key) in dataList" :key="item.index">
            <v-list-item-icon>
              <v-icon>{{ iconList[key] }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-subtitle v-text="fullClassInfoJ[key]"></v-list-item-subtitle>
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn rounded color="green" dark @click="decision">決定</v-btn>
        <v-btn rounded color="red" dark @click="cansel">キャンセル</v-btn>
      </div>
    </div>
    <div v-else-if="!targetClass.edited && type == 'manual'">
      <v-list two-line subheader>
        <v-list-item v-for="(item, index) in classInfoJ" :key="index">
          <v-list-item-content v-if="isManualMode">
            <v-list-item-title v-text="item"></v-list-item-title>
            <v-list-item-subtitle v-text="editedInfo[classInfoE[index]]"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="isManualMode">
            <v-btn icon @click="manualClassInfo">
              <v-icon color="black">mdi-square-edit-outline</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content v-if="!isManualMode">
            <v-text-field
              v-model="editedInfo[classInfoE[index]]"
              color="#61d4b3"
              :label="classInfoJ[index] + 'の情報を入力してください'"
              hide-details="auto"
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-action v-if="!isManualMode">
            <v-btn icon @click="saveManualClassInfo">
              <v-icon color="black">mdi-bookmark-check</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <ButtonComponent
        :button-type="addButton"
        :button-method="manualSetData"
        :button-disabled="editedInfo.title == ''"
        style="margin: 0 auto; color: white; width: 100%"
        >授業を追加する</ButtonComponent
      >
    </div>
    <div v-else-if="targetClass.edited && !colorSelected">
      <v-list two-line subheader style="padding: 0 0">
        <v-list-item v-for="(item, index) in classInfoJ" :key="index">
          <v-list-item-content v-if="!isEditMode[classInfoE[index]]" style="padding: 0 0">
            <v-list-item-title v-text="item"></v-list-item-title>
            <v-list-item-subtitle v-text="editedInfo[classInfoE[index]]"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="!isEditMode[classInfoE[index]]">
            <v-btn icon @click="editClassInfo(classInfoE[index])">
              <v-icon color="black">mdi-square-edit-outline</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content v-if="isEditMode[classInfoE[index]]">
            <v-text-field
              v-model="editedInfo[classInfoE[index]]"
              color="#61d4b3"
              :label="classInfoJ[index] + 'の情報を入力してください'"
              hide-details="auto"
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-action v-if="isEditMode[classInfoE[index]]">
            <v-btn icon @click="saveEditClassInfo(classInfoE[index])">
              <v-icon color="black">mdi-bookmark-check</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list style="padding: 0 0">
        <v-list-item @click="colorSelect">
          <v-list-item-title>授業カラー</v-list-item-title>
          <v-list-item-avatar :color="chosenColor" size="32"></v-list-item-avatar>
        </v-list-item>
      </v-list>
      <v-textarea
        v-model="memo"
        color="#61d4b3"
        outlined
        label="メモ欄"
        rows="4"
        style="padding: 0 0"
      ></v-textarea>
      <section class="counters-wrapper">
        <div
          v-for="n in 3"
          :key="n"
          :class="{ attend: n === 1, absent: n === 2, late: n === 3 }"
          style="width: 30%"
        >
          <v-chip
            v-if="n === 1"
            v-tooltip.top="'Good!!'"
            color="teal"
            text-color="white"
            class="counter-name"
            style="font-size: 15px"
            @click="counter(n - 1, 1)"
            >{{ info[n - 1] }}{{ infoCount[n - 1] }}回</v-chip
          >
          <v-chip
            v-if="n === 2"
            v-tooltip.top="'Oh,my god!'"
            color="red"
            text-color="white"
            class="counter-name"
            style="font-size: 15px"
            @click="counter(n - 1, 1)"
            >{{ info[n - 1] }}{{ infoCount[n - 1] }}回</v-chip
          >
          <v-chip
            v-if="n === 3"
            v-tooltip.top="'Do not mind.'"
            color="orange"
            text-color="white"
            class="counter-name"
            style="font-size: 15px"
            @click="counter(n - 1, 1)"
            >{{ info[n - 1] }}{{ infoCount[n - 1] }}回
          </v-chip>
          <v-chip style="margin-top: 2px" x-small @click="counter(n - 1, -1)"
            ><v-icon>mdi-minus</v-icon></v-chip
          >
        </div>
      </section>
      <ButtonComponent
        :button-type="editButton"
        :button-method="setData"
        :button-disabled="
          editedInfo.title == '' || editedInfo.teacher == '' || editedInfo.room == ''
        "
        style="margin: 0 auto; color: white; width: 100%"
        >変更を保存する</ButtonComponent
      >
      <v-btn x-small outlined color="error" dark class="mt-3" @click="classDelete"
        >この授業を削除する</v-btn
      >
      <Dialog
        :dialog-title="'授業情報削除'"
        :dialog-text="'この授業を削除して宜しいですか？'"
        :dialog-button="'削除'"
        :dialog-cancel="'削除しない'"
        :dialog-toggle="dialog"
        @changeValue="deleteDecide('Y')"
        @changeSelect="dialog = !dialog"
      />
    </div>
    <div v-else-if="targetClass.edited && colorSelected">
      <v-list>
        <v-list-item v-for="(color, index) in colorList" :key="index" @click="colorChosed(color)">
          <v-list-item-avatar :color="color"></v-list-item-avatar>
          <v-row align="center" justify="end">
            <v-icon v-if="chosenColor == color">mdi-check</v-icon>
          </v-row>
        </v-list-item>
      </v-list>
    </div>
    <div class="close-btn" @click="$emit('detail-close')">×</div>
  </div>
</template>

<script>
import classDatas from './classData.json';
import ButtonComponent from '~/components/Atoms/AppButton';
import Dialog from '~/components/Molecules/AppDialog';

export default {
  filters: {
    listName(val) {
      if (val.length > 17) {
        return val.substring(0, 16) + '...';
      } else {
        return val;
      }
    },
  },
  components: {
    Dialog,
    ButtonComponent,
  },
  props: {
    targetClass: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      info: ['出席', '欠席', '遅刻'],
      classInfoJ: ['授業名', '教員名', '教室名'],
      classInfoE: ['title', 'teacher', 'room'],
      iconList: {
        bigtitle: 'mdi-subtitles',
        category: 'mdi-chart-bubble',
        code: 'mdi-format-list-numbered',
        title: 'mdi-format-title',
        teacher: 'mdi-human-male',
        grade: 'mdi-stairs',
        department: 'mdi-home-search',
        term: 'mdi-calendar',
        time: 'mdi-clock',
      },
      fullClassInfoJ: {
        bigtitle: '所属',
        category: '分類',
        code: '授業コード',
        title: '授業タイトル',
        teacher: '教員',
        grade: '対象学年',
        department: '対象学部(専攻)',
        term: '開講期',
        time: '時間割',
      },
      isEditMode: { title: false, teacher: false, room: false },
      isManualMode: false,
      editedInfo: { title: '', teacher: '', room: '' },
      chosenColor: '',
      infoCount: [0, 0, 0],
      page: 1,
      length: 0,
      filteredDatas: [],
      displayList: [],
      pageSize: 10,
      memo: '',
      keyword: '',
      pickClass: '',
      rules: [(value) => !!value || '入力は必須です.'],
      dialog: false,
      type: 'search',
      codeList: {},
      addButton: 'string',
      editButton: 'string',
      random: '',
      colorList: [
        '#F2B9A1',
        '#FF99CC',
        '#FF99FF',
        '#CCCCFF',
        '#66CCFF',
        '#66CC99',
        '#93dba6',
        '#FFFF99',
      ],
      colorSelected: false,
      defaultcolor: '#93dba6',
    };
  },
  computed: {
    dataList() {
      const preObj = {};
      const that = this;
      Object.keys(this.pickClass).forEach(function (key) {
        if (key !== 'lang' && key !== 'listTitle') {
          preObj[key] = that.pickClass[key];
        }
      });
      return preObj;
    },
  },
  watch: {
    keyword() {
      if (this.keyword.length === 0) {
        this.filteredDatas = [];
        return;
      }
      this.filteredDatas = [];

      for (const key in classDatas) {
        if (key.includes(this.keyword)) {
          this.filteredDatas.push(classDatas[key]);
        }
      }
      this.length = Math.ceil(this.filteredDatas.length / this.pageSize);
    },
    filteredDatas() {
      this.displayList = this.filteredDatas.slice(0, this.pageSize);
    },
  },
  mounted() {
    this.infoCount = [this.targetClass.attend, this.targetClass.absence, this.targetClass.late];
    this.memo = this.targetClass.memo;
    this.editedInfo.title = this.targetClass.title;
    this.editedInfo.teacher = this.targetClass.teacher;
    this.editedInfo.room = this.targetClass.room;
    this.chosenColor = this.targetClass.color;
  },
  methods: {
    dataPick(data) {
      this.pickClass = data;
    },
    cansel() {
      this.pickClass = '';
    },
    decision() {
      this.$emit('class-info-change', {
        classDatas: this.pickClass,
        color: this.defaultcolor,
      });
    },
    manualSetData() {
      this.random = Math.floor(Math.random() * 10000000000) + 1000000001;

      this.$emit('manual-datas', {
        code: this.random,
        classDatas: this.editedInfo,
        color: this.defaultcolor,
      });
    },
    classDelete() {
      this.dialog = true;
    },
    counter(index, num) {
      if (this.infoCount[index] === 0 && num === -1) {
        return null;
      }
      this.$set(this.infoCount, index, this.infoCount[index] + num);
    },
    setData() {
      this.$emit('input-datas', {
        info: this.infoCount,
        memo: this.memo,
        classData: this.editedInfo,
        color: this.chosenColor,
      });
    },
    deleteDecide(key) {
      this.dialog = false;
      if (key === 'Y') {
        this.$emit('class-delete');
      }
    },
    pageChange(pageNumber) {
      this.displayList = this.filteredDatas.slice(
        this.pageSize * (pageNumber - 1),
        this.pageSize * pageNumber
      );
    },
    editClassInfo(key) {
      this.isEditMode[key] = true;
    },
    saveEditClassInfo(key) {
      this.isEditMode[key] = false;
    },
    manualAdd() {
      this.type = 'manual';
    },
    manualClassInfo() {
      this.isManualMode = false;
    },
    saveManualClassInfo() {
      this.isManualMode = true;
    },
    colorSelect() {
      this.colorSelected = true;
    },
    colorChosed(val) {
      this.chosenColor = val;
      this.colorSelected = false;
    },
  },
};
</script>
<style scoped>
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 92vw;
  max-width: 70vh;
  min-height: 80vh;
  background: #fff;
  box-shadow: 1vmin 1vmin 3vmin rgba(0, 0, 0, 0.349);
  border-radius: 1vh;
  z-index: 6;
  padding: 4.4vh;
  box-sizing: border-box;
}
.close-btn {
  position: absolute;
  top: 2.2vh;
  right: 2.1vh;
  font-size: 1rem;
  color: #717171;
  cursor: pointer;
}
.counters-wrapper {
  display: flex;
  justify-content: space-between;
  text-align: center;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 2vh;
}
.counter-name {
  line-height: 2.6rem;
  font-size: 1.2rem;
  color: #555;
}
.counter {
  display: flex;
  justify-content: center;
}
.counter-left {
  position: relative;
  height: 2rem;
  width: 3rem;
  color: gray;
  line-height: 1.5rem;
  border: 0.2vh solid gray;
  border-radius: 3.1rem 0 0 3.1rem;
}
.counter-right {
  position: relative;
  left: -0.2vh;
  height: 2rem;
  width: 3rem;
  color: gray;
  line-height: 1.5rem;
  border: 0.2vh solid gray;
  border-radius: 0 3.1rem 3.1rem 0;
}
.counter-left:active,
.counter-right:active {
  background-color: gray;
  color: white;
}
</style>
