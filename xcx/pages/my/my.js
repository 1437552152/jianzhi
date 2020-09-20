// pages/my/my.js
var {
  jsEvent
} = require("../../utils/util.js");
var {
  urlApi
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    UserResume:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  onJsEvent:function(el){
    let e= {
      currentTarget:{
        dataset:{
          type:el.currentTarget.dataset.type,
          url:el.currentTarget.dataset.url
        }
      }
     }
      jsEvent(e);

  },
  goBaoList:function(el){
    const {userInfo} =this.data;
    if(!userInfo){  
     let e= {
      currentTarget:{
        dataset:{
          type:1,
          url:el.currentTarget.dataset.url,
          id:el.currentTarget.dataset.id
        }
      }
     }
      jsEvent(e);
    }else{
      wx.navigateTo({
        url:`${el.currentTarget.dataset.url}?id=${el.currentTarget.dataset.id}` ,
      })
    }
  },
  goJianli:function(el){
    const {userInfo} =this.data;
    if(!userInfo){  
     let e= {
      currentTarget:{
        dataset:{
          type:1,
          url:el.currentTarget.dataset.url,
          id:''
        }
      }
     }
      jsEvent(e);
    }else{
      wx.navigateTo({
        url:`${el.currentTarget.dataset.url}` ,
      })
    }
  },
  goWithdrawal:function(){
    wx.navigateTo({
      url: '../Withdrawal/Withdrawal',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.setData({userInfo:wx.getStorageSync('userInfo')});
      const {userInfo}=this.data;
      if(userInfo){
        this.getResume();
      }
  },
  getResume:function(){
    var that = this;
    var data = {};
    urlApi('app/mycv/info', "get", data).then((res) => {
      console.log(res);
      if (res.data.code == 0) {
          wx.setStorageSync('UserResume', res.data.myCv);
          that.setData({
            UserResume:res.data.myCv
          })
      }
    })
  }
})