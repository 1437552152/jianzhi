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
    UserResume:null,
    baomingInfo:{},
    yongjinInfo:{},
    flag:0,
    flag1:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  getStatus:function(){
    const that=this;
    urlApi('app/index/xgzt', "get", {}).then((res) => {
      if (res.data.code == 0) {
          that.setData({
            flag:res.data.re,
            flag1:res.data.re
          })
      }
    })
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
    let txStatus=wx.getStorageSync('txStatus')
    if(txStatus==1){
      wx.navigateTo({
        url: '../Withdrawal/Withdrawal',
      })
    }else{
      wx.navigateTo({
        url: '../xieYi/xieYi',
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.setData({userInfo:wx.getStorageSync('userInfo')});
      this.getStatus();
      const {userInfo}=this.data;
      if(userInfo){
        this.getResume();
        // 去请求用户录用情况
        this.getBaoming();
        //得到佣金情况
        this.getYongjin();
      }
  },
  getBaoming:function(){
    var that = this;
    var data = {};
    urlApi('my/myjob/myjobnum', "get", data).then((res) => {
      console.log(res);
      if (res.data.code == 0) {
          that.setData({
            baomingInfo:res.data.jonnum
          })
      }
    })


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
  },
  getYongjin:function(){
    var that = this;
    var data = {};
    urlApi('app/myshouyi/getMyShouYi', "get", data).then((res) => {
      console.log(res);
      if (res.data.code == 0) {
          that.setData({
            yongjinInfo:res.data.map
          })
      }
    })
  },
  goJnagli:function(){
    wx.navigateTo({
      url: '/pages/jiangli/jiangli',
    })
  },
  goLeiji:function(){
    wx.navigateTo({
      url: '/pages/Leiji/Leiji',
    })
  }
})