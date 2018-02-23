'use strict'
// 间隔时间获取
/*
* 时间格式："2017-01-17T03:06:12.591Z"
*/

exports.getIntervalTime = (time) => {
  if(!time){
    return '未知';
  }
//  2014-10-07T13:05:32.158Z
  var now = new Date();
  var originDate = new Date(time);
  var timesec = (now.getTime() - originDate.getTime())/1000;
  var timeNow = timesec / 60 / 60 / 24 / 365
  if (timeNow >= 1) {
    return parseInt(timeNow) + '年前'
  } else if (timeNow * 365 / 30 >= 1) {
    return parseInt(timeNow * 365 / 30) + '个月前'
  } else if (timeNow * 365 >= 1) {
    return parseInt(timeNow * 365) + '天前'
  } else if (timeNow * 365 * 24 >= 1) {
    return parseInt(timeNow * 365 * 24) + '小时前'
  } else if (timeNow * 365 * 24 * 60 >= 1) {
    return parseInt(timesec / 60) + '分钟前'
  } else {
    return timesec + '秒前'
  }
}
