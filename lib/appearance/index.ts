import { App, DirectiveBinding } from 'vue'
import gsap from 'gsap'
import { myDebounce } from '../tools'
type AppearanceConfig = {
  from: gsap.TweenVars
  to: gsap.TweenVars
  way: string
  name?: string
  wait: number
  update: boolean
}
let animationFunc: Function | null = null
const Appearance = (app: App) => {
  app.directive('appearance', {
    mounted(el: HTMLElement, binding: DirectiveBinding<gsap.TweenVars | AppearanceConfig>) {
      const isFrom = binding.value?.way ?? 'from'
      const name = binding.value?.name ?? 'default'
      const tl = gsap.timeline()
      if (isFrom === 'fromTo') {
        gsap.registerEffect({
          name: name,
          effect: (targets: gsap.TweenTarget) => {
            return gsap.fromTo(targets, binding.value.from, binding.value.to)
          },
          extendTimeline: true,
        })
      } else {
        gsap.registerEffect({
          name: name,
          effect: (targets: gsap.TweenTarget) => {
            return gsap.from(targets, binding.value)
          },
          extendTimeline: true,
        })
      }
      const wait = binding.value?.wait ?? 300
      animationFunc = myDebounce(() => tl[name](el), wait)
      animationFunc?.()
    },
    updated(el: HTMLElement, binding: DirectiveBinding<gsap.TweenVars | AppearanceConfig>) {
      if (binding.value?.update) {
        animationFunc?.()
      }
    },
  })
}
export default {
  install: Appearance,
}
