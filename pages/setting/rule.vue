<template>
  <v-container>
    <v-row>
      <v-col>
        <AppRule class="app-rule" />
      </v-col>
    </v-row>
  </v-container>
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
.app-rule {
  width: 80%;
}
</style>
