var app = getApp();
var host = 'http://101.132.114.177:8090/renren-fast/';
//  var host = 'http://r182s02546.51mypc.cn/renren-fast/';

var urlApi = (url, method, data={}) => {
  return new Promise((res, rej) => {
    wx.request({
      url: host + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      method: method,
      success: ret => {
        if(ret.data.code===1001){
          wx.navigateTo({
            url: '/pages/h_login/login',
          })
        }else{
          res(ret);
        }   
      },
      fail: rej
    })
  })
}

module.exports = {
  urlApi:urlApi,
  host
}
