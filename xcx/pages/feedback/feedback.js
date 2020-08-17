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
    focus: true
  },
  //键盘输入事件
  input: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  send: function() {
    let obj = {}
    obj.msg = this.data.content
    urlApi("/user/Profile/guestbook_post","post", obj).then((res)=>{
      wx.showToast({
        title: res.data.msg,
        icon:'none'
      })         
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})