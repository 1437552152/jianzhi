// pages/feedback/feedback.js
var {
  urlApi
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',//文本内容
    maxlength: 1000,
    focus: true,
    contactEmail:''
  },
  //键盘输入事件
  input: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  userEmail:function (e) {
    this.setData({
      contactEmail: e.detail.value
    })
  },
  onShow:function(){
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  send: function() {
    let obj = {}
    obj.adviceContent = this.data.content;
    obj.contactEmail = this.data.contactEmail;

    var emreg=/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
     if(emreg.test(this.data.contactEmail)==false){
       wx.showToast({
         title: '您输入的邮箱格式不正确',
         icon:'none'
       })
       return;
     }
     obj.adviceType = 0;
    // obj.adviceType = wx.getStorageSync('userInfo').username||wx.getStorageSync('userInfo').nickName||'';
    urlApi("app/index/save","post", obj).then((res)=>{
      wx.showToast({
        title:"提交成功",
        icon:'none'
      });
      wx.switchTab({
        url: '/pages/my/my',
      })      
    })
  }
})