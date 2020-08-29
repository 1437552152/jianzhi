var {
  urlApi,host
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,
    status: true,
    show:true,
    user_type:'',
    regionText: '安徽省合肥市蜀山区',
    region: ['安徽省', '合肥市', '蜀山区'],
    isChecked: 1, //是否选中：1未选中 2已选中
    photoPath:'',
    photoValue:'',
    userDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_type: options.userType
    })
    this.queryUserDetail();
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


  //查询用户详情
  queryUserDetail: function () {
    var that = this;
    var data = {};
    urlApi('user/Profile/index', "post", data).then((res) => {
      console.log(res);
      if (res.data.code == 1) {
        //如果当前用户角色等于选中的角色，则显示资质图片，反之，不显示
        var photoPath = "";
        if (res.data.data.user_type == that.data.user_type){
          photoPath = res.data.data.id_photo;
        }
        var photoValue = "";
        if (res.data.data.more.id_photo) {
          photoValue = res.data.data.more.id_photo;
        }
        var region = ['安徽省', '合肥市', '蜀山区'];
        var regionText = '安徽省合肥市蜀山区';
        if (res.data.data.province){
          region[0] = res.data.data.province;
          region[1] = res.data.data.city;
          region[2] = res.data.data.district;
          regionText = res.data.data.province + res.data.data.city + res.data.data.district;
        }
        that.setData({
          userDetail: res.data.data,
          photoPath: photoPath,
          region: region,
          regionText: regionText,
          photoValue: photoValue
        })
      }
    })
  },

  //上传资质照片
  uploadPositiveClick: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        var filep = res.tempFilePaths[0];
        console.log("filep=========", filep);
        wx.uploadFile({
          url: host +"portal/article/circle_upload",
          filePath: filep,
          header: {},
          name: 'file',
          formData: {
            'fileId': that.data.positiveId,
            'token': wx.getStorageSync("tokenn")
          },
          success: (val) => {
            let data = JSON.parse(val.data);
            console.log("data===========", data);
            if (data.code == 1) {
              that.setData({
                photoPath: data.data.path,
                photoValue: data.data.value
              })
            }
          },
          fail: function (err) {
            console.log(err)
          }
        });
      }
    })
  },

  //改变地址
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var region = e.detail.value;
    var regionText = region.join(",");
    this.setData({
      region: e.detail.value,
      regionText: regionText.replace(/,/g, "")
    })
  },

  //是否勾选协议
  radioChange: function (e) {
    this.setData({
      isChecked: 2
    })
  },

  //查看商家协议
  seeMerchantAgreementClick: function () {
    var user_type = this.data.user_type;
    wx.navigateTo({
      url: "/pages/store-agreement/store-agreement?user_type=" + user_type
    })
  },
  
  //表单提交
  formSubmit:function(e){
   console.log(e);
   var that = this;
    var data = e.detail.value;
    var company_name = data.company_name;
    if (!company_name){
      wx.showToast({
        title: '请填写组织名称',
        icon: "none"
      })
      return false;
    }
    var user_login = data.user_login;
    if (!user_login) {
      wx.showToast({
        title: '请填写姓名',
        icon: "none"
      })
      return false;
    }

    var mobile = data.mobile;
    if (!mobile) {
      wx.showToast({
        title: '请填写手机号',
        icon: "none"
      })
      return false;
    }

    if (!(/^1[345789]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '手机号格式有误',
        icon: 'none'
      });
      return false;
    }

    var id_number = data.id_number;
    if (!id_number) {
      wx.showToast({
        title: '请填写身份证号',
        icon: "none"
      })
      return false;
    }

    var address = data.address;
    if (!address) {
      wx.showToast({
        title: '请填写详细地址',
        icon: "none"
      })
      return false;
    }

    var photoValue = that.data.photoValue;
    if (!photoValue){
      wx.showToast({
        title: '请上传资质',
        icon: "none"
      })
      return false;
    }

    var isChecked = that.data.isChecked;
    if (isChecked == 1){
      wx.showToast({
        title: '请勾选相关协议',
        icon: "none"
      })
      return false;
    }
    var region = that.data.region;
    data.province = region[0];
    data.city = region[1];
    data.district = region[2];
    data.user_type = that.data.user_type;
    data.id_photo = photoValue;
    data.page_type = 1;
    console.log(data);
    urlApi("user/Profile/editPost", "post", data).then((res) => {
      console.log(res);
      if (res.data.code == 1) {
        wx.redirectTo({
          url: '/pages/underreview/underreview'
        })
        // var pages = getCurrentPages();
        // var prePage = pages[pages.length - 2];
        // prePage.onShow();
        // wx.navigateBack({
        //   delta: 1,
        // })
      }
    });
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