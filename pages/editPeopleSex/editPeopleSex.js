// pages/editPeopleSex/editPeopleSex.js
const app = getApp()
//查询订单Url
const editPeopleSexUrl = require('../../utils/config.js').HttpConfig.peopleInfoUrl.editPeopleSexUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      peopleId: app.globalData.userInfo.id,
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

  //自定义方法
  /**
   * 选择性别
   */
  choose(e) {
    var sex = e.currentTarget.dataset.sex
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: editPeopleSexUrl,
      data: {
        peopleId: this.data.peopleId,
        gender:sex
      },
      success: function (res) {
        wx.hideLoading()
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '网络异常',
            icon: 'none'
          });
          return
        }
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面
        wx.navigateBack({
          delta: 1,
          success() {
            beforePage.getData()
            wx.showToast({
              title: res.data.message || '修改成功',
              icon: 'none'
            });
          }
        })
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
    })
  }
})