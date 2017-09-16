// pages/center/settle/settle.js
var api = require('./../../../api.js');
var util = require('./../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    shopName: '',
    cartCount: 0,
    money: 0,
    moneyStr: "0",
    orderId: '',
    payInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var arr = getCurrentPages();
    console.log("page arr", arr);

    var tcarList = [];
    //arr[arr.length - 2].__route__ 也可以
    if (arr[arr.length - 2].route == 'pages/center/cart/cart') {
      tcarList = arr[arr.length - 2].data.cartList;
    }
    console.log("settle cart", tcarList);

    var tCount = 0;
    var tMoney = 0;
    for (var i in tcarList) {
      tCount += tcarList[i].goodsInfo.count;
      tMoney += tcarList[i].goodsInfo.price * tcarList[i].goodsInfo.count;
      tcarList[i].goodsInfo.total = (tcarList[i].goodsInfo.price * tcarList[i].goodsInfo.count).toFixed(2);
    }
    this.setData({
      cartCount: tCount,
      money: tMoney,
      moneyStr: tMoney.toFixed(2),
      cartList: tcarList,
      shopName: getApp().globalData.shopName
    });

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

  onTapSettler: function (e) {
    if (util.isEmpty(this.data.orderId)) {
      var that = this;
      this.requestSubmitOrderInfo(function (data) {
        if (!util.isEmpty(data)) {

          that.setData({
            orderId: data
          })
          that.handleRequestPayInfo();

        } else {

          wx.showToast({
            title: '提交订单失败',
          })
        }

      });

    } else {

      this.handleRequestPayInfo();
    }

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
                wx.redirectTo({
                  url: '../orderdetail/orderdetail',
                });
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
            var oid = that.data.orderId;
            var shopId = getApp().globalData.shopId;
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
      if (arr[i].route == 'pages/center/cart/cart') {
        arr[i].onLoad();
      }
      else if (arr[i].route == 'pages/center/scan/scan') {
        arr[i].onShow();
      }
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
        shopId: getApp().globalData.shopId,
        oid: this.data.orderId,
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

  //编辑购物车
  requestSubmitOrderInfo: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var goodsList = [];
    for (var i in this.data.cartList) {
      goodsList.push(this.data.cartList[i].goodsInfo);
    }

    var tUrl = api.api.submitOrder;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: getApp().globalData.shopId,
        goodsInfo: goodsList
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '添加成功');
          typeof cb == "function" && cb(res.data.oid)

        } else {
          console.log(tUrl, '添加失败', res.code, res.data);
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
        shopId: getApp().globalData.shopId,
        oid: this.data.orderId,
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
})