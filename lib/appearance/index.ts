import gsap from 'gsap';
import { App, Directive } from 'vue';
import { myDebounce } from '../tools';
export type AppearanceConfig = {
  from: gsap.TweenVars;
  to?: gsap.TweenVars;
  way?: string;
  name?: string;
  wait?: number;
  update?: boolean;
};
let animationFunc: Function | null = null;
const Directive: Directive<HTMLElement, gsap.TweenVars & AppearanceConfig> = {
  mounted(el, binding) {
    const isFrom = binding.value?.way ?? 'from';
    const name = binding.value?.name ?? 'default';
    const tl = gsap.timeline();
    if (isFrom === 'fromTo') {
      gsap.registerEffect({
        name: name,
        effect: (targets: gsap.TweenTarget) => {
          return gsap.fromTo(targets, binding.value.from, binding.value.to as gsap.TweenVars);
        },
        extendTimeline: true,
      });
    } else {
      gsap.registerEffect({
        name: name,
        effect: (targets: gsap.TweenTarget) => {
          return gsap.from(targets, binding.value);
        },
        extendTimeline: true,
      });
    }
    const wait = binding.value?.wait ?? 300;
    animationFunc = myDebounce(() => tl[name](el), wait);
    animationFunc?.();
  },
  updated(el, binding) {
    if (binding.value?.update) {
      animationFunc?.();
    }
  },
};
const Appearance = (app: App<Element>) => {
  app.directive('appearance', Directive);
};
export default {
  install: Appearance,
};
