// pages/register2/register2.js
const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const RegisterUrl = require('../../utils/config.js').HttpConfig.RegisterUrl;
const Message = require('../../utils/util.js').Message;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardNumber: '',
    phone: '',
    code: '',
    sendCodeText:'获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      capsuleHeight: app.globalData.capsuleHeight,
      cardNumber: options.cardNumber
    })
    // this.setData({cardNumber: '1100044122'})
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
  setPhoneInput: function (e) {
    let that = this
    that.setData({phone: e.detail.value})
  },
  setCodeInput: function (e) {
    let that = this
    that.setData({code: e.detail.value})
  },
  setCardCheckCode: function (e) {
    let that = this
    that.setData({cardCheckCode: e.detail.value})
  },
  sendCode: function (){
    let that = this
    if(!that.data.phone){
      wx.showToast({
        title: '请填写手机号!',
        icon: 'none'
      });
      return false
    }
    const params = {}
    params.phone = that.data.phone
    let time = 60
    Message.Loading.loadingMessage("发送中...")
    HttpClient.Method.get(RegisterUrl.SendCodeForRegister, params , function (res) {
      Message.Loading.close();
      if(res.data.flag){
        wx.showToast({
          title: '发送成功!',
          icon: 'none',
          duration: 1000
        });
        let timer = setInterval(function () {
          time--
          if (time <= 0) {
            that.setData({
              sending: false,
              sendCodeText: '重新发送'
            })
            clearInterval(timer)
            return
          }
          let text = '重新发送(' + time + ')'
          that.setData({
            sending: true,
            sendCodeText: text
          })
        }, 1000)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        });
      }
    })
  },
  next: function (){
    let that = this
    if(!that.data.phone){
      wx.showToast({
        title: '请填写手机号!',
        icon: 'none'
      });
      return false
    }
    if(!that.data.code){
      wx.showToast({
        title: '请填写验证码!',
        icon: 'none'
      });
      return false
    }
    const params = {}
    params.phone = that.data.phone
    params.code = that.data.code
    HttpClient.Method.get(RegisterUrl.VailCodeForRegister, params , function (res) {
      if(res.data.flag){
        wx.showToast({
          title: '验证成功!',
          icon: 'none',
          duration: 1000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/register3/register3?cardNumber=' + that.data.cardNumber+ "&phone=" + that.data.phone,
          })
        }, 1000)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        });
      }
    })
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