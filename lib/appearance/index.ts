import { App, DirectiveBinding } from 'vue'
import gsap from 'gsap'
const Appearance = (app: App) => {
  app.directive('appearance', {
    mounted(el: HTMLElement, binding: DirectiveBinding<gsap.TweenVars | { from: gsap.TweenVars; to: gsap.TweenVars }>) {
      const tl = gsap.timeline()
      if (binding.arg === 'fromTo') {
        gsap.registerEffect({
          name: 'custom',
          effect: (targets: gsap.TweenTarget) => {
            return gsap.fromTo(targets, binding.value.from, binding.value.to)
          },
          extendTimeline: true,
        })
      } else {
        gsap.registerEffect({
          name: 'custom',
          effect: (targets: gsap.TweenTarget) => {
            return gsap.from(targets, binding.value)
          },
          extendTimeline: true,
        })
      }
      tl.custom(el)
    },
    updated(el: HTMLElement, binding: DirectiveBinding<gsap.TweenVars | { from: gsap.TweenVars; to: gsap.TweenVars }>) {
      const tl = gsap.timeline()
      if (binding.modifiers.update) {
        tl.custom(el)
      }
    },
  })
}
export default {
  install: Appearance,
}
