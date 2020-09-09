// pages/boots/boots.js
var t = getApp();
var {
  urlApi
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    type:1,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      path: options.path,
      type:options.type||1,
      id:options.id||''
    })
  },

  onGotUserInfo(e) {
    var that = this
    if (e.detail.errMsg ==='getUserInfo:ok'){
      wx.login({
        success: function (a) {
          wx.getUserInfo({
            success: function (e) {
              let {gender,city,avatarUrl,nickName}= JSON.parse(e.rawData);
              let params={};
              params['sex'] =gender?'男':'女';
              params['country'] =city;
              params['openid'] ='';
              params['avatarurl'] =avatarUrl;
              params['nickname'] =nickName;
              params['jscode'] = a.code;
              urlApi("app/wxlogin","post",params).then((res)=>{
                if(res.data.code==0){
                  wx.setStorageSync("userInfo", res.data.resultmap);
                  if(that.data.type==1){
                    wx.navigateTo({
                      url:`${that.data.id?that.data.path+'?id='+that.data.id:that.data.path}`,
                    })
                  }else{
                   wx.switchTab({
                     url: that.data.path
                   }) 
                  }
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon:'none'
                  })
                }            
              })
            }
          })
        }
      });
    }else{
      
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
        success:function(res){
          if (res.confirm){
            wx.openSetting({
              success: (res) => {
                if (res.authSetting["scope.userInfo"]){如果用户重新同意了授权登录             
                  wx.login({
                    success: function (a) {
                      wx.getUserInfo({
                        success: function (e) {
                          let {gender,city,avatarUrl,nickName}= JSON.parse(e.rawData);
                          let params={};
                          params['sex'] =gender;
                          params['country'] =city;
                          params['openid'] ='';
                          params['avatarurl'] =avatarUrl;
                          params['nickname'] =nickName;
                          params['jscode'] = a.code;
                          urlApi("app/wxlogin","post",params).then((res)=>{
                            if(res.data.code){
                              // wx.setStorageSync("userInfo", res.data.data);
                              // wx.setStorageSync("tokenn",res.data.data.token);
                              if(that.data.type==1){
                                wx.navigateTo({
                                  url:`${that.data.id?that.data.path+'?id='+that.data.id:that.data.path}`,
                                })
                              }else{
                               wx.switchTab({
                                 url: that.data.path
                               }) 
                              }
                            }else{
                              wx.showToast({
                                title: res.data.msg,
                                icon:'none'
                              })
                            }            
                          })
                        }
                      })
                    }
                  });
                }
              },fail:function(res){
               
              }
            }) 
          }}
        })
    }
  },
  refuse: function() {
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
})