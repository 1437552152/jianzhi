import {
  urlApi
} from '../../utils/request';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picList:[]
  },
  goDetail:function(e){
    wx.navigateTo({
      url: `../helpDetail/helpDetail?id=${e.currentTarget.dataset.item.picId}`,
    })
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
    urlApi(`app/index/getPiclist?pzType=HelpList`,'get',{}).then(res=>{
      if(res.data.code==0){
         let obj=res.data.picList;
         that.setData({picList:obj});
         wx.setNavigationBarTitle({
           title:'新手指南',
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