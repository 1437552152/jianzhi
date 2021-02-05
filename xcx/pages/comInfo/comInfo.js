// pages/comInfo/comInfo.js
import {
  urlApi
} from '../../utils/request';
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: "../../static/img/cir.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width:25,
      height:25
    }],
    id:'',
    dataDetail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id});
    this.getData();
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
},
getData:function(){
  const that=this;
  wx.showLoading({
    title: '加载中',
  })
  urlApi(`app/index/info/${this.data.id}`,'get',{}).then(res=>{
    if(res.data.code==0){
       let obj=res.data.sysComp;
       var temp=  WxParse.wxParse('article', 'html',obj.compIncroduce||'', that, 5);
       that.setData({dataDetail:obj,'markers[0].latitude':obj.compLat,'markers[0].longitude':obj.compLot})
       wx.hideLoading()
      }else{
      wx.showToast({
        title:res.data.msg,
        icon:'none'
      });
      wx.hideLoading()
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
  markertap:function(e) {
    const that=this;
    wx.getLocation({
     type: 'wgs84', 
     success: function (res) {
       wx.openLocation({//​使用微信内置地图查看位置。
         latitude: Number(that.data.dataDetail.compLat),//要去的纬度-地址
         longitude:Number(that.data.dataDetail.compLot),//要去的经度-地址
         name: that.data.dataDetail.compName,
         address:that.data.dataDetail.compAddr
       })
     }
   })
 }
})