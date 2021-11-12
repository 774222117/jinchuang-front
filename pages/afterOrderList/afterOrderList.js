const app = getApp()
const findAfterSaleListUrl = require('../../utils/config.js').HttpConfig.OrderUrl.findAfterSaleListUrl;
//取消订单
const AfterOrderCancelUrl = require('../../utils/config.js').HttpConfig.OrderUrl.AfterOrderCancelUrl
Page({

  /**
   * 初始数据
   */
  data: {
    peopleId : 0,
    currentIndex:0,

    //订单列表
    orderList: [],
    //订单总条数
    orderTotal: 0,
    current:0,
    limit:8
  },

  /**
   * 方法列表
   */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    if(app.globalData.userInfo == null) return
    this.setData({
      peopleId : app.globalData.userInfo.id
    })
    this.getPeopleOrderInfo(this.data.currentIndex)
  },

  getPeopleOrderInfo:function(){
    if (app.globalData.userInfo == null) return
    let data = {
      pn: this.data.current,
      peopleId: this.data.peopleId,
      ps: this.data.limit,
      status:parseInt(this.data.currentIndex)
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    wx.request({
      url: findAfterSaleListUrl,
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
        if (!res.data.rows) {
          wx.showToast({
            title: res.data.message || '查询订单出错！',
            icon: 'none'
          });
          return
        }
        if (res.data.rows.lenght == 0) {} else {
          let orderList = that.data.orderList.concat(res.data.rows)
          console.log(res.data.rows)
          //页面加+1
          that.setData({
            //订单数据
            orderList: orderList,
            //订单条数
            orderTotal: res.data.total
          })
        }
      }
    })
  },

  handleItemClick:function(event){
    const index = event.currentTarget.dataset.index;
    this.setData({
      currentIndex : index,
      current: 0,
      //订单列表
      orderList: [],
      //订单总条数
      orderTotal: 0,
    })
    this.getPeopleOrderInfo()
  },
  toSubmitExpress:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/afterOrderExpressSubmit/afterOrderExpressSubmit?id='+id,
    })
  },
  cancelAfterOrder(e) {
    var that = this
    wx.showModal({
      content: '确认取消？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          wx.request({
            url: AfterOrderCancelUrl,
            method: 'get',
            data: {
              afterId: e.currentTarget.dataset.id,
              peopleId: that.data.peopleId,
            },
            fail: function (err) {
              wx.hideLoading()
              wx.showToast({
                title: '取消订单出错,网络异常！',
                icon: 'none'
              });
            },
            success: function (res) {
              that.setData({
                current: 0,
                //订单列表
                orderList: [],
                //订单总条数
                orderTotal: 0,
              })
              that.getPeopleOrderInfo(that.data.chooseIndex)
              wx.hideLoading()
              wx.showToast({
                title: res.data.message || '取消成功',
                icon: 'none'
              });
            }
          })
        }
      }
    })
  },
})
