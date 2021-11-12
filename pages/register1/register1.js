const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const RegisterUrl = require('../../utils/config.js').HttpConfig.RegisterUrl;
const BindingCardUrl = require('../../utils/config.js').HttpConfig.BindingCardUrl;
const Message = require('../../utils/util.js').Message;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardNumber: '', //  卡号
    cardCheckCode: '', // 卡密码
    peopleId: '' // 用户ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      capsuleHeight: app.globalData.capsuleHeight,
      peopleId: options.peopleId
    })
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
  setCardNumberInput: function (e){
    let that = this
    that.setData({cardNumber: e.detail.value})
  },
  setCardCheckCode: function (e){
    let that = this
    that.setData({cardCheckCode: e.detail.value})
  },
  getScancode: function() {
    let that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        const params = {}
        params.peopleId = that.data.peopleId
        params.qrCode = result
        HttpClient.Method.get(BindingCardUrl.bindQRCode, params , function (res) {
          if(res.data.flag){
            wx.showToast({
              title: '绑卡成功!',
              icon: 'none',
              duration: 1000
            });
            that.toSetSecret()
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
          }
        })
      }
    })
  },
  next: function (){
    let that = this
    if(!that.data.cardNumber){
      wx.showToast({
        title: '请填写卡号!',
        icon: 'none'
      });
      return false
    }
    if(!that.data.cardCheckCode){
      wx.showToast({
        title: '请填写卡密码!',
        icon: 'none'
      });
      return false
    }
    const params = {}
    params.peopleId = that.data.peopleId
    params.cardNumber = that.data.cardNumber
    params.cardCheckCode = that.data.cardCheckCode
    Message.Loading.loadingDefault()
    wx.request({
      url: BindingCardUrl.bindCardInfo,
      dataType:'json',//返回JSON
      method:'GET',
      header: {'content-type': 'application/json'},// 默认值
      data: params,
      success(res) {
        Message.Loading.close()
        if(res.data.flag){
          wx.showToast({
            title: '绑卡成功!',
            icon: 'none',
            duration: 1000
          });
          that.toSetSecret()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
        }
      },
      fail(res) {
        // 405 不走这里
      },
      complete(res) {
        if(res.statusCode === 405){
          Message.Loading.close()
          wx.showToast({
            title: '请求被拒绝!',
            icon: 'none',
            duration: 1500
          });
        }
      }
    })
  },
  toSetSecret() {
    let that = this
    setTimeout(function () {
      wx.redirectTo({
        url: '/pages/register3/register3?peopleId=' + that.data.peopleId,
      })
    }, 1000)
  },
  back() {
    // wx.navigateTo({
    //   url: '/pages/login/login',
    // })
    wx.navigateBack({
      delta: 1
    })
  }
})