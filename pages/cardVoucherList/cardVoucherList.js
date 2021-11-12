const app = getApp();
const Message = require('../../utils/util.js').Message;
const HttpClient = require('../../utils/util.js').HttpClient;
const MerchantCardUrl = require('../../utils/config.js').HttpConfig.MerchantCardUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardtypeShow: true,
    cardVoucherList: [],
    limit: 8,
    current: 1,
    //选择的卡券id
    selectedId: 0,
    //选择兑换的卡类型
    selectedSellType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /***********自定义方法*******************************/
  /**关闭兑换卡类型 选择弹框 */
  closeCardTypeModel: function () {
    this.setData({
      cardtypeShow: true
    })
  },
  getList: function () {
    let that = this
    Message.Loading.loadingDefault()
    HttpClient.Method.get(MerchantCardUrl.InfoUrl, {
      current: that.data.current,
      limit: that.data.limit
    }, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        that.setData({
          cardVoucherList: that.data.cardVoucherList.concat(res.data.data.rows),
          current: that.data.current + 1
        })
      }
    })
  },
  //显示 卡类型选择
  showCardTypeModel:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    let selltype = e.currentTarget.dataset.selltype
    this.setData({
      selectedId:id,
      selectedSellType: selltype
    })
    //如果售卖类型是所有 弹出选择
    if(selltype == 0){
      this.setData({
        cardtypeShow: false        
      })
    }else{
      this.toExchange()
    }
    
  },
  selectType:function(e){
    let selltype = e.currentTarget.dataset.selltype
    this.setData({
      selectedSellType: selltype
    })
  },
  //确定去兑换
  toExchange:function(){
    let url =''
    if(this.data.selectedSellType=="2"){
      url = '/pages/cardVoucherOfflineDetail/cardVoucherOfflineDetail?id='+this.data.selectedId
    }else{
      url = '/pages/cardVoucherDetail/cardVoucherDetail?id='+this.data.selectedId
    }
    this.closeCardTypeModel()
    wx.navigateTo({
      url: url
    })
  }
})