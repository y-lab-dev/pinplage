<template>
  <div class="text-center">
    <v-dialog v-model="dialogToggle" persistent width="400">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ dialogTitle }}
        </v-card-title>

        <v-card-text style="margin-top: 20px; padding: 0 20px 20px; text-align: center">
          {{ dialogText }}
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="#61d4b3" text @click="cancelDelete()">
            {{ dialogCancel }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="changeDialogValue()">
            {{ dialogButton }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogTitle: {
      type: String,
      required: true,
    },
    dialogText: {
      type: String,
      required: true,
    },
    dialogButton: {
      type: String,
      required: true,
    },
    dialogCancel: {
      type: String,
      required: true,
    },
    dialogToggle: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    changeDialogValue() {
      this.$emit('changeValue');
    },
    cancelDelete() {
      this.$emit('changeSelect');
    },
  },
};
</script>
