<template>
  <div>
    <template>
      <v-card-actions class="justify-space-between">
        <v-btn text @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-item-group v-model="onboarding" class="text-center" mandatory>
          <v-item v-for="n in length" :key="`btn-${n}`" v-slot:default="{ active, toggle }">
            <v-btn :input-value="active" icon @click="toggle">
              <v-icon>mdi-record</v-icon>
            </v-btn>
          </v-item>
        </v-item-group>
        <v-btn text @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>

      <v-container style="padding: 5px 2px 0 2px">
        <v-window v-model="onboarding">
          <v-window-item v-for="n in length" :key="`card-${n}`">
            <v-card>
              <table>
                <tr class="weeks">
                  <th>{{ term }}</th>
                  <th>月</th>
                  <th>火</th>
                  <th>水</th>
                  <th>木</th>
                  <th>金</th>
                </tr>
                <tr v-for="(data, index) in timeTable[term]" :key="index">
                  <th valign="top">
                    {{ index + 1 }}限
                    <br />
                    <br />
                    <span class="time">
                      {{ classTime[index].startTime }}
                      <br />~
                      <br />
                      {{ classTime[index].endTime }}
                    </span>
                  </th>
                  <td
                    v-for="day in weekNames"
                    :key="day"
                    :style="{ background: data[day].color }"
                    @click="detail(data[day], index, day)"
                  >
                    <span class="classTitle">
                      {{ data[day].title | className }}
                    </span>
                    <br />
                    <br />
                    <span v-if="data[day].room" class="classRoom">
                      {{ data[day].room | classRoom }}
                    </span>
                    <br />
                    <span class="classTeacher">
                      {{ data[day].teacher | classTeacher }}
                    </span>
                  </td>
                </tr>
              </table>
            </v-card>
          </v-window-item>
        </v-window>
      </v-container>
      <transition name="bound">
        <class-detail
          v-if="isDetail"
          :target-class="targetClass"
          @detail-close="close"
          @class-info-change="change"
          @input-datas="inputs"
          @class-delete="classDelete"
          @manual-datas="manual"
        ></class-detail>
      </transition>
    </template>
  </div>
</template>

<script>
import classDetail from './classDetail';
export default {
  layout: 'protected',
  components: {
    classDetail,
  },
  filters: {
    className(val) {
      if (val.length > 8) {
        return val.substring(0, 7) + '…';
      } else {
        return val;
      }
    },
    classRoom(val) {
      if (val.length > 5) {
        return val.substring(0, 4) + '…';
      } else {
        return val;
      }
    },
    classTeacher(val) {
      if (val.length > 5) {
        return val.substring(0, 4) + '…';
      } else {
        return val;
      }
    },
  },
  data: () => ({
    term: '前期',
    title: '時間割',
    length: 2,
    onboarding: 0,
    weekNames: ['mo', 'tu', 'we', 'th', 'fr'],
    targetClass: {},
    targetTime: '',
    targetDay: '',
    classTime: [
      { startTime: '08:40', endTime: '10:10' },
      { startTime: '10:20', endTime: '11:50' },
      { startTime: '12:45', endTime: '14:15' },
      { startTime: '14:25', endTime: '15:55' },
      { startTime: '16:05', endTime: '17:35' },
    ],
    isDetail: false,
    timeTable: {},
    color: '',
  }),
  watch: {
    onboarding() {
      this.onboarding === 0 ? (this.term = '前期') : (this.term = '後期');
    },
    timeTable() {
      localStorage.setItem('timeTable', JSON.stringify(this.timeTable));
    },
  },
  created() {
    // 時間割の元データが無い時に空の配列を定義
    if (process.client) {
      if (!localStorage.getItem('timeTable')) {
        ['前期', '後期'].forEach((term) => {
          this.timeTable[term] = [];
          for (let i = 0; i < 5; i++) {
            this.timeTable[term][i] = {};
            this.weekNames.forEach((point) => {
              const obje = {
                code: '',
                title: '',
                room: '',
                teacher: '',
                color: '',
                late: 0,
                absence: 0,
                attend: 0,
                memo: '',
                edited: false,
                time: '',
              };
              this.timeTable[term][i][point] = obje;
            });
          }
        });
        localStorage.setItem('timeTable', JSON.stringify(this.timeTable));
      } else {
        this.timeTable = JSON.parse(localStorage.getItem('timeTable'));
        this.$store.state.zikanwariStore = this.timeTable;
      }
    }
  },
  methods: {
    next() {
      this.onboarding = this.onboarding + 1 === this.length ? 0 : this.onboarding + 1;
    },
    prev() {
      this.onboarding = this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1;
    },
    detail(target, targetTime, targetDay) {
      this.targetClass = target;
      this.targetTime = targetTime;
      this.targetDay = targetDay;
      this.isDetail = true;
    },
    close() {
      this.isDetail = false;
    },
    change(value) {
      this.timeTable[this.term][this.targetTime][this.targetDay].code = value.classDatas.code;
      this.timeTable[this.term][this.targetTime][this.targetDay].title = value.classDatas.title;
      this.timeTable[this.term][this.targetTime][this.targetDay].room = value.classDatas.room;
      this.timeTable[this.term][this.targetTime][this.targetDay].teacher = value.classDatas.teacher;
      this.timeTable[this.term][this.targetTime][this.targetDay].color = value.color;
      this.timeTable[this.term][this.targetTime][this.targetDay].edited = true;
      this.isDetail = false;
      localStorage.setItem('timeTable', JSON.stringify(this.timeTable));
    },
    manual(value) {
      this.timeTable[this.term][this.targetTime][this.targetDay].code = value.code;
      this.timeTable[this.term][this.targetTime][this.targetDay].title = value.classDatas.title;
      this.timeTable[this.term][this.targetTime][this.targetDay].room = value.classDatas.room;
      this.timeTable[this.term][this.targetTime][this.targetDay].teacher = value.classDatas.teacher;
      this.timeTable[this.term][this.targetTime][this.targetDay].color = value.color;
      this.timeTable[this.term][this.targetTime][this.targetDay].edited = true;
      this.isDetail = false;
      localStorage.setItem('timeTable', JSON.stringify(this.timeTable));
    },
    classDelete() {
      this.timeTable[this.term][this.targetTime][this.targetDay].code = '';
      this.timeTable[this.term][this.targetTime][this.targetDay].title = '';
      this.timeTable[this.term][this.targetTime][this.targetDay].room = '';
      this.timeTable[this.term][this.targetTime][this.targetDay].teacher = '';
      this.timeTable[this.term][this.targetTime][this.targetDay].color = '';
      this.timeTable[this.term][this.targetTime][this.targetDay].attend = 0;
      this.timeTable[this.term][this.targetTime][this.targetDay].absence = 0;
      this.timeTable[this.term][this.targetTime][this.targetDay].late = 0;
      this.timeTable[this.term][this.targetTime][this.targetDay].memo = '';
      this.timeTable[this.term][this.targetTime][this.targetDay].edited = false;
      this.isDetail = false;
      localStorage.setItem('timeTable', JSON.stringify(this.timeTable));
    },
    inputs(obj) {
      this.timeTable[this.term][this.targetTime][this.targetDay].attend = obj.info[0];
      this.timeTable[this.term][this.targetTime][this.targetDay].absence = obj.info[1];
      this.timeTable[this.term][this.targetTime][this.targetDay].late = obj.info[2];
      this.timeTable[this.term][this.targetTime][this.targetDay].memo = obj.memo;
      this.timeTable[this.term][this.targetTime][this.targetDay].title = obj.classData.title;
      this.timeTable[this.term][this.targetTime][this.targetDay].teacher = obj.classData.teacher;
      this.timeTable[this.term][this.targetTime][this.targetDay].room = obj.classData.room;
      this.timeTable[this.term][this.targetTime][this.targetDay].color = obj.color;
      this.isDetail = false;
      localStorage.setItem('timeTable', JSON.stringify(this.timeTable));
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 5px;
  width: 100%;
  line-height: 1.1;
  table-layout: fixed;
}
table th,
table td {
  border-radius: 3px;
  padding: 1.3vh 0;
  height: 12vh;
}
table th {
  background-color: #777;
  color: white;
  border: solid 1px #000;
  font-size: 0.6rem;
}
table td {
  background-color: #e8e7e1;
  border: solid 1px #000;
  font-size: 10%;
  text-align: center;
}
.weeks th {
  font-size: 1rem;
  height: 3vh;
  padding: 0 0;
  line-height: 1.5;
}
.time {
  font-size: 0.8rem;
}
.classTitle {
  font-size: 0.7rem;
}
.classRoom {
  font-size: 0.4rem;
}
.classTeacher {
  font-size: 0.4rem;
}
.bound-enter-active,
.bound-leave-active {
  transition: all 0.1s ease-in;
}
.bound-enter,
.bound-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
