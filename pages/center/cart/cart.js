// pages/center/Cart/cart.js
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
    showModalStatus: false,
    showBagStatus: false,
    editGoodsInfo: {},
    scanGoodsInfo: {},
    willBuyCount: 1,
    willBagBuyCount: 1,
    cartList: [],
    iscart: false,
    startX: 0, //开始坐标
    startY: 0,
    bagList: [],

  },
  // onPullDownRefresh: function () {
  //   wx.stopPullDownRefresh()
  // },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
    })
    console.log('onPullDownRefresh', new Date())
    this.onLoad();
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '',
      mask: true,
    })
    this.requestCartListInfo(function (data) {
      wx.hideLoading();
      console.log('haha', data);
      var tCount = 0;
      var tMoney = 0;
      for (var i in data) {
        tCount += data[i].goodsInfo.count;
        tMoney += data[i].goodsInfo.price * data[i].goodsInfo.count;
        data[i].goodsInfo.total = (data[i].goodsInfo.price * data[i].goodsInfo.count).toFixed(2);
      }

      // data.push(data[0]);
      // data.push(data[0]);
      // data.push(data[0]);
      // data.push(data[0]);
      // data.push(data[0]);
      // data.push(data[0]);
      // data.push(data[0]);
      // data.push(data[0]);
      // data.push(data[0]);

      var list = [];
      console.log('haha', tCount);
      that.setData({
        cartCount: tCount,
        money: tMoney,
        moneyStr: tMoney.toFixed(2),
        cartList: data,
        iscart: data.length > 0 ? true : false,
      });

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


  // 点击事件
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
              scanGoodsInfo: data,
              willBuyCount: 1,
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

  onTapSettler: function (e) {
    var that = this;
    this.requestBagInfo(function (data) {
      wx.hideLoading();
      console.log('bag info', data);
      //删除其中一个 购物袋 做测试用
      // data.shoppingBagInfo.splice(2, 1)
      for (var i in data.shoppingBagInfo) {
        if (i == 0) {
          data.shoppingBagInfo[i].isselect = true;
          data.shoppingBagInfo[i].color = '#0fc1a1';
        } else {
          data.shoppingBagInfo[i].isselect = false;
          data.shoppingBagInfo[i].color = 'black';
        }



        if (i == 0) {
          data.shoppingBagInfo[i].img = './../../../images/icon-shopping-bags1@3x.png';
        } else if (i == 1) {
          data.shoppingBagInfo[i].img = './../../../images/icon-shopping-bags22@3x.png';
        } else if (i == 2) {
          data.shoppingBagInfo[i].img = './../../../images/icon-shopping-bags33@3x.png';
        }

      }

      that.setData({
        bagList: data.shoppingBagInfo,
        willBagBuyCount: 1,
        // money: tMoney,
        // moneyStr: tMoney.toFixed(2),
        // cartList: data,
        // iscart: data.length > 0 ? true : false,
      });

      if (data.shoppingBagInfo.length > 0) {
        that.runBagAnimation('open');

      } else {

      }

    });


  },

  /*------------ */

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
            wx.showToast({
              title: '获取购物车失败',
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
  requestAddGoodsToCart: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    console.log('edit', this.data.editGoodsInfo)
    var tUrl = api.api.addCart;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: getApp().globalData.shopId,
        goodsInfo: {
          goodsName: this.data.editGoodsInfo.goodsInfo.goodsName,
          price: this.data.editGoodsInfo.goodsInfo.price,
          barCode: this.data.editGoodsInfo.goodsInfo.barCode,
          count: this.data.editGoodsInfo.goodsInfo.count,
          specs: this.data.editGoodsInfo.goodsInfo.specs,
          gid: this.data.editGoodsInfo.goodsInfo.gid,
          cid: this.data.editGoodsInfo.goodsInfo.cid,
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

  requestAddScanGoodsToCart: function (cb) {

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

  requestDeleteCartGoods: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    console.log('cid', this.data.editGoodsInfo.cid)
    var tUrl = api.api.delCart;
    api.requestPost({
      url: tUrl,
      data: {
        shopId: getApp().globalData.shopId,
        cid: this.data.editGoodsInfo.goodsInfo.cid,
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
    this.requestAddScanGoodsToCart(function (data) {
      //有商品
      if (data) {
        console.log('tdata', data);

        that.onLoad();

        // var tcount = that.data.willBuyCount + that.data.cartCount;
        // var tMoney = that.data.scanGoodsInfo.price * that.data.willBuyCount + that.data.money;
        // that.setData({
        //   cartCount: tcount,
        //   money: tMoney,
        //   moneyStr: tMoney.toFixed(2),
        //   willBuyCount: 1
        // });
      }
    });
  },

  onTapAddCartScan: function (e) {
    this.runAnimation('close');
    var that = this;
    this.requestAddScanGoodsToCart(function (data) {
      //有商品
      if (data) {
        // var tcount = that.data.willBuyCount + that.data.cartCount;
        // var tMoney = that.data.scanGoodsInfo.price * that.data.willBuyCount + that.data.money;
        // that.setData({
        //   cartCount: tcount,
        //   money: tMoney,
        //   moneyStr: tMoney.toFixed(2),
        //   willBuyCount: 1
        // });

        that.onLoad();

        that.onTapScan('open');
      }
    });
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
  },




  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.cartList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cartList: this.data.cartList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.cartList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      cartList: that.data.cartList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  delCell: function (e) {
    this.data.cartList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      cartList: this.data.cartList
    })
  },







  /* 减数 */
  onTapCellDelCount: function (e) {
    console.log(e)
    //
    var index = e.currentTarget.dataset.index;
    var list = this.data.cartList;
    var eGoods = list[index];
    console.log("del count", eGoods);
    if (eGoods.goodsInfo.count <= 1) {
      return;
    }

    this.data.editGoodsInfo = eGoods;
    this.data.editGoodsInfo.goodsInfo.count = eGoods.goodsInfo.count - 1;

    var that = this;
    this.requestAddGoodsToCart(function (success) {
      //有商品
      if (success) {
        console.log('tdata', success);

        eGoods.goodsInfo.count = that.data.editGoodsInfo.goodsInfo.count;

        var tCount = 0;
        var tMoney = 0;
        for (var i in list) {
          tCount += list[i].goodsInfo.count;
          tMoney += list[i].goodsInfo.price * list[i].goodsInfo.count;
          list[i].goodsInfo.total = (list[i].goodsInfo.price * list[i].goodsInfo.count).toFixed(2);
        }
        console.log('money = ', tMoney);
        that.setData({
          cartCount: tCount,
          money: tMoney,
          moneyStr: tMoney.toFixed(2),
          cartList: list,
          iscart: list.length > 0 ? true : false,
        });
      }
    });

  },
  /* 加数 */
  onTapCellAddCount: function (e) {
    console.log(e)
    //
    var index = e.currentTarget.dataset.index;
    var list = this.data.cartList;
    var eGoods = list[index];
    console.log("del count", "index", index, eGoods);
    if (eGoods.goodsInfo.count >= 10000) {
      return;
    }

    this.data.editGoodsInfo = eGoods;
    this.data.editGoodsInfo.goodsInfo.count = eGoods.goodsInfo.count + 1;

    var that = this;
    this.requestAddGoodsToCart(function (success) {
      //有商品
      if (success) {
        console.log('tdata', success);

        eGoods.goodsInfo.count = that.data.editGoodsInfo.goodsInfo.count;

        var tCount = 0;
        var tMoney = 0;
        for (var i in list) {
          tCount += list[i].goodsInfo.count;
          tMoney += list[i].goodsInfo.price * list[i].goodsInfo.count;
          list[i].goodsInfo.total = (list[i].goodsInfo.price * list[i].goodsInfo.count).toFixed(2);
        }
        console.log('money = ', tMoney);
        that.setData({
          cartCount: tCount,
          money: tMoney,
          moneyStr: tMoney.toFixed(2),
          cartList: list,
          iscart: list.length > 0 ? true : false,
        });
      }
    });
  },
  /* 删除item */
  onTapDelCell: function (e) {

    console.log(e)
    //
    var index = e.currentTarget.dataset.index;
    var list = this.data.cartList;
    var eGoods = list[index];

    if (eGoods.count <= 1) {
      return;
    }
    var that = this;
    wx.showModal({
      title: '',
      content: "确定删除此商品？",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {

          that.data.editGoodsInfo = eGoods;

          that.requestDeleteCartGoods(function (success) {
            //有商品
            if (success) {
              console.log('tdata', success);

              eGoods.goodsInfo.count = that.data.editGoodsInfo.goodsInfo.count;

              list.splice(index, 1);
              var tCount = 0;
              var tMoney = 0;
              for (var i in list) {
                tCount += list[i].goodsInfo.count;
                tMoney += list[i].goodsInfo.price * list[i].goodsInfo.count;
                list[i].goodsInfo.total = (list[i].goodsInfo.price * list[i].goodsInfo.count).toFixed(2);
              }
              console.log('money = ', tMoney);
              that.setData({
                cartCount: tCount,
                money: tMoney,
                moneyStr: tMoney.toFixed(2),
                cartList: list,
                iscart: list.length > 0 ? true : false,
              });
            }
          });
        }
      }
    });


  },



  // 购物袋选择页面

  onTapBagSelect: function (e) {

    var index = e.currentTarget.dataset.index;
    console.log('index', index, e);
    for (var i in this.data.bagList) {
      if (i == index) {
        this.data.bagList[i].isselect = true;

        if (i == 0) {
          this.data.bagList[i].img = './../../../images/icon-shopping-bags1@3x.png';
        } else if (i == 1) {
          this.data.bagList[i].img = './../../../images/icon-shopping-bags2@3x.png';
        } else if (i == 2) {
          this.data.bagList[i].img = './../../../images/icon-shopping-bags3@3x.png';
        }
        this.data.bagList[i].color = '#0fc1a1';

      } else {
        this.data.bagList[i].isselect = false;
        this.data.bagList[i].color = 'black';

        if (i == 0) {
          this.data.bagList[i].img = './../../../images/icon-shopping-bags11@3x.png';
        } else if (i == 1) {
          this.data.bagList[i].img = './../../../images/icon-shopping-bags22@3x.png';
        } else if (i == 2) {
          this.data.bagList[i].img = './../../../images/icon-shopping-bags33@3x.png';
        }
      }

    }
    console.log('bagList', this.data.bagList);


    var that = this;
    this.setData({
      bagList: that.data.bagList,
      // money: tMoney,
      // moneyStr: tMoney.toFixed(2),
      // cartList: data,
      // iscart: data.length > 0 ? true : false,
    });

  },


  onBagAddCount: function (e) {
    if (this.data.willBagBuyCount >= 10000) {

      return;
    }

    var tcount = this.data.willBagBuyCount;
    this.setData({
      willBagBuyCount: tcount + 1
    });

  },
  onBagDelCount: function (e) {

    if (this.data.willBagBuyCount <= 1) {

      return;
    }

    var tcount = this.data.willBagBuyCount;
    this.setData({
      willBagBuyCount: tcount - 1
    });

  },


  onTapSureBag: function (e) {
    this.runBagAnimation('close');

    var index = 0;
    for (var i in this.data.bagList) {
      if (this.data.bagList[i].isselect) {
        index = i;
        break;
      }

    }
    var tempBag = this.data.bagList[index];
    tempBag.count = this.data.willBagBuyCount;
    this.data.editGoodsInfo.goodsInfo = tempBag;
    console.log('tempBag', tempBag);

    var that = this;
    this.requestAddGoodsToCart(function (data) {
      //有商品
      if (data) {

        wx.showLoading({
          title: '',
          mask: true,
        })
        that.requestCartListInfo(function (data) {
          wx.hideLoading();
          console.log('haha', data);
          var tCount = 0;
          var tMoney = 0;
          for (var i in data) {
            tCount += data[i].goodsInfo.count;
            tMoney += data[i].goodsInfo.price * data[i].goodsInfo.count;
            data[i].goodsInfo.total = (data[i].goodsInfo.price * data[i].goodsInfo.count).toFixed(2);
          }

          console.log('haha', tCount);
          that.setData({
            cartCount: tCount,
            money: tMoney,
            moneyStr: tMoney.toFixed(2),
            cartList: data,
            iscart: data.length > 0 ? true : false,
          });

          wx.navigateTo({
            url: '../settle/settle',
          })

        });

      }
    });



  },
  onTapCancelBag: function (e) {
    this.runBagAnimation('close');

    wx.navigateTo({
      url: '../settle/settle',
    })
  },



  runBagAnimation: function (currentStatu) {
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
            showBagStatus: false
          }
        );
      }
    }.bind(this), 300)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showBagStatus: true
        }
      );
    }
  },


  requestBagInfo: function (cb) {

    wx.showLoading({
      title: '',
      // mask: true,
    })
    var tUrl = api.api.bagInfo;
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
            wx.showToast({
              title: '获取购物袋失败',
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

})


