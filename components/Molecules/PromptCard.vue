<template>
  <div>
    <v-container>
      <v-card @click="pushToLink(link)">
        <v-row justify="center" class="my-3 py-3">
          <v-col cols="5">
            <v-img height="100%" :src="image"></v-img>
          </v-col>
          <v-col cols="6" align-self="center" class="pa-0 pr-5">
            <v-row>
              <v-col cols="12" class="pa-0">
                <p class="catchphrase">{{ message }}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      required: false,
      default: '',
    },
    image: {
      required: true,
      type: String,
    },
    message: {
      required: true,
      type: String,
    },
    timelineTab: {
      required: false,
      type: Number,
      default: null,
    },
  },
  methods: {
    pushToLink(link) {
      if (this.timelineTab !== null) {
        this.$store.commit('timeline/pauseTab', this.timelineTab);
        this.$router.push({ name: link });
      } else {
        this.$router.push({ name: link });
      }
    },
  },
};
</script>

<style scoped>
.catchphrase {
  text-align: center;
  margin-bottom: 0;
  font-size: 0.8rem;
}
</style>
