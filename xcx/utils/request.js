var app = getApp();
  // var host = 'http://101.132.114.177:8090/renren-fast/';
   var host = 'http://r182s02546.51mypc.cn/renren-fast/';  
  // var host = 'https://www.yyf2gml.site/renren-fast/';
var urlApi = (url, method, data={}) => {
  let userInfo=wx.getStorageSync('userInfo');
  return new Promise((res, rej) => {
    if(userInfo&&userInfo.openid&&!data.openid){
      data.openid=userInfo.openid
    }
    wx.request({
      url: host + url,
      header: {
        "Content-Type": "application/json"
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
