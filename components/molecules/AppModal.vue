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
          <v-spacer></v-spacer>
          <v-btn color="#61d4b3" text @click="changeModalValue()">
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
    modalToggle: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    changeModalValue() {
      this.$emit('changeValue');
    },
  },
};
</script>
