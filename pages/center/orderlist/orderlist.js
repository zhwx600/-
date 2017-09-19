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


})