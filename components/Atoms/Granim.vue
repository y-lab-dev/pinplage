<template>
  <div>
    <canvas id="granim-canvas" :style="[changeHeight, changeWidth, changeRound]"></canvas>
  </div>
</template>

<script>
import Granim from 'granim';

export default {
  name: 'Granim',
  props: {
    granimHeight: {
      required: false,
      type: String,
      default: '',
    },
    granimWidth: {
      required: false,
      type: String,
      default: '',
    },
    granimGradients: {
      required: true,
      type: Array,
      default: () => {},
    },
    granimRound: {
      required: false,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      granimObject: Object,
    };
  },
  computed: {
    changeHeight() {
      return { '--height': this.granimHeight };
    },
    changeWidth() {
      return { '--width': this.granimWidth };
    },
    changeRound() {
      return { '--border-radius': this.granimRound };
    },
  },
  mounted() {
    this.GObj = new Granim({
      element: '#granim-canvas',
      name: 'granim',
      opacity: [1, 1],
      states: {
        'default-state': {
          gradients: this.granimGradients,
          transitionSpeed: 10000,
          stretchMode: 'stretch-if-smappler',
        },
      },
    });
  },
};
</script>

<style scoped>
#granim-canvas {
  --width: 100vw;
  --height: 100vh;
  --border-radius: 0;

  width: var(--width);
  height: var(--height);
  border-radius: var(--border-radius);
}
</style>
