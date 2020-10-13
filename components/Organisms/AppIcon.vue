<template>
  <div class="user-icon-back-back">
    <div class="user-icon-back">
      <v-avatar color="white" :size="iconSize">
        <v-img :src="icon"></v-img>
      </v-avatar>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    iconSize: {
      type: String,
      required: false,
      default: '80px',
    },
  },
  computed: {
    ...mapGetters({
      icon: 'user/icon',
    }),
  },
};
</script>

<style scoped>
.user-icon-back {
  display: flex;
  width: 86px;
  height: 86px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
}
.user-icon-back-back {
  display: flex;
  width: 94px;
  height: 94px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: linear-gradient(45deg, #2cc45e, #e6f938);
}
</style>
