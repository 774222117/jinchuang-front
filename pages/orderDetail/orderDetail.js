const app = getApp()
//查询订单Url
const SearchOrderInfoUrl = require('../../utils/config.js').HttpConfig.OrderUrl.searchOrderInfoUrl
const Message = require('../../utils/util.js').Message
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    peopleId: 0,
    orderInfo: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let peopleId = -1
    let orderId = -1
    if (app.globalData.userInfo != undefined) {
      peopleId = app.globalData.userInfo.id
    }
    if (options.orderId != undefined) {
      orderId = options.orderId
    }
    this.setData({
      orderId: orderId,
      peopleId: peopleId
    })
    this.searchOrderInfo()
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

  searchOrderInfo: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    wx.request({
      url: SearchOrderInfoUrl,
      data: {
        peopleId: this.data.peopleId,
        orderId: this.data.orderId
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
      success: function (res) {
        wx.hideLoading()
        if (!res.data.flag) {
          Message.Alert.alertDefault(res.data.message)
          return
        }
        if (res.data.data) {
          let status = res.data.data.status
          res.data.data.showRefund = false;
          res.data.data.showPay = false;
          res.data.data.showState = false;
          if (status > 0 && status < 4 && res.data.data.afterStatus == 'NO') {
            res.data.data.showRefund = true;
            res.data.data.showState = true;
          }
          res.data.data.showPay = status == 0;
        }
        that.setData({
          orderInfo: res.data.data
        })
        console.log(that.data.orderInfo)
      }
    })
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
  copyNum(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.num, //要复制的字段
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  toExpressInfo:function(e){
    let expressNumber = e.currentTarget.dataset.expressnumber
    let goods = e.currentTarget.dataset.item
    console.log(goods)
    wx.navigateTo({
      url: '/pages/expressInfo/expressInfo?expressNumber='+expressNumber+'&orderId='+this.data.orderId+'&goodsId='+goods.id,
    })
  },
  /**
   * 商品详情
   */
  gotoDetails(e) {
    let id = e.currentTarget.dataset.id
    let orderType = e.currentTarget.dataset.ordertype
    let url = ''
    if(orderType==1){
      url = '/pages/goodsDetail/goodsDetail?id='+id
    }else if( orderType == 0){
      //电子卡
      url='/pages/cardVoucherDetail/cardVoucherDetail?id='+id
    }else{
      //实体卡
      url='/pages/cardVoucherOfflineDetail/cardVoucherOfflineDetail?id='+id
    }
    wx.navigateTo({
      url:url
     })
  },
})
