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
    flag: false,
    userInfo: null,
    userDetail: '',//用户详情
    tokenn: '',
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid=wx.getStorageSync('openid');
    if(!openid){  
     let e= {
      currentTarget:{
        dataset:{
          type:2,
          url:"/pages/my/my",
          id:''
        }
      }
     }
      jsEvent(e);
    } 
  },
  goBaoList:function(e){
    wx.navigateTo({
      url: '../myexercise/myexercise?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goJianli:function(){
     wx.navigateTo({
       url: '../MyResume/MyResume',
     })
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
    let tokenn = wx.getStorageSync("tokenn");
    this.setData({
      tokenn: tokenn
    })
    // 清除地址信息缓存
    wx.removeStorageSync("addressInfo");
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    if (!userInfo) {
      this.setData({ flag: false })
    } else {
      this.setData({ userInfo: userInfo,flag: true})
    }
    this.queryUserDetail();
  },

  //查询用户详情
  queryUserDetail: function () {
    var that = this;
    var data = {};
    urlApi('user/Profile/index', "post", data).then((res) => {
      console.log(res);
      if (res.data.code == 1) {
        res.data.data.coin=res.data.data.coin.split('.')[0];
        that.setData({
          userDetail: res.data.data
        })
      } 
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})