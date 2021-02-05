var {
  urlApi
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
 //预览图片，放大预览
 preview:function(event) {
  console.log(event.currentTarget.dataset.src)
  let currentUrl = event.currentTarget.dataset.src
  wx.previewImage({
    current: currentUrl, // 当前显示图片的http链接
    urls:[currentUrl] // 需要预览的图片http链接列表
  })
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
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.queryTestList();
  },
  //查询测试集合
  queryTestList: function () {
    var that = this;
    var data = {};
    data.luyongType = 4;
    urlApi("my/myjob/myjobList", "post", data).then((res) => {
      if (res.data.code ==0) {
        that.setData({
          testList:res.data.list
         })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
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

  }
})