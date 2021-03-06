// pages/newDetail/newDetail.js
var WxParse = require('../../wxParse/wxParse.js');
import {
  urlApi
} from '../../utils/request';
Page({
  /**
   * 页面的初始数据
   */
  data: {
      dataDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getData();
  },
  getData:function(){
    const that=this;
    wx.showLoading({
      title: '加载中',
    })
    urlApi(`app/index/getPiclist?pzType=AboutUs`,'get',{}).then(res=>{
      if(res.data.code==0){
         let obj=res.data.picList[0];
         var temp=  WxParse.wxParse('article', 'html', obj.descript||'', that, 5);
         that.setData({dataDetail:obj});
         wx.setNavigationBarTitle({
           title:'关于我们',
         })
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