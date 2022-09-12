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
export { myTypeof }
