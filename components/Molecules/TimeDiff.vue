<template>
  <p class="time-diff">{{ TimeDiff }}</p>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
require('dayjs/locale/ja');
export default {
  props: {
    previousDate: {
      required: true,
      type: Date,
    },
  },
  computed: {
    TimeDiff() {
      const now = dayjs().locale('ja');
      const postedDate = dayjs(this.previousDate);
      const compareDate = postedDate.add(1, 'w');
      if (now.isAfter(compareDate) || now.isSame(compareDate)) {
        return postedDate.format('YYYY/MM/DD');
      } else {
        const diff = dayjs(this.previousDate).locale('ja').from(now);
        return diff;
      }
    },
  },
};
</script>
<style scoped>
.time-diff {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 0;
}
</style>
