// pages/index/index.js
import {
  urlApi
} from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.scList();
  }, 

  scList:function(){
    const that=this;
    let body={};
    urlApi(`app/mysc/sclist?openid=${wx.getStorageSync('userInfo').openid}`,'POST',body).then(res=>{
      if(res.data.code==0){
         that.setData({scList:res.data.sclist})
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
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
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

  }
})