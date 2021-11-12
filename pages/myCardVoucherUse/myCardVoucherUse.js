// pages/myCardVoucherUse/myCardVoucherUse.js
const app = getApp()
// 码子
const barcode = require('../../utils/barcode/index.js');
const getDataUrl = require('../../utils/config.js').HttpConfig.myCardVoucherUse.getDataUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleId: 0,
    id: -1,
    cardInfo: {},
    qrCodeExp: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let peopleId = -1
    if (app.globalData.userInfo != undefined) {
      peopleId = app.globalData.userInfo.id
    }
    this.setData({
      peopleId: peopleId,
      id: options.id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData(this.data.id)

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
   * 获取数据
   */
  getData(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    wx.request({
      url: getDataUrl,
      // method: 'post',
      data: {
        peopleId: this.data.peopleId,
        merchantCardId: Number(id)
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
            title: res.data.message,
            icon: 'none'
          });
          return
        }
        that.setData({
          cardInfo: res.data.data,
          qrCodeExp: res.data.data.qrCodeExp
        })
        if (res.data.data) {
          //条码        
          barcode.barcode('barcode', res.data.data.qrcode, 530, 150);
          //二维码
          barcode.qrcode('barcode2', res.data.data.qrcode, 210, 210);
        }
        var timerTem = setTimeout(function () {
          that.getData(that.data.id)
        }, that.data.qrCodeExp*1000)
      }
    })
  }
})