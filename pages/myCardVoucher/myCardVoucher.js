const app = getApp();
const Message = require('../../utils/util.js').Message;
const HttpClient = require('../../utils/util.js').HttpClient;
const MerchantCardUrl = require('../../utils/config.js').HttpConfig.MerchantCardUrl;
const PageGo = require('../../utils/util.js').PageGo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardVoucherList:[],
    limit: 8,
    current: 1,
    status:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCardVoucherList()
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
    this.getCardVoucherList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getCardVoucherList:function(){
    let that = this
    Message.Loading.loadingDefault()
    HttpClient.Method.get(MerchantCardUrl.MineUrl, {
      peopleId: app.globalData.userInfo.id,
      status:that.data.status,
      current: that.data.current,
      limit: that.data.limit
    }, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        that.setData({
          cardVoucherList: that.data.cardVoucherList.concat(res.data.data.rows),
          current:that.data.current+1
        })
      }
    })
  },
  switchTab:function(e){
    this.setData({
      status:e.currentTarget.dataset.status,
      current:1,
      cardVoucherList:[]
    })
    this.getCardVoucherList()
  },
  //跳转付款页面
  goPay(e){
    PageGo.jump('/pages/myCardVoucherUse/myCardVoucherUse', {
      id: e.currentTarget.dataset.id
    })
  }
})