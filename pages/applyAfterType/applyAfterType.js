// pages/applyAfterType/applyAfterType.js

const app = getApp()
const searchOrderInfoUrl = require('../../utils/config.js').HttpConfig.OrderUrl.searchOrderInfoUrl
//查询订单Url
const PageGo = require('../../utils/util.js').PageGo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    peopleId: 0,
    orderInfo: '',
    goodsItems: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      peopleId: app.globalData.userInfo.id,
      orderId: options.orderId
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

  //自定义方法
  /**
   * 查询订单
   */
  searchOrderInfo: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    wx.request({
      url: searchOrderInfoUrl,
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
          wx.showToast({
            title: res.data.message || '查询订单出错！',
            icon: 'none'
          });
          return
        }

        /**
         * 循环商品
         */
        res.data.data.goodsItems.forEach((item) => {
          //设置退货数量为零
          item.quantity = 0
        });
        that.setData({
          orderInfo: res.data.data,
          goodsItems: res.data.data.goodsItems
        })
      }
    })
  },

  /**
   * 添加退货
   */
  addRefund(e) {
    let goods = e.currentTarget.dataset.item
    //订单购买数量
    let total = goods.total
    //退货数量
    let quantity = goods.quantity + 1
    if (quantity > total) {
      return
    }
    goods.quantity = quantity
    let goodsItems = this.data.goodsItems
    goodsItems.forEach((item) => {
      if (item.goodsId == goods.goodsId && item.id==goods.id) {
        item.quantity = goods.quantity
      }
    })
    this.setData({
      goodsItems: goodsItems,
    })
  },

  /**
   * 减少退货
   */
  delRefund(e) {
    let goods = e.currentTarget.dataset.item
    //退货数量
    let quantity = goods.quantity - 1
    if (quantity < 0) {
      return
    }
    goods.quantity = quantity
    let goodsItems = this.data.goodsItems
    goodsItems.forEach((item) => {
      if (item.goodsId == goods.goodsId && item.id==goods.id) {
        item.quantity = goods.quantity
      }
    })
    this.setData({
      goodsItems: goodsItems,
    })
  },
  /**
   * 选择服务类型
   */
  gotoNext(e) {
    let total = 0
    let goods = {}
    let goodsList = []
    this.data.goodsItems.forEach((item) => {
      total += item.quantity
      if (item.quantity != 0) {
        goods = {
          id: item.id,
          total: item.quantity
        }
        goodsList.push(goods)
      }
    })
    if (total == 0) {
      wx.showToast({
        title: '请添加退款商品！',
        icon: 'none'
      })
    } else {
      PageGo.jump('/pages/applyAfterOrder/applyAfterOrder', {
        applyType: e.currentTarget.dataset.applytype,
        orderId: this.data.orderId,
        goods: JSON.stringify(goodsList)
      })
    }
  }
})