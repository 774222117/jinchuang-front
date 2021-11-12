// pages/editPassword/editPassword.js
const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const Message = require('../../utils/util.js').Message;
const SetSecretUrl = require('../../utils/config.js').HttpConfig.SetSecretUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassWord: '',
    firstValue: '',
    secondValue: ''
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
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  oldInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      oldPassWord: value
    })
  },
  firstInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      firstValue: value
    })
  },
  secondInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      secondValue: value
    })
  },
  confirmBtn: function () {
    let oldPassWord = this.data.oldPassWord
    let first = this.data.firstValue
    let second = this.data.secondValue
    let that = this
    let peopleId = -1
    if (app.globalData.userInfo != undefined) {
      peopleId = app.globalData.userInfo.id
    }
    if (oldPassWord.length != 6) {
      wx.showToast({
        title: '旧密码位数不足',
        icon: 'none'
      })
    } else if (first.length != 6 || second.length != 6) {
      wx.showToast({
        title: '新密码位数不足',
        icon: 'none'
      })
      return
    } else if (first != second) {
      wx.showToast({
        title: '两次密码不一样',
        icon: 'none'
      })
    } else {
      Message.Loading.loadingDefault()
      HttpClient.Method.get(SetSecretUrl.EditPwdUrl, {
        peopleId: peopleId,
        oldSecret: that.data.oldPassWord,
        secret: that.data.secondValue
      }, function (res) {
        Message.Loading.close()
        console.log(res)
        if (res.data.flag) {
          wx.navigateBack({
            delta: 1, //返回的层数
            complete() {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                mask: true,
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
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