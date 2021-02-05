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
      sfSc: 0
    }],
    id: '',
    dataDetail: null,
    type: false, //true为未授权
    myCV: {},
    flag: 0,
    flag1: 1,
    Copyid: 0,
    isHidden: true, //隐藏模态框
    shareImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });

    if (options.Copyid) {
      this.setData({
        Copyid: options.Copyid
      })
    }

    if (options.parentid) {
      wx.setStorageSync('parentid', options.parentid)
    }

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      wx.setStorageSync('parentid', scene.split('&')[1])
      this.setData({
        id: scene.split('&')[0]
      });
    }
  },
  hiddenMd: function () {
    this.setData({
      isHidden: true //隐藏模态框
    })
  },
  guid: function () {
    let uuid =(new Date()).valueOf()+'000';
    return uuid;
  },
  json2Form:function(json) {
    var str = [];
    for (var p in json) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
  },

  goPay: function (jobId, money,username,nickName,jobTitle) {
    let uuid=this.guid();
    let that = this;
    let params = {};
    params.openid = wx.getStorageSync('userInfo').openid;
    params.orderCode = uuid; // 订单号
    params.money = money;
    let url = "https://www.yyf2gml.site/wxapi/wxpay";
    wx.request({
      method: 'POST',
      url: url,
      data: this.json2Form(params),
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 默认值
      },
      success: function (res) {
        let data = res.data.data;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: 'prepay_id=' + data.prepayId,
          signType: 'MD5',
          paySign: data.paySign,
          success(res) {
            let body={};
            body.depositNum=money;
            body.jobId=jobId;
            body.oderCode=uuid;
            body.username=username;
            body.nickName=nickName;
            body.jobTitle=jobTitle;
            urlApi(`sys/sysdeposit/save`, 'POST', body).then(res => {
              wx.showToast({
                title: '您已支付成功,去报名吧',
                icon: 'none',
                duration: 3000
              });
            })
          },
          fail(res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 3000
            })
          }
        })
      }, fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      urlApi(`app/index/getNum`, 'POST', {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }).then(res => {
        let data = {};
        data = that.data.myCv;
        data.mobile = res.data.re.phoneNumber;
        urlApi("app/updatephone", "post", data).then((res) => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '授权成功,快去报名吧',
              icon: "none",
              duration: 3000
            });
            that.setData({
              type: false
            })
          } else {
            wx.showToast({
              title: '请授权后再报名',
              icon: "none",
              duration: 3000
            })
          }
        });
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStatus();
    if (!this.data.Copyid) {
      // 判断是否授权
      this.getData();
      let userInfo = wx.getStorageSync('userInfo');
      const that = this;
      if (userInfo && userInfo.openid) {
        this.getJianJie();
        that.setData({
          type: true
        });
      }
    }
    if (!wx.getStorageSync('userInfo').openid) {
      wx.hideShareMenu({
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  },
  getJianJie: function () {
    var that = this;
    urlApi('app/mycv/info', "get", {}).then((res) => {
      console.log(res);
      if (res.data.code == 0) {
        that.setData({
          myCv: res.data.myCv,
          type: res.data.myCv.mobile ? false : true
        })
      }
    })

  },
  getData: function () {
    const that = this;
    urlApi(`app/index/getJobDetail`, 'POST', {
      jobId: this.data.id
    }).then(res => {
      if (res.data.code == 0) {
        let obj = res.data.detail;
        var temp = WxParse.wxParse('article', 'html', obj.jobIntroduce || '', that, 5);
        obj.jobQycode = obj.jobQycode && obj.jobQycode.split(',')[obj.jobQycode.split(',').length - 1] || '';
        if (obj.luyongType) {
          obj.luyongType = Number(obj.luyongType)
        }
        that.setData({
          dataDetail: obj,
          sfSc: obj.sfSc,
          'markers[0].latitude': obj.jobLat,
          'markers[0].longitude': obj.jobLot
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000
        })
      }

    })
  },
  getStatus: function () {
    const that = this;
    urlApi('app/index/xgzt', "get", {}).then((res) => {
      if (res.data.code == 0) {
        that.setData({
          flag: res.data.re,
          flag1: res.data.re
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
      path: `/pages/jobDetail/jobDetail?id=${this.data.id}&parentid=${wx.getStorageSync('userInfo').openid}`
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
  goSave: function () {
    let that = this;
    wx.showLoading({
      title: '正在保存中',
      icon: 'none',
      duration: 3000
    })
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //这里是用户同意授权后的回调
              that.saveImgToLocal();
            },
            fail() { //这里是用户拒绝授权后的回调
              wx.showToast({
                title: '相册授权失败',
                icon:'none',
                duration: 3000
              });
              wx.hideLoading();
            }
          })
        } else { //用户已经授权过了
          that.saveImgToLocal();
        }
      }
    })
  },
  saveImgToLocal: function (e) {
    let that = this;
    let imgSrc = that.data.shareImg;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
   
            wx.hideLoading();
            that.setData({
              isHidden: true
            });
            wx.showToast({
              title: '相册保存成功',
              icon: 'none',
              duration:5000
            });
          },
        })
      }
    })

  },
  onJsEvent: function (e) {
    let userInfo = wx.getStorageSync('userInfo');
    const that = this;

    if (userInfo && userInfo.openid) {
      if (e.currentTarget.dataset.status == 1) {
        const {
          sfSc
        } = this.data;
        //  收藏
        let body = {};
        body['jobId'] = this.data.id;
        urlApi(sfSc ? `app/mysc/qxcollectJob` : `app/mysc/collectJob`, 'POST', body).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
            that.getData();
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        })
      } else if (e.currentTarget.dataset.status == 3) {
        wx.requestSubscribeMessage({
          tmplIds: ["SR5oYWUa64WakJ7m7_UmWaE8GyWzrg4SgeB1_9Ua2OU",
            '0Sh6v8I4dspl8xm1OZjiVu_tl8WJWCEXYbeHL4P4OCE', 'AxcElw_0chKKXiRB-pINyh8XUsvlC57Bkmczs_1s5W4'
          ],
          success: (res) => {
            console.log("1111", res);
          },
          fail(err) {
            console.log("err", err);
          }
        });
        if (!that.data.myCv.nativeplace) {
          wx.showToast({
            title: '请完善简介',
            icon: "none",
            duration: 3000
          });
          wx.navigateTo({
            url: '/pages/MyResume/MyResume',
          });
          return;
        }
       
         if(this.data.dataDetail.jobYj>0&&this.data.dataDetail.depositStatue!='0'&&this.data.dataDetail.depositStatue!='1'){
          wx.showModal({
            title: '提示',
            content: `报名该职位您将支付${that.data.dataDetail.jobYj}元`,
            success: function (res) {
              if (res.confirm) {
                that.goPay(that.data.id,that.data.dataDetail.jobYj,userInfo.username,userInfo.nickName,that.data.dataDetail.jobTitle);
              }}})
         }else{
            if(this.data.dataDetail.depositStatue=='1'){
              wx.showToast({
                title: '您已成功退款,不能再次报名该职位',
                icon:'none',
                duration: 3000
              })
              return false;
            }
          let body = {};
          body['jobId'] = this.data.id;
          urlApi(`my/myjob/baoming`, 'POST', body).then(res => {
            if (res.data.code == 0) {
              wx.showToast({
                title: "报名成功",
                icon: 'none',
                duration: 3000
              })
              that.getData();
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000
              })
            }
          })
         }
      } else if (e.currentTarget.dataset.status == 4) {
        let body = {};
        body['jobId'] = this.data.id;
        urlApi(`my/myjob/cancelBaoming`, 'POST', body).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: "取消成功",
              icon: 'none',
              duration: 3000
            })
            that.getData();
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        })
      } else if (e.currentTarget.dataset.status == 2) {
        let body = {};
        body['id'] = this.data.id;
        body['parentid'] = wx.getStorageSync('userInfo').openid;
        body['jobHbUrl'] = this.data.dataDetail.jobHbUrl;
        wx.showLoading({
          title: '海报生成中',
          icon: 'none',
          duration: 3000
        })
        urlApi(`app/index/getHbPic`, 'get', body).then(res => {
          if (res.data.status == 1) {
            this.setData({
              shareImg: res.data.url,
              isHidden: false
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
          wx.hideLoading();
        })
      }
    } else {
      jsEvent(e);
    }
  }
})