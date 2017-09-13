// pages/center/settle/settle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var arr = getCurrentPages();
    console.log("page arr", arr);

    //arr[arr.length - 2].__route__ 也可以
    if (arr[arr.length - 2].route == 'pages/center/cart/cart') {
      this.setData({
        cartList: arr[arr.length - 2].data.cartList,
      })
    }
    console.log("settle cart", this.data.cartList);
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