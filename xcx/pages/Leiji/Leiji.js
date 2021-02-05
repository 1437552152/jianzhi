// pages/mytest/mytest.js
var {
  urlApi
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testList: [], //当前集合
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     this.queryTestList();
  },
  //查询测试集合
  queryTestList: function () {
    var that = this;
    var data = {};
    urlApi("/app/myshouyi/getLjShouYi", "get", data).then((res) => {
      if (res.data.code == 0) {
         that.setData({testList:res.data.list});
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})