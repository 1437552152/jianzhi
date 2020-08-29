// pages/index/index.js
import {
  urlApi
} from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobType:[],
    jobList:[],
    jobtypeId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({jobtypeId:options.jobtypeId});
      this.jobList();
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
    body.jobtypeId=this.data.jobtypeId;
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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