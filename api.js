// var apiRoot = 'http://120.25.103.145:5501/' + 'mkps';
var apiRoot = 'https://api.lianxianzhe.com/' + 'mkps';

var api = {
  loginUrl: apiRoot + '/user/appLogIn',
  userInfoUrl: apiRoot + '/user/getUserInfo',
  barcodeGoods: apiRoot +'/goods/getGoodsInfoByBarCode',
  cartList: apiRoot + '/goodsCar/getGoodsCarInfo',
  addCart: apiRoot + '/goodsCar/addGoodsCar',
  delCart: apiRoot + '/goodsCar/delGoodsCarInfo',
  bagInfo: apiRoot + '/shoppingBig/getShoppingBagInfo',
  submitOrder: apiRoot + '/order/createOrder',
  payInfo: apiRoot + '/order/wxAppletPay',
  paySuccess: apiRoot + '/order/paySuccess',
  orderInfo: apiRoot +'/order/getOrderById',
  delOrder: apiRoot +'/order/delOrder',
  orderList: apiRoot +'/order/getOrdersByPages',
  orderQRCode: apiRoot + '/order/createOrderQRcode',
  cityShop: apiRoot +'/markets/getMaketInfo',
};


function requestGet(object) {
  object.method = 'GET';
  request(object);

}

function requestPost(object) {
  object.method = 'POST';
  request(object);

}

function request(object) {
  {
    wx.request({
      url: object.url,
      header: object.header || {
        'content-type': 'application/json;charset=utf-8',
        'Authorization': 'Bearer '+wx.getStorageSync('Authorization'),
      },
      data: object.data || {},
      method: object.method || "GET",
      dataType: object.dataType || "json",

      success: function (res) {
        if (object.success)
          object.success(res.data);
      },
      fail: function (res) {
        if (object.fail)
          object.fail(res);
      },
      complete: function (res) {
        if (object.complete)
          object.complete(res);
      }
    });
  }


}

module.exports = {

  api: api,
  requestGet: requestGet,
  requestPost: requestPost

};