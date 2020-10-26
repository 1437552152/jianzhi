// pages/jobDetail/jobDetail.js
import {
  urlApi
} from '../../utils/request';
var {
  jsEvent
} = require("../../utils/util.js");
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
      width: 25,
      height: 25,
      flag: false,
      sfSc:0
    }],
    id: '',
    dataDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    if(options.parentid){
      wx.setStorageSync('parentid', options.parentid)
    }
  },
  // goCollect:function(){
  //   this.setData({flag:true})
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },

  getData: function () {
    const that = this;
    urlApi(`app/index/getJobDetail`, 'POST', {jobId:this.data.id}).then(res => {
      if (res.data.code == 0) {
        let obj = res.data.detail;
        var temp = WxParse.wxParse('article', 'html', obj.jobIntroduce || '', that, 5);
        obj.jobQycode = obj.jobQycode && obj.jobQycode.split(',')[obj.jobQycode.split(',').length - 1] || '';
         if(obj.luyongType){
           obj.luyongType=Number(obj.luyongType)
         }
        that.setData({
          dataDetail: obj,
          sfSc:obj.sfSc,
          'markers[0].latitude': obj.jobLat,
          'markers[0].longitude': obj.jobLot
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: wx.getStorageSync('userInfo').nickName + '邀请你去报名啦!',
      path: `/pages/jobDetail/jobDetail?id=${this.data.id}&parentid=${wx.getStorageSync('userInfo').userId}`
    }

  },
  markertap(e) {
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(that.data.dataDetail.jobLat), //要去的纬度-地址
          longitude: Number(that.data.dataDetail.jobLot), //要去的经度-地址
          name: that.data.dataDetail.jobAddress,
          address: that.data.dataDetail.jobAddress
        })
      }
    })
  },
  goComp: function (e) {
    wx.navigateTo({
      url: `../comInfo/comInfo?id=${e.currentTarget.dataset.compid}`,
    })
  },
  onJsEvent: function (e) {
    let userInfo = wx.getStorageSync('userInfo');
    const that=this;
    if (userInfo && userInfo.openid) {
      if (e.currentTarget.dataset.status == 1) {
       const {sfSc} =this.data;
        //  收藏
        let body = {};
        body['jobId'] =  this.data.id;
        urlApi(sfSc?`app/mysc/qxcollectJob`:`app/mysc/collectJob`, 'POST',body).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title:res.data.msg,
              icon: 'none'
            })  
            that.getData(); 
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        })
      }else if(e.currentTarget.dataset.status == 3){
        let body = {};
        body['jobId'] =  this.data.id;
        urlApi(`my/myjob/baoming`, 'POST',body).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title:res.data.msg,
              icon: 'none'
            })  
            that.getData(); 
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        })
    }else if(e.currentTarget.dataset.status == 4){
      let body = {};
      body['jobId'] =  this.data.id;
      urlApi(`my/myjob/cancelBaoming`, 'POST',body).then(res => {
        if (res.data.code == 0) {
          wx.showToast({
            title:res.data.msg,
            icon: 'none'
          })  
          that.getData(); 
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
    } else {
      jsEvent(e);
    }
  }
})