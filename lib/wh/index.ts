import { App, DirectiveBinding } from 'vue'
import { myDebounce } from '../tools'
let resizeObserver: ResizeObserver | null = null
const WH = (app: App) => {
  app.directive('wh', {
    mounted(el: HTMLElement, binding: DirectiveBinding<(...args: ResizeObserverEntry[]) => any>) {
      const waitConfig = binding.arg?.split(':')[0]
      const func = myDebounce((entries: ResizeObserverEntry) => {
        binding.value(entries)
      }, waitConfig)
      const resizeObserver = new ResizeObserver((entries) => {
        func(entries)
      })
      resizeObserver.observe(el)
    },
    unmounted(el: HTMLElement) {
      ;(resizeObserver as ResizeObserver).disconnect()
      resizeObserver = null
    },
  })
}
export default {
  install: WH,
}
