<template>
  <div class="question-wrap">
    <v-card>
      <v-card-title class="layout justify-center">パンプラージュについて</v-card-title>
    </v-card>
    <v-expansion-panels focusable class="panel">
      <v-expansion-panel v-for="list in pinplage" :key="list.title">
        <v-expansion-panel-header> {{ list.title }} </v-expansion-panel-header>
        <v-expansion-panel-content class="answer">
          {{ list.text }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card><v-card-title class="layout justify-center">投稿について</v-card-title></v-card>
    <v-expansion-panels focusable class="panel">
      <v-expansion-panel v-for="list in post" :key="list.title">
        <v-expansion-panel-header> {{ list.title }} </v-expansion-panel-header>
        <v-expansion-panel-content class="answer">
          {{ list.text }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card><v-card-title class="layout justify-center">ユーザについて</v-card-title></v-card>
    <v-expansion-panels focusable class="panel">
      <v-expansion-panel v-for="list in user" :key="list.title">
        <v-expansion-panel-header> {{ list.title }} </v-expansion-panel-header>
        <v-expansion-panel-content class="answer">
          {{ list.text }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card><v-card-title class="layout justify-center">時間割について</v-card-title></v-card>
    <v-expansion-panels focusable class="panel">
      <v-expansion-panel v-for="list in timetable" :key="list.title">
        <v-expansion-panel-header> {{ list.title }} </v-expansion-panel-header>
        <v-expansion-panel-content class="answer">
          {{ list.text }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  layout: 'protected',
  data() {
    return {
      pinplage: [
        {
          title: 'パンプラージュとは何ですか？',
          text: '静岡大学情報学部遊橋研究室が運営するモバイルキャンパスアプリです。',
        },
        {
          title: 'バグや不具合を見つけました。',
          text: 'お問い合わせから状況等を教えていただけますと幸いです。',
        },
      ],
      post: [
        { title: '投稿はどうやってしますか？', text: '投稿は画面下にある投稿ボタンからできます。' },
        {
          title: '部活動・サークルに関する投稿をしたいです。',
          text:
            'ただいま、部活動・サークルの投稿フォームを一般公開していません。情報の掲載や更新を希望する方はお問い合わせください。',
        },
        {
          title: '「いいね」した投稿はどこから確認できますか？',
          text: '「マイページ」の各項目から確認できます。',
        },
        {
          title: '「プラージュ」とは何ですか？',
          text:
            'パンプラージュ内で投稿アクションをする事で得ることが出来る、アプリ内通貨です。マイページの「利用する」ボタンからご利用いただけます。',
        },
      ],
      user: [
        {
          title: 'アイコンや名前の変更はどこからできますか？',
          text: '画面下にある「マイページ」から変更できます。',
        },
        {
          title: 'パスワードの変更はどこからできますか？',
          text: 'ログイン画面からパスワードを再設定からできます。',
        },
      ],
      timetable: [
        {
          title: '時間割の作成はどのようにしますか？',
          text:
            '該当する曜日と時間帯をクリックし、授業を選択してください。カラーを変更して自分だけのオリジナル時間割を作成してください。',
        },
      ],
    };
  },
};
</script>

<style scoped>
.question-wrap {
  cursor: default;
}
.panel {
  margin-bottom: 5%;
}
.v-card {
  background-color: #61d4b3;
  color: #fff;
}
.answer {
  cursor: default;
}
</style>
