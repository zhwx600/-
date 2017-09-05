// pages/center/Scan/scan.js
var api = require('./../../../api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartCount: 2,
    money: 30,
    currentCode: '6914973604292',
    inputValue: '',
  },


  onTapScan: function (e) {
    var that = this;
    //模拟器直接 请求条形码商品
    // that.requestGoodsInfo(function (data) {
    //   if (Object.keys(data).length == 0) { 
    //         console.log('data 数据', 11111111);
    //        }else{

    //         console.log('data 数据', 11112222);
    //        }

    // });
    // return;


    // 只允许从相机扫码
    wx.scanCode({
      // onlyFromCamera: true,
      success: function (res) {

        that.setData({
          currentCode: res.result
        })

        console.log('当前条形码为:', that.data.currentCode);
        that.requestGoodsInfo(function (data) {
          //有商品
          if (Object.keys(data).length > 0) {
            wx.showToast({
              title: JSON.stringify(data),
            })
          }
        });

      },
      fail: function (res) {
      }

    })

  },

  onTapCart: function (e) {

    wx.navigateTo({
      url: '../cart/cart',
    })
  },


  onTapQuery: function (e) {

    if (this.data.inputValue.length == 0) {
      wx.showToast({
        title: '条码不能为空',

      })
      return;
    }

    this.setData({
      currentCode: this.data.inputValue,
    })

    this.requestGoodsInfo(function (data) {
      //有商品
      if (Object.keys(data).length > 0) {
        wx.showToast({
          title: JSON.stringify(data),
        })
      }
    });
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  requestGoodsInfo: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.barcodeGoods;
    api.requestGet({
      url: tUrl,
      data: {
        shopId: getApp().globalData.shopId,
        barCode: this.data.currentCode,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '请求成功', res.data);
          typeof cb == "function" && cb(res.data)

          if (Object.keys(res.data).length == 0) {
            wx.showToast({
              title: '没有找到该商品信息',
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