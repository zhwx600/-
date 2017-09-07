// pages/center/Scan/scan.js
var api = require('./../../../api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartCount: 1,
    money: 30,
    currentCode: '6914973604292',
    inputValue: '',
    showModalStatus: false,
scanGoodsInfo:{},
willBuyCount: 1,
  },


  onTapScan: function (e) {
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
    return;


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

    // wx.navigateTo({
    //   url: '../cart/cart',
    // })

    this.runAnimation('open');
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
    this.requestGoodsInfo(function (data) {
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

  },


onTapCancelAdd:function(e){

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

    if (this.data.willBuyCount <= 1){

      return;
    }

    var tcount = this.data.willBuyCount;
    this.setData({
      willBuyCount: tcount-1
    });

},


  onTapAddCart:function(e){
    this.runAnimation('close');

  },

  onTapAddCartScan:function(e){
    this.runAnimation('close');
    this.onTapScan();
  },

  powerDrawer: function (e) {
    var currentStatu = "open";
    this.runAnimation(currentStatu)
  },

  runAnimation: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
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
    }.bind(this), 200)

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