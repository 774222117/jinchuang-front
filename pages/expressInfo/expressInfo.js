// pages/expressInfo/expressInfo.js
const app = getApp()
//查询订单Url
const searchOrderGoodsByIdUrl = require('../../utils/config.js').HttpConfig.OrderUrl.searchOrderGoodsByIdUrl
//查询订单物流url
const GetExpressInfoUrl = require('../../utils/config.js').HttpConfig.GetExpressInfoUrl.InfoUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliStatus:{"0":"快递收件(揽件)","1":"在途中","2":"正在派件","3":"已签收","4":"派送失败","5":"疑难件","6":"退件签收"},
    orderInfo: '', //订单信息
    goodsItems: [], //商品列表
    peopleId: 0,
    expressInfo: '', //物流信息
    expressInfoList: '', //用来循环的物流信息
    flag: false, //物流信息是否展开
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      peopleId: app.globalData.userInfo.id,
      orderId: options.orderId ? options.orderId : '',
      goodsId: options.goodsId ? options.goodsId : ''
    })
    this.getData()

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
  /************自定义方法************/
  /**
   * 获取数据
   */
  getData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    wx.request({
      url: searchOrderGoodsByIdUrl,
      data: {
        peopleId: this.data.peopleId,
        orderId: this.data.orderId,
        orderGoodsId: this.data.goodsId
      },
      success: function (res) {
        wx.hideLoading()
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '查询订单出错！',
            icon: 'none'
          });
          return
        }
        that.setData({
          orderInfo: res.data.data,
          goodsItems: res.data.data.goodsItems
        })
        that.getExpress(that.data.goodsItems.length > 0 ? that.data.goodsItems[0].expressNumber : '')
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
    })
  },
  /**
   * 获取物流信息
   */
  getExpress(expressNo) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: GetExpressInfoUrl,
      data: {
        expressNo
      },
      success: function (res) {
        wx.hideLoading()
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '查询物流出错！',
            icon: 'none'
          });
          return
        }
        that.setData({
          expressInfo: res.data.data.result,
          expressInfoList: [res.data.data.result.list[0]]
        })
        // var status = ''
        // switch (that.data.expressInfo.deliverystatus) {
        //   case 0:
        //     status = '未发货'
        //     break;
        //   case 0:
        //     break;
        //   case 0:
        //     break;
        //   case 0:
        //     break;
        // }

      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
    })
  },
  /**
   * 展开收起物流信息
   */
  changeFlag() {

    if (this.data.flag == true) {
      this.setData({
        expressInfoList: [this.data.expressInfo.list[0]]
      })
      console.log(1)
    } else {
      this.setData({
        expressInfoList: this.data.expressInfo.list
      })
      console.log(2)
    }
    this.setData({
      flag: !this.data.flag,
    })

  }
})