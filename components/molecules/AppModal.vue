<template>
  <div class="text-center">
    <v-dialog v-model="modalToggle" persistent width="400">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ modalTitle }}
        </v-card-title>

        <v-card-text style="margin-top: 20px; padding: 0 20px 20px; text-align: center">
          {{ modalText }}
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="#61d4b3" text @click="cancelDelete()">
            {{ modalCancel }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="changeDialogValue()">
            {{ modalButton }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    modalTitle: {
      type: String,
      required: true,
    },
    modalText: {
      type: String,
      required: true,
    },
    modalButton: {
      type: String,
      required: true,
    },
    modalCancel: {
      type: String,
      required: true,
    },
    modalToggle: {
      type: Boolean,
      required: true,
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
