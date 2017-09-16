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
    codeimg: 'https://img.dd528.com/images/barcode/49401219/49401219.jpg'
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
  onTapCode: function (e) {

  },
  onTapOrder: function (e) {

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
})