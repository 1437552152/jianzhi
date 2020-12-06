// pages/Withdrawal/Withdrawal.js
var {
  urlApi
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yongjinInfo:{},
    current: '支付宝',
    changeInputValue:'',
  },
  handleChange({ detail = {} }) {
    this.setData({
        current: detail.value
    });
  },
  changeInput:function(e){
     this.setData({changeInputValue:e.detail.value})
  },
  //表单提交
  formSubmit:function(e){
    var that = this;
     var money = e.detail.value.money;
    
     if(!money){
       wx.showToast({
         title: '请输入提现金额',
         icon:"none"
       })
       return;
     }
     if(!this.data.changeInputValue){
      wx.showToast({
        title: '请填写收款账号',
        icon:"none"
      })
      return;
    }
    
     if(Number(money)<1){
      wx.showToast({
        title: '最低提现金额1.00元',
        icon:"none"
      })
      return;
     }

     if(Number(money)>Number(this.data.yongjinInfo.yuPay)){
      wx.showToast({
        title: '提现金额不能大于余额',
        icon:"none"
      })
      return;
     }
     let params={};
     params.cashoutMoney=money;
     params.txType=this.data.current=='支付宝'?1:2,
     params.txAccount=this.data.changeInputValue;
     urlApi("my/mytx/save", "post", params).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '已提交提现申请,请耐心等候',
          icon:"none",
          duration:3000
        });
        this.setData({'yongjinInfo.yuPay':''})
        //得到佣金情况
        this.getYongjin();
        wx.navigateTo({
          url: '/pages/my/my',
        })
      }})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      //得到佣金情况
      this.getYongjin();
  },
  getYongjin:function(){
    var that = this;
    var data = {};
    urlApi('app/myshouyi/getMyShouYi', "get", data).then((res) => {
      console.log(res);
      if (res.data.code == 0) {
          that.setData({
            yongjinInfo:res.data.map
          })
      }
    })
  }
})