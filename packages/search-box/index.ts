import { App } from 'vue';
import VueSearchBox from './src/index.vue';

export * from './src/index.type';

VueSearchBox.install = function (app: App) {
  app.component(VueSearchBox.name, VueSearchBox);
};

export default VueSearchBox;
