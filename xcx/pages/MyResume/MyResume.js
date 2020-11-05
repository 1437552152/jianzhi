var {
  urlApi,host
} = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userDetail:'',
    birthday:'',
    stadyTime:'',
    myDiploma:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryUserDetail();
  },
  bindDateChange: function(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  bindStadyChange: function(e) {
    this.setData({
      stadyTime: e.detail.value
    })
  },
  myDiplomaHandle:function(){
    let that=this;
    let arr=['初中','高中','大专','本科','硕士','博士及以上']
    wx.showActionSheet({
      itemList: arr,
      success(res){
         that.setData({myDiploma:arr[res.tapIndex]})
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
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },


  //查询用户详情
  queryUserDetail: function () {
    var that = this;
    var data = {};
    urlApi('app/mycv/info', "get", data).then((res) => {
      console.log(res);
      if (res.data.code == 0) {
        that.setData({
          userDetail: res.data.myCv,
          birthday:res.data.myCv.myCvEntity&&res.data.myCv.myCvEntity.birthday?res.data.myCv.myCvEntity.birthday:'2020-09-01',
          stadyTime:res.data.myCv.myCvEntity&&res.data.myCv.myCvEntity.stadyTime?res.data.myCv.myCvEntity.stadyTime:'2020-09-01',
          myDiploma:res.data.myCv.myCvEntity&&res.data.myCv.myCvEntity.myDiploma?res.data.myCv.myCvEntity.myDiploma:'',
        })
      }
    })
  },
  
  //表单提交
  formSubmit:function(e){
   var that = this;
    var data = e.detail.value;
    var username = data.username;
    if (!username){
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

    var birthday = this.data.birthday;
    if (!birthday) {
      wx.showToast({
        title: '请填写出生年月',
        icon: "none"
      })
      return false;
    }

    var nativeplace = data.nativeplace;
    if (!nativeplace) {
      wx.showToast({
        title: '请填写籍贯',
        icon: "none"
      })
      return false;
    }

    let {userDetail}=this.data;
    userDetail.myCvEntity={...userDetail.myCvEntity,...data,...{stadyTime:this.data.stadyTime},...{myDiploma:this.data.myDiploma}};
    userDetail.birthday=this.data.birthday;
    userDetail.mobile=data.mobile;
    userDetail.username=data.username;
    userDetail.nativeplace=data.nativeplace;
    console.log(userDetail);
    urlApi("app/mycv/saveandUpdate", "post", userDetail).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '保存成功',
          icon: "none"
        })
        wx.switchTab({
          url: '../my/my',
        })         
      }else{
        wx.showToast({
          title: '保存失败',
          icon: "none"
        })
      }
    });
  }
})