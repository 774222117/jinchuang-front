const Message = require('../../utils/util.js').Message;
const HttpClient = require('../../utils/util.js').HttpClient;
const NewsUrl = require('../../utils/config.js').HttpConfig.NewsUrl;
const PageGo = require('../../utils/util.js').PageGo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newList: [{
      name: '长复福礼隐私政策',
      url: "/pages/privacy/privacy"
    }, {
      name: '长复福礼用户协议',
      url: "/pages/agreement/agreement"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this
    // Message.Loading.loadingDefault()
    // HttpClient.Method.get(NewsUrl.GetListUrl, {
    //   location:2
    // }, function (res) {
    //   Message.Loading.close()
    //   that.setData({
    //     newList: res.data
    //   })
    // })
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
  /**
   * 跳转至详情
   */
  gotoDetails(e) {
    PageGo.jump(e.currentTarget.dataset.url)
  }
})