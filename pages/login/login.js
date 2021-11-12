//获取应用实例
const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const LoginUrl = require('../../utils/config.js').HttpConfig.LoginUrl;
const div = require('../../utils/util.js').div;
const Message = require('../../utils/util.js').Message;
const PageGo = require('../../utils/util.js').PageGo;
Page({
  data: {
    //以下注册所需要的信息
    openId: "",
    sessionKey: "",
    userData: {},
    encryptedData: "",
    iv: "",
    phone: "",
    msgCode: "",
    sendCodeText: '获取验证码',
    isShow: true,
    target: '',
  },
  onLoad: function (options) {
    // 判断用户信息存在与否
    if (app.globalData.userInfo) {
      
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    this.setData({
      target: options.target,
      navH: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      capsuleHeight: app.globalData.capsuleHeight
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
  setPhoneInput: function (e) {
    let that = this
    that.setData({
      phone: e.detail.value
    })
  },
  setCodeInput: function (e) {
    let that = this
    that.setData({
      msgCode: e.detail.value
    })
  },
  sendCode: function () {
    let that = this
    if (!that.data.phone) {
      wx.showToast({
        title: '请填写手机号!',
        icon: 'none'
      });
      return false
    }
    if(that.data.sending){
      return
    }
    const params = {}
    params.phone = that.data.phone
    let time = 60
    Message.Loading.loadingMessage("发送中...")
    HttpClient.Method.get(LoginUrl.sendCodeForLoginAndRegister, params, function (res) {
      Message.Loading.close();
      if (res.data.flag) {
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
  phoneLogin: function (loginAndRegisterInfo) {
    let that = this
    //登录 并获取人员信息
    loginAndRegisterInfo.phone = that.data.phone
    loginAndRegisterInfo.code = that.data.msgCode
    HttpClient.Method.get(LoginUrl.PhoneLogin, loginAndRegisterInfo, function (res) {
      if (res.data.flag) {
        //登录成功 返回用户信息 res.data.data
        app.setUserInfo(res.data.data)
        let operationType = res.data.data.operationType
        let peopleId = res.data.data.id
        if(operationType === 0){
          wx.showToast({
            title: '登录成功!',
            icon: 'none',
            duration: 1000
          });
          if (that.data.target) {
            wx.redirectTo({
              url: that.data.target,
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        } else{
          wx.showToast({
            title: '注册成功!',
            icon: 'none',
            duration: 1000
          });
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/register1/register1?peopleId=' + peopleId
            })
          }, 1000)
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        return
      }
    })
  },
  /**
   * 获取手机号
   */
  getPhoneNumber(e) {
    var that = this
    if (e.detail.encryptedData) {
      if (!that.data.isShow) {
        wx.showToast({
          title: '请先阅读并同意协议',
          icon: 'none'
        })
        return
      }
      this.setData({
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      })
      this.wechatLogin()
    }
  },
  //授权手机号登录
  wechatLogin: function () {
    let that = this
    Message.Loading.loadingDefault()
    wx.login({
      success: res => {
        HttpClient.Method.get(LoginUrl.GetWechatSessionKey, {
          code: res.code
        }, function (res) {
          Message.Loading.close();
          if (res.data.flag) {
            that.setData({
              openId: res.data.data.openId,
              sessionKey: res.data.data.sessionKey,
            })
            //登录 并获取用户信息
            HttpClient.Method.get(LoginUrl.WechatLogin, {
              encryptedData: that.data.encryptedData,
              sessionKey: that.data.sessionKey,
              iv: that.data.iv
            }, function (resSub) {
              Message.Loading.close();
              if (resSub.data.flag) {
                //登录成功 返回用户信息 res.data.data
                app.setUserInfo(resSub.data.data)
                if (that.data.target) {
                  wx.redirectTo({
                    url: that.data.target,
                  })
                } else {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              } else {
                Message.Alert.alertDefault(resSub.data.message)
              }
            })
          } else {
            Message.Alert.alertDefault(res.data.message)
          }
        })
      },
      fail(res) {}
    })
  },
  back() {
    // wx.switchTab({
    //   url: '/pages/index/index',
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  toRegister() {
    wx.navigateTo({
      url: '/pages/register1/register1',
    })
  },
  /**
   * 获取用户信息
   */
  getUserProfile: function (e) {
    let that = this
    if (that.data.phone.length != 11) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (that.data.msgCode == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    if (!that.data.isShow) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      })
      return
    }

    const loginAndRegisterInfo = {};

    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // 获取用户基础信息
        console.info(res.userInfo)
        loginAndRegisterInfo.nickName = res.userInfo.nickName
        loginAndRegisterInfo.gender = res.userInfo.gender
        loginAndRegisterInfo.avatarUrl = res.userInfo.avatarUrl
        // 获取openId
        wx.login({
          success: res => {
            HttpClient.Method.get(LoginUrl.GetWechatSessionKey, {
              code: res.code
            }, function (res) {
              Message.Loading.close();
              if (res.data.flag) {
                loginAndRegisterInfo.openId = res.data.data.openId
                // 调用登录注册
                that.phoneLogin(loginAndRegisterInfo)
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            })
          },
          fail(res) {}
        })
      }
    })
  },
  /**
   * 勾选协议
   */
  changeCheck() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  /**
   * 跳转至协议
   */
  gotoDetails(e) {
    PageGo.jump(e.currentTarget.dataset.url)
  }
})