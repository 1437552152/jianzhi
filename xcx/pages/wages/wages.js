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
    current: 1,
    list_done: [],
    list_undone: [],
    testList: [], //当前集合
    type: 1, //状态1.未完成 2已完成
    page: 1 //当前分页
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
    this.setData({
      noMore: false,
      loading: false,
      testAllList: [],
      testList: [],
      page: 1
    })
    // this.queryTestList();
  },

  // tab切换
  handleChange({
    detail
  }) {
    var current = detail.key;
    this.setData({
      current: current,
      type: current,
      noMore: false,
      loading: false,
      testAllList: [],
      testList: [],
      page: 1
    });
    this.queryTestList();
  },

  //查询测试集合
  queryTestList: function () {
    var that = this;
    var data = {};
    var page = that.data.page;
    data.type = that.data.type;
    data.page = page;
    console.log(data);
    urlApi("/user/Profile/my_psychological", "post", data).then((res) => {
      console.log(res);
      if (page == 1) {
        testAllList = [];
      }
      if (res.data.code == 1) {

        if (res.data.data.articles.length > 0) {
          for (var i = 0; i < res.data.data.articles.length; i++) {
            testAllList.push(res.data.data.articles[i]);
          }
          if (res.data.data.articles.length * page >= res.data.data.page_total && page > 1) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
            that.setData({ //没有更多了显示
              noMore: true,
              loading: true,
            })
          }
        } else {
          // wx.showToast({
          //   title: '没有更多数据了',
          //   icon: "none"
          // })
          that.setData({ //没有更多了显示
            noMore: true,
            loading: true,
          })
        }

        // that.setData({
        //   list_done: res.data.data.done_psychological,
        //   list_undone: res.data.data.undone_psychological,
        // })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
      that.setData({
        testList: testAllList
      })
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