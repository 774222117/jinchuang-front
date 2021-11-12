const app = getApp();
const Message = require('../../utils/util.js').Message;
const HttpClient = require('../../utils/util.js').HttpClient;
const MerchantCardUrl = require('../../utils/config.js').HttpConfig.MerchantCardUrl;
//html解析模块
let htmlParse = require('../../components/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    id: 0,
    cardVoucherInfo: {},
    showChoose: false,
    //选择的卡
    currentCardIndex: null,
    buyCount: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 水果机 底部遮挡
    this.setData({
      id: options.id,
      "isIphoneX": this.isIphoneX()
    })
    let that = this
    Message.Loading.loadingDefault()
    HttpClient.Method.get(MerchantCardUrl.DetailUrl, {
      merchantCardId: that.data.id
    }, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        that.setData({
          cardVoucherInfo: res.data.data
        })
        // 模板渲染
        let ruleInfo = that.data.cardVoucherInfo.noticeContent.replaceAll("\\", "").replaceAll("\"/", "\"")
        if (ruleInfo) {
          htmlParse.wxParse('commodityDetails', 'html', ruleInfo, that, 5);
        }
      }
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
  // 判断水果机
  isIphoneX() {
    let info = wx.getSystemInfoSync();
    if (/iPhone X/i.test(info.model)) {
      return true;
    } else {
      return false;
    }
  },
  //选择面值
  chooseCardAmount: function () {
    this.setData({
      showChoose: true
    })
  },
  closeChoose: function () {
    this.setData({
      showChoose: false
    })
  },
  //选择卡
  chooseCard: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentCardIndex: index
    })
  },
  addCount: function () {
    this.setData({
      buyCount: this.data.buyCount + 1
    })
  },
  delCount: function () {
    let buyCount = this.data.buyCount
    if (buyCount <= 1) {
      wx.showToast({
        title: '购买数量不能小于1',
        icon: 'none'
      })
      return
    }
    this.setData({
      buyCount: buyCount - 1
    })
  },
  submit: function () {
    if (this.data.currentCardIndex == null) {
      wx.showToast({
        title: '请选择面值',
        icon: 'none'
      })
      this.setData({
        showChoose: true
      })
      return
    }
    let cardAmountInfo = this.data.cardVoucherInfo.merchantCardDetails[this.data.currentCardIndex]
    let sumPrice = cardAmountInfo.realPrice * this.data.buyCount
    let cardInfo = {
      cardImgUrl: this.data.cardVoucherInfo.cardImgUrl,
      cardName: this.data.cardVoucherInfo.cardName,
      id: cardAmountInfo.id,
      buyCount: this.data.buyCount,
      nominalPrice: cardAmountInfo.nominalPrice,
      realPrice: cardAmountInfo.realPrice,
      sumPrice: sumPrice,
      //卡类型 0 电子 2 实体卡
      orderType: 2
    }
    app.globalData.cardVoucherInfo = cardInfo
    wx.navigateTo({
      url: '/pages/cardVoucherSubmit/cardVoucherSubmit',
    })
  }
})