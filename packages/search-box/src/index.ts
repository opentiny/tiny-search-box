import { App } from 'vue';
import VueSearchBox from './index.vue';
import './index.less';

export * from './index.type';

VueSearchBox.install = function (app: App) {
  app.component(VueSearchBox.name, VueSearchBox);
};

export default VueSearchBox;
