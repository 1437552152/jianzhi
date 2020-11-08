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
    city:'',
    NoticeList:[],
    jobTitle:'',
    flag:0,
    flag1:1,
    newsList:[
     {id:1,title:"一年之计在于春，婉妮帮您来变身~",content:"121212"},
     {id:2,title:"穿越时光，带你回到十年前的自己",content:"1212121"}
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.parentid){
        wx.setStorageSync('parentid', options.parentid)
      }
       this.getNotice();
       this.getStatus();
  },
  getStatus:function(){
    const that=this;
    urlApi('app/index/xgzt', "get", {}).then((res) => {
      if (res.data.code == 0) {
          that.setData({
            flag:res.data.re,
            flag1:res.data.re,
          })
      }
    })
  },
  goLunbo:function(e){
       wx.navigateTo({
         url: '../newDetail/newDetail?id='+e.currentTarget.dataset.item.picId,
       })
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
  searchValue:function(e){
    this.setData({
      jobTitle:e.detail.value
    });
    this.jobList();
  },
  goChoose:function(){
    wx.navigateTo({
      url: '../city/city',
    })
  },
   jobList:function(){
    const that=this;
    let body={};
    if(wx.getStorageSync('location')&&wx.getStorageSync('location')!='全国'){
       body.city=wx.getStorageSync('location');
    }
    body.jobTitle=this.data.jobTitle;
   
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
      }
    
    })
   },
   getNotice:function(){
    const that=this;
    urlApi('app/index/getPiclist?pzType=Notice','get',{}).then(res=>{
      if(res.data.code==0){
        that.setData({NoticeList:res.data.picList})
      }else{
        wx.showToast({
          title:res.data.msg,
          icon:'none'
        })
      }
    
    })
   },
  getLunbo:function(){
    const that=this;
    urlApi('app/index/getPiclist?pzType=Lunbo','get',{}).then(res=>{
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
  gotoPage: function (e) { 
     wx.navigateTo({
       url:`../jobDetail/jobDetail?Copyid=${e.currentTarget.dataset.id}`,
     })
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
    return {
      title: wx.getStorageSync('userInfo').nickName + '邀请你去报名啦!',
      path: `/pages/index/index?parentid=${wx.getStorageSync('userInfo').openid}`
    }
  },
  goTypeList:function(e){
     wx.navigateTo({
       url: `../jobType/jobType?jobtypeId=${e.currentTarget.dataset.param.jobtypeId}&pic=${e.currentTarget.dataset.param.picBigSaveUrl}`,
     })

  }
})