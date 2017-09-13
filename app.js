var api = require('./api.js');

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var pages = getCurrentPages();
    var page = pages[(pages.length - 1)];

    this.globalData.firstPage = page;



    //console.log(page);
    wx.showLoading({
      title: "正在登录",
      mask: true,
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login info code', res.code)

        if (res.code) {
          var code = res.code;
          wx.getUserInfo({
            success: res => {

              console.log('wx info', res.userInfo)

              this.loginServer({
                'username': this.globalData.mUserInfo.uid,
                'nickname': res.userInfo.nickName,
                'source': 1,
                'pic': res.userInfo.avatarUrl,
                'openid': this.globalData.mUserInfo.openId
              });

            }
          })
        }

      }
    })


  },


  loginServer: function (object) {


    var that = this
    console.log('api43435', api)
    console.log('url', api.api.loginUrl)
    api.requestPost({
      url: api.api.loginUrl,
      data: object,
      success: function (res) {

        if (res.code == 200) {
          var detail = res.data.detail;

          console.log('登录成功11', res.data);
          // 可以将 res 发送给后台解码出 unionId


          that.globalData.userInfo = res.data;

          wx.setStorageSync("Authorization", res.data.token);

          // that.globalData.mUserInfo.openid = res.data.openid;
          // that.globalData.mUserInfo.openId = res.data.openid;

          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res.data)
          }

          console.log('server info', that.globalData.userInfo);
          wx.showToast({
            title: '登录成功',
          })

//重新刷新首页，以便于数据保证正确
          if (that.firstPage == undefined)
            return;
            wx.redirectTo({
              url: './pages/center/chome/chome',
            })

        }

      },
      fail: function (res) {
        console.log('登录fail', res);

        wx.showModal({
          title: '',
          content: "登录失败,请重试",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // wx.switchTab({
              //   url: "/pages/index/index"
              // });
            }
          }
        });

      }
    });


  },

  getUserInfo: function (cb) {
    var that = this
    console.log(112)
    if (this.globalData.nuserInfo.openid) {
      console.log(113)
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      console.log(114)
      //调用登录接口

      api.requestGet({
        url: api.api.userInfoUrl,
        data: {},
        success: function (res) {

          if (res.code == 200) {
            console.log('获取用户信息成功', res.data);
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.data;
            that.globalData.nuserInfo = res.data;

            typeof cb == "function" && cb(that.globalData.userInfo)

          }

        },
        fail: function (res) {
          console.log('获取用户信息失败', res.data);

        }
      });
    }
  },

  globalData: {
    userInfo: {
    },
    mUserInfo: {
      openId: 'o8aKewkcdNx1ei0nWisWRGAYsfmw',
      uid: 'ojR6bwRzeSRR4zHfcgJKIwwnvrWE',

    },
    nuserInfo: {
    },
    shopId:'5992b8825a8e730418638009',//湖里沃尔玛
    shopName: '湖里沃尔玛',//湖里沃尔玛
    firstPage: null,
  },

})




//请求模板

// requestGoodsInfo: function (cb) {

//   wx.showLoading({
//     title: '',
//     // mask: true,
//   })
//   var tUrl = api.api.barcodeGoods;
//   api.requestGet({
//     url: tUrl,
//     data: {
//       shopId: getApp().globalData.shopId,
//       barCode: this.data.currentCode,
//     },
//     success: function (res) {
//       wx.hideLoading();
//       if (res.code == 200) {
//         console.log(tUrl, '请求成功', res.data);
//         typeof cb == "function" && cb(res.data)

//       } else {
//         console.log(tUrl, '请求失败', res.code, res.data);
//         typeof cb == "function" && cb()
//       }

//     },
//     fail: function (res) {
//       {
//         wx.hideLoading();
//         console.log(tUrl, '网络请求失败', res.code);
//         typeof cb == "function" && cb()
//       }

//     }
//   });

// },

