import { App } from 'vue'
import StyleChange from './stylechange/index'
import Appearance from './appearance/index'
const Tools = [StyleChange, Appearance]
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
