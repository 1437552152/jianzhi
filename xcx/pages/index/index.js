// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    swiper:[
      {image:'../../static/img/active_03.png',url:""}, {image:'../../static/img/active_03.png',url:""}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GPSsubmit();
  },
  GPSsubmit:function(e){
    wx.getLocation({
      type: 'wgs84',
      success: (res)=> {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        this.setData({ latitude: latitude, longitude: longitude})
        // wx.showModal({
        //   title: '当前位置',
        //   content: '经度' + res.longitude+ '纬度'+res.latitude,
        // })
      }
 
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

  },
  goDetail:function(){
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail',
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