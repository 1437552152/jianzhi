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
    testList: [], //当前集合
    luyongType: 1, // 1、已报名 2、已录用 3、已到岗 4、已结算、
    friendId:1
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({current:options.id||1,friendId:options.friendId})
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
      testList: [],
    })
     this.queryTestList();
  },

  // tab切换
  handleChange({
    detail
  }) {
    var current = detail.key;
    this.setData({
      current: current,
      luyongType: current,
      testList: [],
    });
    this.queryTestList();
  },

  //查询测试集合
  queryTestList: function () {
    var that = this;
    var data = {};
    data.luyongType = that.data.luyongType==1?'':that.data.luyongType;
    data.openid=that.data.friendId;
    urlApi("my/myjob/myjobList", "post", data).then((res) => {
      if (res.data.code ==0) {
        res.data.list.map(item=>{
          item.total=Number(item.monthPay)+Number(item.jobBmbackprice)
        })
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
  goSignFun: function (e) {
    wx.navigateTo({
      url: `../jobDetail/jobDetail?id=${e.currentTarget.dataset.param.jobId}`,
    })
  }
})