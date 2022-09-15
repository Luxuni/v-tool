import { App, DirectiveBinding } from 'vue'
import * as echarts from 'echarts'
import _ from 'lodash'
import { myDebounce } from '../tools'
let resizeObserver: ResizeObserver | null = null
const createEcharts = (el: HTMLElement, binding: DirectiveBinding<any>) => {
  if (echarts.getInstanceByDom(el)) {
    echarts.dispose(el)
  }
  const theme = binding.arg?.split(':')[0]
  const renderer = binding.arg?.split(':')[1]
  const myChart = echarts.init(el, theme, {
    renderer: renderer?.toString() === 'canvas' ? 'canvas' : 'svg',
  })
  const option: echarts.EChartsOption = binding.value
  option && myChart.setOption(option)
}
const EToolsCharts = (app: App) => {
  app.directive('etoolscharts', {
    mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
      const waitConfig = binding.arg?.split(':')[2]
      const func = myDebounce(() => {
        echarts.dispose(el)
        createEcharts(el, binding)
      }, waitConfig)
      resizeObserver = new ResizeObserver((entries) => {
        func()
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
  install: EToolsCharts,
}
