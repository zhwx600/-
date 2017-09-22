// pages/center/shopselect/shopselect.js
var api = require('./../../../api.js');
var util = require('./../../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    cityData: {
    },
    nearData: {

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    if (util.isEmpty(this.data.cityData)) {
      this.requestCityListInfo(1, function (data) {

        that.setData({
          cityData: data,
        })

      })
    }
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

  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

    var index = e.detail.current;
    if (index == 0) {
      if (util.isEmpty(this.data.cityData)) {
        this.requestCityListInfo(1, function (data) {

          that.setData({
            cityData: data,
          })

        })
      }

    } else {
      if (util.isEmpty(this.data.nearData)) {
        this.requestCityListInfo(2, function (data) {

          that.setData({
            nearData: data,
          })

        })
      }
    }

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      console.log('当前已是第', e.target.dataset.current, '页');
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

    var index = e.target.dataset.current;
    if (index == 0) {
      if (util.isEmpty(this.data.cityData)) {
        this.requestCityListInfo(1, function (data) {

          that.setData({
            cityData: data,
          })

        })
      }

    } else {
      if (util.isEmpty(this.data.nearData)) {
        this.requestCityListInfo(2, function (data) {

          that.setData({
            nearData: data,
          })

        })
      }
    }

  },

  onTapNearCity: function (e) {
    var tItem = e.currentTarget.dataset.item;

    var app = getApp();
    app.globalData.shopId = tItem.shopid;
    app.globalData.shopName = tItem.shopname;

    var arr = getCurrentPages();
    for (var i in arr) {
      if (arr[i].route == 'pages/center/chome/chome') {
        arr[i].refreshShop();
      }
    }

    wx.navigateBack({

    });

  },

  onTapCity: function (e) {
    var index = e.currentTarget.dataset.index;
    var lindex = e.currentTarget.dataset.lindex;
    var tItem = e.currentTarget.dataset.item;
    console.log('city info', e);
    console.log(index, lindex, this.data.cityData.cityshop);

    console.log("21321", this.data.cityData.cityshop[lindex]);


    this.data.cityData.cityshop[lindex].citys[index].isExtend = !tItem.isExtend;



    this.setData({
      cityData: this.data.cityData
    });
  },
  onTapCityShop: function (e) {
    var tItem = e.currentTarget.dataset.item;

    var app = getApp();
    app.globalData.shopId = tItem.shopid;
    app.globalData.shopName = tItem.shopname;

    var arr = getCurrentPages();
    for (var i in arr) {
      if (arr[i].route == 'pages/center/chome/chome') {
        arr[i].refreshShop();
      }
    }

    wx.navigateBack({

    });
  },


  //ttype 1 城市店铺， 2附近便利店
  requestCityListInfo: function (ttype, cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.cityShop;
    api.requestGet({
      url: tUrl,
      data: {
        lat: getApp().globalData.latitude,
        lng: getApp().globalData.longitude,
        type: ttype,
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