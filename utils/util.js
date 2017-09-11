function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//判断对象是否为空
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
  // 本身为空直接返回true
  if (obj == null) return true;

  // 然后可以根据长度判断，在低版本的ie浏览器中无法这样判断。
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  //最后通过属性长度判断。
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

module.exports = {
  formatTime: formatTime,
  isEmpty:isEmpty
}
