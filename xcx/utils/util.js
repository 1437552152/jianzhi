const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day,hour,minute,second].map(formatNumber).join('')
}

const formatTimeCopy = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return [year, month].map(formatNumber).join('')
 }

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const timestampToTime=(timestamp)=> {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  // var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  // var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  // var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  // return Y + M + D + h + m + s;
  return Y + M + D;
}

const jsEvent = (e)=>{
  const { type } = e.currentTarget.dataset;
  let userInfo=wx.getStorageSync("userInfo");
  var that = this;
  wx.navigateTo({
    url: e.currentTarget.dataset.url
  })



  // wx.getSetting({
  //   success: function (respon) {
  //     if (respon.authSetting['scope.userInfo'] && userInfo) {
  //       if (type == 2) {
  //         wx.switchTab({
  //           url: e.currentTarget.dataset.url
  //         })    
  //       } else {
  //         wx.navigateTo({
  //           url: e.currentTarget.dataset.url
  //         })
  //       }
  //     } else {
  //       if (type == 2) {
  //         wx.navigateTo({
  //           url:`/pages/boots/boots?path=${e.currentTarget.dataset.url}&type=2`
  //         })  

  //       }else{
  //         wx.navigateTo({
  //           url: `/pages/boots/boots?path=${e.currentTarget.dataset.url}&type=1`,
  //         })
  //       } 
  //     }
  //   },
  //   fail: function () {
  //     if (type == 2) {
  //       wx.navigateTo({
  //         url:`/pages/boots/boots?path=${e.currentTarget.dataset.url}&type=2`
  //       })  

  //     }else{
  //       wx.navigateTo({
  //         url: `/pages/boots/boots?path=${e.currentTarget.dataset.url}&type=1`,
  //       })
  //     } 
  //   }
  // })
} 



module.exports = {
  formatTime: formatTime,
  timestampToTime: timestampToTime,
  jsEvent: jsEvent,
  formatTimeCopy:formatTimeCopy
}
