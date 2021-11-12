const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const Message = require('../../utils/util.js').Message;
const SendCodeUrl = require('../../utils/config.js').HttpConfig.SendCodeUrl;
const SetSecretUrl = require('../../utils/config.js').HttpConfig.SetSecretUrl;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    time: '获取验证码', //倒计时 
    currentTime: 60,
    phone: "",
    phoneTitle: "",
    veriCode: '',
    firstValue: '',
    secondValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: app.globalData.userInfo.phone
    })
    if(options.type == 0){
      wx.showToast({
        title: '请先设置支付密码',
        icon: 'none'
      })
      wx.setNavigationBarTitle({
        title: '设置密码' 
      })
    }
    else{
      wx.setNavigationBarTitle({
        title: '找回密码' 
      })
    }
    let phoneTitle = this.data.phone + ''
    if (phoneTitle != '') {
      phoneTitle = phoneTitle.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
      this.setData({
        phoneTitle: phoneTitle
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  codeInput: function (e) {
    this.setData({
      veriCode: e.detail.value
    })
  },
  firstInput: function (e) {
    this.setData({
      firstValue: e.detail.value
    })
  },
  secondInput: function (e) {
    this.setData({
      secondValue: e.detail.value
    })
  },
  confirmBtn: function () {
    let first = this.data.firstValue
    let second = this.data.secondValue
    let that = this
    let peopleId = -1
    if (app.globalData.userInfo != undefined) {
      peopleId = app.globalData.userInfo.id
    }
    console.log(peopleId)

    if (first.length != 6 || second.length != 6) {
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
      HttpClient.Method.get(SetSecretUrl.RetrievePwdUrl, {
        peopleId: peopleId,
        code: that.data.veriCode,
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

  getVeriCode: function () {
    var that = this;
    var currentTime = that.data.currentTime
    if(that.data.disabled){
      return
    }

    Message.Loading.loadingDefault()
    HttpClient.Method.get(SendCodeUrl.ModifyPsUrl, {
      phone: that.data.phone
    }, function (res) {
      Message.Loading.close()
      console.log(res)
      if (res.data.flag) {
        console.log(res)
        that.setData({
          time: '倒计时' + currentTime + '秒'
        })
        let interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: '倒计时' + currentTime + '秒'
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              time: '重新发送',
              currentTime: 60,
              disabled: false
            })
          }
        }, 1000)

        that.setData({
          disabled: true
        })
      }
    })
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