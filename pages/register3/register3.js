// pages/register3/register3.js
const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const BindingCardUrl = require('../../utils/config.js').HttpConfig.BindingCardUrl;
const Message = require('../../utils/util.js').Message;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleId: '',
    secret: '',
    secretAgain: '',
    isFocusFirst: true,
    isFocusAgain: true,
    showSecretFlag: '1' // 1 显示首次密码 2 显示二次密码
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
  register: function () {
    let that = this
    if(!that.data.peopleId) {
      wx.showToast({
        title: '人员信息获取异常!',
        icon: 'none'
      });
      return false
    }
    if(!that.data.secret) {
      wx.showToast({
        title: '请设置密码!',
        icon: 'none'
      });
      return false
    }
    const params = {}
    params.peopleId = that.data.peopleId
    params.secret = that.data.secret

    Message.Loading.loadingDefault();
    HttpClient.Method.get(BindingCardUrl.setSecret, params , function (res) {
      Message.Loading.close()
      if(res.data.flag){
        //登录成功 返回用户信息 res.data.data
        wx.showToast({
          title: '密码设置成功!',
          icon: 'none',
          duration: 1000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/registerSuccess/registersuccess'
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
  pwdFirst(e) {
    let that = this
    let reg = /[^\d]/g
    that.setData({
      secret: e.detail.value.replace(reg, '')
    })
    if( that.data.secret.length === 6){
      // 展示二次密码
      that.setData({
        showSecretFlag: '2'
      })
    }
  },
  pwdAgain(e) {
    let that = this
    let reg = /[^\d]/g
    that.setData({
      secretAgain: e.detail.value.replace(reg, '')
    })
    if( that.data.secretAgain.length === 6){
      if(that.data.secretAgain === that.data.secret){
        that.register()
      }else{
        wx.showToast({
          title: '两次密码不一致,请重新输入',
          icon: 'none',
          duration: 2000
        });
        // 隐藏二次密码，显示首次密码
        that.setData({
          showSecretFlag: '1',
          secret: '',
          secretAgain: ''
        })
      }
    }
  },
  getFocusFirst() {
    this.setData({
      isFocusFirst: true
    })
  },
  getFocusAgain() {
    this.setData({
      isFocusAgain: true
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