import { App } from 'vue'
import StyleChange from './stylechange/index'
import Appearance from './appearance/index'
import EToolsCharts from './etoolscharts/index'
import WH from './wh/index'
import Three from './three/index'
const Tools = [StyleChange, Appearance, EToolsCharts, WH, Three]
const install = (app: App) => {
  Tools.forEach((item) => {
    app.use(item)
  })
  return app
}
export { Tools }
export default {
  install,
}
export type { StyleChangeType } from './stylechange/index'
export type { EChartsOption } from 'echarts'
