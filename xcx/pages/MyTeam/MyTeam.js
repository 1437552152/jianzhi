// pages/mytest/mytest.js
var {
  urlApi
} = require("../../utils/request.js");
var testAllList = []; //所有集合
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testList: [], //当前集合
    type: 1, //状态1.未完成 2已完成
    current:1
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
   this.queryTestList();
  },

  // tab切换
  handleChange({
    detail
  }) {
    var current = detail.key;
    this.setData({
      type: current,
      current:current
    });
    this.queryTestList();
  },

  //查询测试集合
  queryTestList: function () {
    var that = this;
    var data = {};
    const {type} = this.data;
    urlApi(type===1?"/app/myrelation/list":'/app/myrelation/nextlist', "get", data).then((res) => {
      if(res.data.code===0){
        that.setData({
          testList:res.data.page.list
         })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
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
  goSignFun: function () {
    wx.navigateTo({
      url: '../signUpList/signUpList',
    })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 1,
      loading: true,
      noMore: false
    });
    that.queryTestList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.loading && !that.data.noMore) {
      that.setData({
        page: ++that.data.page,
        loading: true,
        noMore: false,
      })
      that.queryTestList();
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})