import _ from 'lodash'

function myTypeof(data: any) {
  var toString = Object.prototype.toString
  var dataType =
    data instanceof Element
      ? 'element'
      : toString
          .call(data)
          .replace(/\[object\s(.+)\]/, '$1')
          .toLowerCase()
  return dataType
}

const myDebounce = (func: (...arg: any) => any, waitConfig?: number | string | null) => {
  if (myTypeof(waitConfig) === 'string') {
    waitConfig = parseInt(waitConfig as string)
  }
  return _.debounce(func, waitConfig ? (waitConfig as number) : 300, { leading: true, trailing: false })
}

export { myTypeof, myDebounce }
