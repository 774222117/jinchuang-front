// pages/peopleInfo/peopleInfo.js
const app = getApp()
const PageGo = require('../../utils/util.js').PageGo;
//获取个人信息url
const getPeopleInfoUrl = require('../../utils/config.js').HttpConfig.peopleInfoUrl.getPeopleInfoUrl
//设置生日
const updateBirthdayUrl = require('../../utils/config.js').HttpConfig.peopleInfoUrl.updateBirthdayUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleInfo: "",
    encryptionPhone: '',
    peopleId: 0,
    date: '',
    endDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      peopleId: app.globalData.userInfo.id
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDate()
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
   * 获取个人信息
   */
  getData() {
    if (app.globalData.userInfo == null) return
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    var data = {
      peopleId: that.data.peopleId,
    }
    wx.request({
      url: getPeopleInfoUrl,
      data: data,
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },

      success: function (res) {
        wx.hideLoading();
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '获取个人信息出错！',
            icon: 'none'
          });
          return
        }
        that.setData({
          peopleInfo: res.data.data,
          encryptionPhone: res.data.data.phone ? res.data.data.phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2") : '',
          date:  res.data.data.birthday? res.data.data.birthday.split(' ')[0]:''
        })
      }
    })
  },
  //修改用户名
  jumpTo(e) {
    PageGo.jump(e.currentTarget.dataset.url, {})
  },
  /**
   * 获取当前日期
   */
  getDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    var currentdate = [year, month, day].join('-')
    this.setData({
      endDate: currentdate
    })
  },
  /**
   * 完成日期选择
   */
  bindDateChange: function (e) {
    var date = e.detail.value
    this.setData({
      date
    })
    var birthday = date.split('-')
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    var data = {
      peopleId: that.data.peopleId,
      birthday: birthday[0] + birthday[1] + birthday[2]
    }
    wx.request({
      url: updateBirthdayUrl,
      data: data,
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
      success: function (res) {
        wx.hideLoading();
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '网络异常！',
            icon: 'none'
          });
          return
        }
        that.getData()
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        });

      }
    })
  },
})