// pages/center/orderdetail/orderdetail.js
var api = require('./../../../api.js');
var util = require('./../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    oid: '',
    shopId: '',
    orderInfo: {

    },
    cartCount: 0,
    money: 0,
    moneyStr: "0",
    status: '',
    codeimg: 'https://img.dd528.com/images/barcode/49401219/49401219.jpg',
    isShowCode: false,
    payInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.oid = options.oid;
    this.data.shopId = options.shopId;

    console.log('data = ', this.data)

    var that = this;
    this.requestOrderInfo(function (data) {

      var tCount = 0;
      var tMoney = 0;
      for (var i in data.goodsInfo) {
        tCount += data.goodsInfo[i].count;
        tMoney += data.goodsInfo[i].price * data.goodsInfo[i].count;
        data.goodsInfo[i].total = (data.goodsInfo[i].price * data.goodsInfo[i].count).toFixed(2);
      }
      var statusStr = '待付款';
      if (data.orderStatus == 0) {
        statusStr = '待付款';
      } else if (data.orderStatus == 1) {
        statusStr = '已付款';

        that.requestOrderQRcode(function(data){
          console.log('code data',data);
          if(!util.isEmpty(data)){
            that.setData({
              codeimg: data
            });
          }
        });

      }

      that.setData({
        orderInfo: data,
        cartCount: tCount,
        money: tMoney,
        moneyStr: tMoney.toFixed(2),
        status: statusStr
      });

      if (util.isEmpty(data)) {
        wx.showToast({
          title: '获取订单失败',
        })
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

  },
  onTapCopy: function (e) {

  },
  onTapCode: function (e) {
    console.log('code', e);
    this.setData({
      isShowCode: true,
    })
  },
  onTapCancelShowCode: function (e) {

    this.setData({
      isShowCode: false,
    })

  },
  onTapDelete: function (e) {
    var that = this;
    wx.showModal({
      title: '',
      content: "确定删除此订单吗?",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.requestDelOrder(function (data) {
            if (data) {
              var arr = getCurrentPages();
              var isHaveOrderList = false;
              var orderIndex =0,myIndex=0;
              for (var i in arr) {
                if (arr[i].route == 'pages/center/orderlist/orderlist') {
                  orderIndex = i;
                }
                if (arr[i].route == 'pages/center/orderdetail/orderdetail') {
                  myIndex = i;
                }
              }

              wx.navigateBack({
                delta:myIndex-orderIndex,
              });
            }
          })
        }
      }
    })
  },

  onTapCancel: function (e) {
    var that = this;
    wx.showModal({
      title: '',
      content: "确定取消此订单吗?",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.requestDelOrder(function (data) {
            if (data) {
              var arr = getCurrentPages();
              var isHaveOrderList = false;
              var orderIndex = 0, myIndex = 0;
              for (var i in arr) {
                if (arr[i].route == 'pages/center/orderlist/orderlist') {
                  orderIndex = i;
                }
                if (arr[i].route == 'pages/center/orderdetail/orderdetail') {
                  myIndex = i;
                }
              }

              wx.navigateBack({
                delta: myIndex - orderIndex,
              });
            }
          })
        }
      }
    })
  },
  onTapPay: function (e) {
    this.handleRequestPayInfo();
  },
  onTapSave: function (e) {
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope
    console.log('click', e);

    var that = this;
    wx.getSetting({
      success(res) {
        console.log(1111);
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log(3333);

          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(22222222);
              // 用户已经同意小程序使用
              that.saveImage(that.data.codeimg);
            },
            fail(res) {
              console.log(888888888, res)

              //添加拒绝授权之后的 容错。 避免拒绝之后 不能再授权
              wx.openSetting({
                success(res) {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      console.log(77777777);
                      // 用户已经同意小程序使用
                      that.saveImage(that.data.codeimg);
                    }
                  })
                }
              })
            }
          })

        } else {
          //已授权
          console.log(4444);
          that.saveImage(that.data.codeimg);
        }
      }
    })

  },

  saveImage: function (imgurl) {
    wx.downloadFile({
      url: imgurl,
      success: function (res) {
        console.log('down success path', res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log('保存成功', res);
            wx.showToast({
              title: '保存成功',
            })
          }, fail: function (res) {
            console.log('保存失败', res);
            wx.showToast({
              title: '保存失败',
            })
          },
        })
      },
      fail: function (res) {
        console.log('down image fail', res);
        wx.showToast({
          title: '下载失败',
        })
      }
    })

  },

  requestOrderInfo: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.orderInfo;
    api.requestGet({
      url: tUrl,
      data: {
        shopId: this.data.shopId,
        oid: this.data.oid,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '请求订单成功', res.data);
          typeof cb == "function" && cb(res.data)

        } else {
          console.log(tUrl, '请求订单失败', res.code, res.data);
          typeof cb == "function" && cb()
        }

      },
      fail: function (res) {
        {
          wx.hideLoading();
          console.log(tUrl, '网络请求失败', res.code);
          typeof cb == "function" && cb()
        }

      }
    });

  },


  handleRequestPayInfo: function (e) {

    var that = this;
    this.requestPayInfo(function (data) {
      if (!util.isEmpty(data)) {
        // data.timestamp = '1505374389';
        // data.noncestr = '4uRGjzX9NvYlOTUx';
        // data.package = 'Sign=WXPay';
        // data.timestamp = '1505374389';
        // data.sign = 'DAA041B78A3C2FB0632A49BFA3F88FCE';
        that.setData({
          payInfo: data
        })

        that.handleCallWXPay();

      }

    });
  },

  handleCallWXPay: function (e) {

    var that = this;
    var tpayInfo = this.data.payInfo;
    wx.requestPayment({
      timeStamp: tpayInfo.timeStamp,
      nonceStr: tpayInfo.nonceStr,
      package: tpayInfo.package,
      signType: tpayInfo.signType,
      paySign: tpayInfo.paySign,
      success: function (e) {
        console.log("success");
        console.log(e);
      },
      fail: function (e) {
        console.log("fail");
        console.log(e);
      },
      complete: function (e) {
        console.log("complete");
        console.log(e);
        var strs = new Array(); //定义一数组 
        strs = e.errMsg.split(" "); //字符分割 
        // wx.showToast({
        //   title: strs[1],
        // });
        if (util.isContains(e.errMsg, "requestPayment:fail") ||
          util.isContains(e.errMsg, "requestPayment:fail cancel")) {//支付失败转到待支付订单列表
          wx.showModal({
            title: "提示",
            content: "订单尚未支付",
            showCancel: false,
            confirmText: "确认",
            success: function (res) {
              if (res.confirm) {

              }
            }
          });

          //支付成功  
        } else {

          //上报服务端
          that.requestSubmitOrderSuccess(function (success) {
            if (success) {
              console.log('++++++++++++++++上报支付成功----------')
            } else {
              console.log('----------上报支付失败----------')
            }

            //刷新购物车
            that.handleRefreshCart();

            //跳转到 扫码页面
            var oid = that.data.oid;
            var shopId = that.data.shopId;
            var tCheckUrl = '../ordercheck/ordercheck' + '?oid=' + oid + '&shopId=' + shopId;
            wx.redirectTo({
              url: tCheckUrl,
            })

          });
        }
      },
    });
  },

  handleRefreshCart: function (e) {
    var arr = getCurrentPages();
    console.log("all page arr", arr);

    var page;

    for (var i in arr) {
      // if (arr[i].route == 'pages/center/cart/cart') {
      //   arr[i].onLoad();
      // }
      // else if (arr[i].route == 'pages/center/scan/scan') {
      //   arr[i].onShow();
      // } 
      // else 
      // if (arr[i].route == 'pages/center/orderlist/orderlist') {
      //   arr[i].onLoad();
      // }
    }
  },

  requestPayInfo: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.payInfo;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: this.data.shopId,
        oid: this.data.oid,
        openid: getApp().globalData.openid,
        payType: 2,//微信固定为2
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '请求成功', res.data);
          typeof cb == "function" && cb(res.data)

          if (Object.keys(res.data).length == 0) {
            wx.showToast({
              title: '获取支付信息失败',
            })
          }

        } else {
          console.log(tUrl, '请求失败', res.code, res.data);
          typeof cb == "function" && cb()
        }

      },
      fail: function (res) {
        {
          wx.hideLoading();
          console.log(tUrl, '网络请求失败', res.code);
          typeof cb == "function" && cb()
        }

      }
    });

  },

  //模拟服务端提交支付成功 回调
  requestSubmitOrderSuccess: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })

    var tUrl = api.api.paySuccess;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: this.data.shopId,
        oid: this.data.oid,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '上报成功');
          typeof cb == "function" && cb(true)

        } else {
          console.log(tUrl, '上报失败', res.code, res.data);
          typeof cb == "function" && cb(false)
        }

      },
      fail: function (res) {
        {
          wx.hideLoading();
          console.log(tUrl, '网络请求失败', res.code);
          typeof cb == "function" && cb(false)
        }

      }
    });

  },

  requestDelOrder: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.delOrder;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: this.data.shopId,
        oid: this.data.oid,
        openid: getApp().globalData.openid,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '请求成功', res.data);
          typeof cb == "function" && cb(true)
        } else {
          console.log(tUrl, '请求失败', res.code, res.data);
          typeof cb == "function" && cb(false)
        }

      },
      fail: function (res) {
        {
          wx.hideLoading();
          console.log(tUrl, '网络请求失败', res.code);
          typeof cb == "function" && cb(false)
        }

      }
    });
  },
  requestOrderQRcode: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.orderQRCode;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: this.data.shopId,
        oid: this.data.oid,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '请求成功', res.data);
          typeof cb == "function" && cb(res.data)
        } else {
          console.log(tUrl, '请求失败', res.code, res.data);
          typeof cb == "function" && cb()
        }

      },
      fail: function (res) {
        {
          wx.hideLoading();
          console.log(tUrl, '网络请求失败', res.code);
          typeof cb == "function" && cb()
        }

      }
    });
  },
})