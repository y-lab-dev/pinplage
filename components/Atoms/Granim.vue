<template>
  <div>
    <canvas
      :id="granimCanvas"
      class="test"
      :style="[changeHeight, changeWidth, changeRound]"
    ></canvas>
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
    granimTheme: {
      required: false,
      type: String,
      default: '初夏',
    },
    granimRound: {
      required: false,
      type: String,
      default: '',
    },
    granimCanvas: {
      required: false,
      type: String,
      default: 'granim-canvas',
    },
    granimSpeed: {
      required: false,
      type: Number,
      default: 10000,
    },
  },
  data() {
    return {
      granimObject: Object,
      granimGradients: [],
      gradients: [
        {
          name: '基本',
          array: [
            ['#61d4b3', '#FFFB7D'],
            ['#FFFB7D', '#61d4b3'],
          ],
        },
        {
          name: '初夏',
          array: [
            ['#85FFBD', '#FFFB7D'],
            ['#FFFB7D', '#85FFBD'],
          ],
        },
        {
          name: '秋風',
          array: [
            ['#F71810', '#FCCE22'],
            ['#F4DD2E', '#F3EC0E'],
          ],
        },
        {
          name: '夕焼け',
          array: [
            ['#fa709a', '#fee140'],
            ['#fee140', '#fa709a'],
          ],
        },
        {
          name: '海風',
          array: [
            ['#4facfe', '#00f2fe'],
            ['#00f2fe', '#66a6ff'],
          ],
        },
        {
          name: '妖艶',
          array: [
            ['#c471f5', '#fa71cd'],
            ['#0250c5', '#d43f8d'],
          ],
        },
        {
          name: '深海',
          array: [
            ['#30cfd0', '#330867'],
            ['#5337df', '#30cfd0'],
          ],
        },
      ],
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
  created() {
    const targetList = this.gradients.filter((theme) => {
      return theme.name === this.granimTheme;
    });
    this.granimGradients = targetList[0].array;
  },
  mounted() {
    this.GObj = new Granim({
      element: `#${this.granimCanvas}`,
      name: 'granim',
      opacity: [1, 1],
      states: {
        'default-state': {
          gradients: this.granimGradients,
          transitionSpeed: this.granimSpeed,
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

.test {
  --width: 100%;
  --height: 100%;
  --border-radius: 0;

  width: var(--width);
  height: var(--height);
  border-radius: var(--border-radius);
}
</style>
