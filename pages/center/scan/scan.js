// pages/center/Scan/scan.js
var api = require('./../../../api.js');
var util = require('./../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartCount: 0,
    money: 0,
    moneyStr: '0',
    currentCode: '',
    inputValue: '6914973604292',
    showModalStatus: false,
    scanGoodsInfo: {},
    willBuyCount: 1,
    cartList: [],
  },


  onTapScan: function (e) {
    var that = this;
    // //模拟器直接 请求条形码商品
    // that.requestGoodsInfo(function (data) {
    //   //有商品
    //   if (Object.keys(data).length > 0) {

    //     that.setData({
    //       scanGoodsInfo: data
    //     })

    //     // wx.showToast({
    //     //   title: JSON.stringify(data),
    //     // })
    //     that.runAnimation('open');
    //   }

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

            that.setData({
              scanGoodsInfo: data
            })

            // wx.showToast({
            //   title: JSON.stringify(data),
            // })
            that.runAnimation('open');
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

    // this.runAnimation('open');
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

    var that = this;
    //模拟器直接 请求条形码商品
    that.requestGoodsInfo(function (data) {
      //有商品
      if (Object.keys(data).length > 0) {

        that.setData({
          scanGoodsInfo: data
        })

        // wx.showToast({
        //   title: JSON.stringify(data),
        // })
        that.runAnimation('open');
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
  requestCartListInfo: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.cartList;
    api.requestGet({
      url: tUrl,
      data: {
        shopId: getApp().globalData.shopId,
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


  requestAddGoodsToCart: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.addCart;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: getApp().globalData.shopId,
        goodsInfo: {
          goodsName: this.data.scanGoodsInfo.goodsName,
          price: this.data.scanGoodsInfo.price,
          barCode: this.data.scanGoodsInfo.barCode,
          count: this.data.willBuyCount,
          specs: this.data.scanGoodsInfo.specs,
          gid: this.data.scanGoodsInfo.gid,
        },
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          console.log(tUrl, '添加成功');
          typeof cb == "function" && cb(true)

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.setData({
    //   inputValue: this.data.currentCode,
    // });
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
    this.requestCartListInfo(function (data) {
      console.log('haha', data);
      var tCount = 0;
      var tMoney = 0;
      for (var i in data) {
        tCount += data[i].goodsInfo.count;
        tMoney +=  data[i].goodsInfo.price * data[i].goodsInfo.count;
      }
      
      console.log('haha', tCount);
      that.setData({
        cartCount: tCount,
        money:tMoney,
        moneyStr:tMoney.toFixed(2),
        cartList: data
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


  onTapCancelAdd: function (e) {

    this.runAnimation('close');

  },


  onAddCount: function (e) {
    if (this.data.willBuyCount >= 10000) {

      return;
    }

    var tcount = this.data.willBuyCount;
    this.setData({
      willBuyCount: tcount + 1
    });

  },
  onDelCount: function (e) {

    if (this.data.willBuyCount <= 1) {

      return;
    }

    var tcount = this.data.willBuyCount;
    this.setData({
      willBuyCount: tcount - 1
    });

  },


  onTapAddCart: function (e) {
    this.runAnimation('close');
    var that = this;
    this.requestAddGoodsToCart(function (data) {
      //有商品
      if (data) {
        console.log('tdata',data);
        var tcount = that.data.willBuyCount + that.data.cartCount;
        var tMoney = that.data.scanGoodsInfo.price * that.data.willBuyCount + that.data.money;
        that.setData({
          cartCount: tcount,
          money: tMoney,
          moneyStr: tMoney.toFixed(2),
          willBuyCount: 1
        });
      }
    });
  },

  onTapAddCartScan: function (e) {
    this.runAnimation('close');
    var that = this;
    this.requestAddGoodsToCart(function (data) {
      //有商品
      if (data) {
        var tcount = that.data.willBuyCount + that.data.cartCount;
        var tMoney = that.data.scanGoodsInfo.price * that.data.willBuyCount + that.data.money;
        that.setData({
          cartCount: tcount,
          money: tMoney,
          moneyStr: tMoney.toFixed(2),
          willBuyCount: 1
        });
        that.onTapScan('open');
      }
    });
  },

  powerDrawer: function (e) {
    var currentStatu = "open";
    this.runAnimation(currentStatu)
  },

  runAnimation: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 300,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-200).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 300)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})