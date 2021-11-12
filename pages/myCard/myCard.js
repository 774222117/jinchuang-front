const app = getApp();
const Message = require('../../utils/util.js').Message;
const HttpClient = require('../../utils/util.js').HttpClient;
const CardUrl = require('../../utils/config.js').HttpConfig.CardUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList:[],
    limit: 8,
    current: 1,
    status:1,
    sumBalance:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcardList()
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
    this.getcardList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getcardList:function(){
    let that = this
    Message.Loading.loadingDefault()
    HttpClient.Method.get(CardUrl.MineUrl, {
      peopleId: app.globalData.userInfo.id,
      status:that.data.status,
      current: that.data.current,
      limit: that.data.limit
    }, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        that.setData({
          cardList: that.data.cardList.concat(res.data.data.rows),
          current:that.data.current+1
        })
        let sumBalance = 0
        //如果是可用的卡，需要计算总余额
        if(that.data.status==1){
          that.data.cardList.forEach((item) => {
            sumBalance+= item.cardBalance
          })
        }
        that.setData({
          sumBalance:sumBalance
        })
      }
    })
  },
  switchTab:function(e){
    this.setData({
      status:e.currentTarget.dataset.status,
      current:1,
      cardList:[]
    })
    this.getcardList()
  }
})