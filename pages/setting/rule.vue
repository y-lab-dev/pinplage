<template>
  <div class="rule-wrap">
    <v-container>
      <v-row>
        <v-col>
          <AppRule class="app-rule" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AppRule from '~/components/Molecules/AppRule';
export default {
  layout: 'onlyBack',
  components: {
    AppRule,
  },
};
</script>
<style>
.rule-wrap {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
.app-rule {
  width: 80%;
}
</style>
