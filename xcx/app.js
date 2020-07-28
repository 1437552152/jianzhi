//app.js
App({
  onLaunch: function() {
  },
  util: require("./utils/request.js"),
  WxParse: require("./wxParse/wxParse.js"),
  publicColor:{
    mainColor:'#ff660e',
    color:'#fff'
  },
  globalData: {
    userInfo: null
  }
})