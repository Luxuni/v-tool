import { App, DirectiveBinding } from 'vue'
import gsap from 'gsap'
import { myDebounce } from '../tools'
let animationFunc: Function | null = null
const Appearance = (app: App) => {
  app.directive('appearance', {
    mounted(el: HTMLElement, binding: DirectiveBinding<gsap.TweenVars | { from: gsap.TweenVars; to: gsap.TweenVars }>) {
      const isFrom = binding.arg?.split(':')[2]
      const animationName = binding.arg?.split(':')[0] ?? 'default'
      const tl = gsap.timeline()
      if (isFrom ==='fromTo') {
        gsap.registerEffect({
          name: animationName,
          effect: (targets: gsap.TweenTarget) => {
            return gsap.fromTo(targets, binding.value.from, binding.value.to)
          },
          extendTimeline: true,
        })
      } else {
        gsap.registerEffect({
          name: animationName,
          effect: (targets: gsap.TweenTarget) => {
            return gsap.from(targets, binding.value)
          },
          extendTimeline: true,
        })
      }
      const waitConfig = binding.arg?.split(':')[1]
      animationFunc = myDebounce(() => tl[animationName](el), waitConfig)
      animationFunc()
    },
    updated(el: HTMLElement, binding: DirectiveBinding<gsap.TweenVars | { from: gsap.TweenVars; to: gsap.TweenVars }>) {
      if (binding.modifiers.update) {
        animationFunc?.()
      }
    },
  })
}
export default {
  install: Appearance,
}
