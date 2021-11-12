// pages/cardVoucher/cardVoucher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customBar:'0',
    payAmount:0,
    createTime:'',
    ordersn:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取设备信息
    wx.getSystemInfo({
      success: e => {   // { statusBarHeight: 20, ... }，单位为 px
         // 获取右上角胶囊的位置信息
         let info = wx.getMenuButtonBoundingClientRect()  // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
         let CustomBar = info.bottom + info.top - e.statusBarHeight
         console.log(CustomBar)
         this.setData({customBar:CustomBar})
      }
    }) 
    this.setData({
      payAmount:options.payAmount,
      ordersn:options.ordersn,
      createTime:options.createTime
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
  toMyCardVoucher:function(){
    wx.redirectTo({
      url: '/pages/myCardVoucher/myCardVoucher',
    })
  }
})