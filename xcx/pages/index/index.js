// pages/index/index.js
import {
  urlApi
} from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper:[],
    jobType:[],
    jobList:[],
    city:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
    },

    //获取经纬度方法
    getLocation: function () {
      var that = this
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.getCity(latitude, longitude);
        }, fail: res => {
          wx.setStorageSync('location','全国');
          this.setData({city:'全国'})
          that.jobList();
        }
      })
    },
   
    //获取城市信息
    getCity: function (latitude, longitude) {
      var that = this
      var url = "https://api.map.baidu.com/geocoder/v2/";
      var params = {
        ak: "wGmGuhs8gImYDhmwwbBpZSB3nNoi9Agg",
        output: "json",
        location: latitude + "," + longitude
      }
      wx.request({
        url: url,
        data: params,
        success: function (res) {
           var city = res.data.result.addressComponent.city;
           wx.setStorageSync('location', city);
           that.jobList();
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  searchValue:function(){
  },
  goChoose:function(){
    wx.navigateTo({
      url: '../city/city',
    })
  },
   jobList:function(){
    const that=this;
    let body={};
    wx.showLoading({
      title: '加载中',
    })
    if(wx.getStorageSync('location')&&wx.getStorageSync('location')!='全国'){
       body.city=wx.getStorageSync('location');
    }
   
    urlApi('app/index/getJoblist','get',body).then(res=>{
      if(res.data.code==0){
        res.data.jobList.length&&res.data.jobList.map((item,index)=>{
          item.jobQycode=item.jobQycode.split(',')[item.jobQycode.split(',').length-1];
          item.compWelfare=item.compWelfare.split(',');
        })
        that.setData({jobList:res.data.jobList,city:wx.getStorageSync('location')||''})
        wx.hideLoading()
      }else{
        wx.showToast({
          title:res.data.msg,
          icon:'none'
        })
        wx.hideLoading()
      }
    
    })
   },
  getLunbo:function(){
    const that=this;
    urlApi('app/index/getPiclist','get',{}).then(res=>{
      if(res.data.code==0){
        that.setData({swiper:res.data.picList})
      }else{
        wx.showToast({
          title:res.data.msg,
          icon:'none'
        })
      }
    
    })
  },
  getJobType:function(){
    const that=this;
    urlApi('app/index/getJobTypeList','get',{}).then(res=>{
      if(res.data.code==0){
        that.setData({jobType:res.data.jobTypelist})
      }else{
        wx.showToast({
          title:res.data.msg,
          icon:'none'
        })
      }
    
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(wx.getStorageSync('location')){
      that.jobList();
    }else{
      that.getLocation();
    }
    // 获取轮播图
    this.getLunbo();
    // 获取工作类型
    this.getJobType();
  },
  goDetail:function(e){
    wx.navigateTo({
      url: `/pages/jobDetail/jobDetail?id=${e.currentTarget.dataset.list.jobId}`,
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
  goTypeList:function(e){
     wx.navigateTo({
       url: `../jobType/jobType?jobtypeId=${e.currentTarget.dataset.param.jobtypeId}&pic=${e.currentTarget.dataset.param.picSaveUrl}`,
     })

  }
})