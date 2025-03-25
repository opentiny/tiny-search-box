import { App } from 'vue';
import TinySearchBox from './index.vue';
import './index.less';

export * from './index.type';

TinySearchBox.install = function (app: App) {
  app.component(TinySearchBox.name, TinySearchBox);
};

export default TinySearchBox;
