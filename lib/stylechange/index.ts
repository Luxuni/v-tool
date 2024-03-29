import { App, DirectiveBinding } from 'vue';
import _ from 'lodash';
import { myDebounce } from '../tools/index';
type StyleChangeType = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};
let observer_box: MutationObserver | null = null;
const StyleChange = (app: App) => {
  app.directive('style-change', {
    mounted(el: HTMLElement, binding: DirectiveBinding<(Location: StyleChangeType) => any>) {
      const waitConfig = binding.arg?.split(':')[0];
      const func = myDebounce(() => binding.value(el.getBoundingClientRect()), waitConfig);
      const boxCallback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
        func();
      };
      const observer_box = new MutationObserver(boxCallback);
      observer_box.observe(el, {
        attributes: true,
        subtree: true,
        attributeFilter: ['style'],
        attributeOldValue: true,
      });
    },
    unmounted() {
      (observer_box as MutationObserver).disconnect();
      observer_box = null;
    },
  });
};
export default {
  install: StyleChange,
};
export type { StyleChangeType };
