<template>
  <div>
    <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
      <v-timeline-item
        v-for="(item, i) in items"
        :key="i"
        :color="item.color"
        :icon="item.icon"
        fill-dot
      >
        <v-card :color="item.color" dark width="300">
          <v-card-title class="pa-1 pl-4">
            <p style="margin-bottom: 0; font-size: 1rem">{{ item.point }}プラージュ獲得</p>
          </v-card-title>
          <v-card-text class="white text--primary">
            <p style="margin-bottom: 0">{{ item.explain }}</p>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        color: 'red lighten-2',
        point: 15,
        explain: 'イベント投稿のため',
      },
      {
        color: 'purple darken-1',
        point: 15,
        explain: '知恵袋回答のため',
      },
      {
        color: 'green lighten-1',
        point: 20,
        explain: 'ベストアンサーに選ばれたため',
      },
      {
        color: 'indigo',
        point: 10,
        explain: 'アルバイト投稿のため',
      },
    ],
  }),
};
</script>
