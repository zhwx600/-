// pages/center/orderlist/orderlist.js
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
    // cartCount: 0,
    // money: 0,
    // moneyStr: "0",
    payInfo: {},

    refreshPage: 1,
    iscart: false,
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    wx.showLoading({
      title: '',
      mask: true,
    })
    this.data.refreshPage = 1;

    this.requestOrderListInfo(function (data) {
      wx.hideLoading();

      if (util.isEmpty(data)) {
        return;
      }

      console.log('haha', data);

      for (var index in data) {

        var tCount = 0;
        var tMoney = 0;
        for (var i in data[index].goodsInfo) {
          tCount += data[index].goodsInfo[i].count;
          tMoney += data[index].goodsInfo[i].price * data[index].goodsInfo[i].count;
          // data[i].goodsInfo.total = (data[i].goodsInfo.price * data[i].goodsInfo.count).toFixed(2);
        }
        data[index].count = tCount;
        data[index].tmoney = tMoney;
        data[index].moneyStr = tMoney.toFixed(2);

        if (data[index].orderStatus == 0){
          data[index].statusStr = '待付款';
        } else if (data[index].orderStatus == 1) {
          data[index].statusStr = '已付款';
        }
      }

      that.setData({
        orderList: data,
        iscart: data.length > 0 ? true : false,
      });

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

  },

  onTapOrderInfo:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.orderList;

    var tDetailUrl = '../orderdetail/orderdetail' + '?oid=' + list[index].oid + '&shopId=' + list[index].shopId;
    wx.navigateTo({
      url: tDetailUrl,
    });
  },

  requestOrderListInfo: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.orderList;
    api.requestGet({
      url: tUrl,
      data: {
        // shopId: getApp().globalData.shopId,
        page_size: 20,
        page: this.data.refreshPage,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '请求成功', res.data);
          typeof cb == "function" && cb(res.data)

          if (Object.keys(res.data).length == 0) {
            // wx.showToast({
            //   title: '获取购物车失败',
            // })
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


  onTapDelete: function (e) {

    var index = e.currentTarget.dataset.index;
    var list = this.data.orderList;
    this.data.oid = list[index].oid;
    this.data.shopId = list[index].shopId;

    var that = this;
    wx.showModal({
      title: '',
      content: "确定删除此订单吗?",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.requestDelOrder(function (data) {
            if (data) {
              that.onShow();
            }
          })
        }
      }
    })
  },

  onTapCancel: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.orderList;
    this.data.oid = list[index].oid;
    this.data.shopId = list[index].shopId;

    var that = this;
    wx.showModal({
      title: '',
      content: "确定取消此订单吗?",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.requestDelOrder(function (data) {
            if (data) {
              that.onShow();
            }
          })
        }
      }
    })
  },
  onTapPay: function (e) {

    var index = e.currentTarget.dataset.index;
    var list = this.data.orderList;
    this.data.oid = list[index].oid;
    this.data.shopId = list[index].shopId;

    this.handleRequestPayInfo();
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

            //刷新订单列表
            that.handleRefreshOrderList();

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

  handleRefreshOrderList: function (e) {
    this.onShow();
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


})