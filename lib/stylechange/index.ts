import { App, DirectiveBinding } from 'vue'
import _ from 'lodash'
type StyleChangeType = {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}
const StyleChange = (app: App, options: any) => {
  app.directive('style-change', {
    mounted(el: HTMLElement, binding: DirectiveBinding<(Location: StyleChangeType) => any>) {
      const getWaitTime = (): null | number => {
        let waitTime = null
        if (binding.arg === 'wait') {
          for (const key in binding.modifiers) {
            if (Object.prototype.hasOwnProperty.call(binding.modifiers, key)) {
              waitTime = parseInt(key)
            }
          }
          if (waitTime?.toString() === 'NaN') {
            waitTime = null
            throw console.error('waitTime is not a number')
          }
        }
        return waitTime
      }
      const waitConfig = binding.arg === 'wait' ? getWaitTime() : null
      const func = _.debounce(
        () => {
          binding.value(el.getBoundingClientRect())
        },
        waitConfig ? waitConfig : 300,
        { leading: true, trailing: false },
      )
      const boxCallback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
        func()
      }
      const observer_box = new MutationObserver(boxCallback)
      observer_box.observe(el, {
        attributes: true,
        subtree: true,
        attributeFilter: ['style'],
        attributeOldValue: true,
      })
    },
  })
}
export default {
  install: StyleChange,
}
export type { StyleChangeType }
