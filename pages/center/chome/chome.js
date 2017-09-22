// chome.js

var app = getApp();
var api = require('./../../../api.js');
var util = require('./../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // open: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '',
    userInfo: {
      pic: './../../../images/guide-map@3x.png',
      nickname: '',
    },
    shopTitle: '切换店铺',
  },
  tap_ch: function (e) {
    if (this.data.staus == 2) {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      // this.data.open = false;
      this.data.staus = 1;
      console.log('---------------');
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
      })
      // this.data.open = true;
      this.data.staus = 2;
      console.log('***************');
    }
  },
  tap_start: function (e) {
    if (e.target.id == "headicon1" || e.target.id == "headicon2" || e.target.id == "headicon3") {
      return;
    }
    console.log(111111111111);
    console.log(e);
    this.data.mark = this.data.newmark = e.touches[0].pageX;
    if (this.data.staus == 1) {
      // staus = 1指默认状态
      this.data.startmark = e.touches[0].pageX;
    } else {
      // staus = 2指屏幕滑动到右边的状态
      this.data.startmark = e.touches[0].pageX;
    }

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })



  },
  tap_drag: function (e) {
    if (e.target.id == "headicon1" || e.target.id == "headicon2" || e.target.id == "headicon3") {
      return;
    }
    console.log(1111222222111);
    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      if (this.data.staus == 1) {
        if (this.data.windowWidth * 0.75 > Math.abs(this.data.newmark - this.data.startmark)) {
          this.setData({
            translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
          })
        }
      }

    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      if (this.data.staus == 1 && (this.data.newmark - this.data.startmark) > 0) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
        })
      } else if (this.data.staus == 2 && this.data.startmark - this.data.newmark < this.data.windowWidth * 0.75) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + this.data.windowWidth * 0.75 - this.data.startmark) + 'px)'
        })
      }

    }

    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    if (e.target.id == "headicon1" || e.target.id == "headicon2" || e.target.id == "headicon3") {
      return;
    }
    console.log(111333333333333333111);
    if (this.data.staus == 1) {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
        console.log(11144111);
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      } else {
        console.log(111555111);
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
        })
        this.data.staus = 2;
      }
    } else {
      console.log(111777111);
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.staus = 1;
      // if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
      //   console.log(111666111);
      //   this.setData({
      //     translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
      //   })
      //   this.data.staus = 2;
      // } else {
      //   console.log(111777111);
      //   this.setData({
      //     translate: 'transform: translateX(0px)'
      //   })
      //   this.data.staus = 1;
      // }
    }

    this.data.mark = 0;
    this.data.newmark = 0;
  },
  onTapCart: function (e) {

    console.log("cart tap", e)
    wx.navigateTo({
      url: '../cart/cart',
    })
    // wx.navigateTo({
    //   url: '../leftswipe/leftswipe',
    // })
    // wx.navigateTo({
    //   url: '../left/left',
    // })

    // var oid = '59baaddbba7c2e337ab4d0ff';
    // var shopId = '5992b8825a8e730418638009';
    // var tCheckUrl = '../ordercheck/ordercheck' + '?oid=' + oid + '&shopId=' + shopId;
    // wx.navigateTo({
    //   url: tCheckUrl,
    // });

    // var tDetailUrl = '../ordercheck/ordercheck' + '?oid=' + oid + '&shopId=' + shopId;
    // wx.navigateTo({
    //   url: tDetailUrl,
    // })



  },

  onTapScan: function (e) {

    console.log("onTapScan", e)
    wx.navigateTo({
      url: '../scan/scan',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
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

    if (!util.isEmpty(getApp().globalData.shopId)) {
      this.setData({
        shopTitle: getApp().globalData.shopName
      })
    }
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

  refreshShop: function (e) {
    this.setData({
      shopTitle: getApp().globalData.shopName
    })
  },

  refreshRequestShop: function (e) {
    var that = this;
    this.requestCityListInfo(1, function (data) {

      if (!util.isEmpty(data.nears)) {
        var tItem = data.nears[0];
        getApp().globalData.shopId = tItem.shopid;
        getApp().globalData.shopName = tItem.shopname;
        console.log("000000000000378", getApp().globalData.shopName)
        that.setData({
          shopTitle: getApp().globalData.shopName
        })
      }
    })

  },

  onTapHead: function (e) {
    this.setData({
      translate: 'transform: translateX(0px)'
    })
    this.data.staus = 1;
  },
  onTapOrder: function (e) {

    this.setData({
      translate: 'transform: translateX(0px)'
    })
    this.data.staus = 1;

    wx.navigateTo({
      url: '../orderlist/orderlist',
    });
  },
  onTapMoney: function (e) {
    this.setData({
      translate: 'transform: translateX(0px)'
    })
    this.data.staus = 1;
  },
  onTapCheck: function (e) {
    this.setData({
      translate: 'transform: translateX(0px)'
    })
    this.data.staus = 1;
  },
  onTapSetting: function (e) {
    this.setData({
      translate: 'transform: translateX(0px)'
    })
    this.data.staus = 1;
  },
  onTapShop: function (e) {

    wx.navigateTo({
      url: '../shopselect/shopselect',
    })

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