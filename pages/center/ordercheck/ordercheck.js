// pages/center/ordercheck/ordercheck.js
var api = require('./../../../api.js');
var util = require('./../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    oid: '',
    shopId: '',
    orderInfo: {}
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
      that.setData({
        orderInfo: data
      });

      if (util.isEmpty(data)) {
        wx.showLoading({
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
console.log('click',e);
    wx.getSetting({
      success(res) {
        console.log(1111);
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log(22222222);
              // 用户已经同意小程序使用
              wx.saveImageToPhotosAlbum({
                filePath: './../../../images/testCode.png',
                success: function (res) {
                  console.log('保存成功', res);
                  wx.showToast({
                    title: '保存成功',
                  })
                }, fail: function (res) {
                  console.log('保存失败', res);
                },
              })

            }
          })
        }else{
          wx.saveImageToPhotosAlbum({
            filePath: './../../../images/testCode.png',
            success: function (res) {
              console.log('保存成功', res);
              wx.showToast({
                title: '保存成功',
              })
            }, fail: function (res) {
              console.log('保存失败', res);
            },
          })
        }
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