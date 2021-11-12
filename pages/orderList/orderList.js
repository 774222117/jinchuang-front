// pages/orderList/orderList.js

const app = getApp()
const PageGo = require('../../utils/util.js').PageGo;
//查询订单Url
const PeopleOrderInfoUrl = require('../../utils/config.js').HttpConfig.OrderUrl.PeopleOrderInfoUrl
//取消订单
const OrderCancelUrl = require('../../utils/config.js').HttpConfig.OrderUrl.OrderCancelUrl
//确认收货
const finishOrderUrl = require('../../utils/config.js').HttpConfig.OrderUrl.finishOrderUrl
//申请退款
const ApplyRefundUrl = require('../../utils/config.js').HttpConfig.OrderUrl.ApplyRefundUrl
//退货原因
const FindRefundReasonUrl = require('../../utils/config.js').HttpConfig.OrderUrl.findRefundReasonUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //屏幕高度
    scrollHeight: 0,
    //订单列表
    orderList: [],
    //订单总条数
    orderTotal: 0,
    //当前选择的tabbarIndex
    chooseIndex: 0,
    current: 0,
    limit: 8,
    peopleId: 0,
    curOrderId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
        peopleId: app.globalData.userInfo.id,
    })
    var that = this
    //获取屏幕高度
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollHeight: res.windowHeight - 87
        })
      }
    })
    if (options.tab) {
      this.setData({
        chooseIndex: options.tab
      })
    }
    this.findRefundReason()
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
    this.setData({
      current: 1,
      //订单列表
      orderList: [],
      //订单总条数
      orderTotal: 0,
    })
    this.getPeopleOrderInfo(this.data.chooseIndex)
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
  //自定义函数
  /**
   * 跳转搜索页
   * 
   */
  gotoSearch: function () {
    PageGo.jump('/pages/search/search', {
      title: '',
      self: 0
    })
  },
  /**
   * 下拉至底部时加载新的
   */
  toLower() {
    if (this.data.orderTotal == this.data.orderList.length) {
      return
    } else {
      let current = this.data.current;
      this.setData({
        current: current + 1
      });
      this.getPeopleOrderInfo(this.data.chooseIndex)
    }
  },
  //切换顶部tabbar
  changeTab: function (e) {
    this.setData({
      chooseIndex: e.currentTarget.dataset.index,
      current: 1,
      //订单列表
      orderList: [],
      //订单总条数
      orderTotal: 0,
    })
    this.getPeopleOrderInfo(this.data.chooseIndex)
  },
  /**
   * 获取订单
   *   orderStatus : 0 全部 1 待付款 2 待发货 3 待收货 4 已完成 5 待退款
   *   返回status说明：
   *      0 待支付，显示支付按钮
   *      1 待发货
   *      2 待取货
   *      3 已完成
   *      4 待退款
   */
  getPeopleOrderInfo: function (orderStatus) {
    if (app.globalData.userInfo == null) return
    let data = {
      current: this.data.current,
      systemName:"jc",
      peopleId: this.data.peopleId,
      limit: this.data.limit
    }
    orderStatus = parseInt(orderStatus)
    switch (orderStatus) {
      //待付款
      case 1:
        data.status = 0
        break
        //待退款
      case 2:
       //
       data.status = 1
       break
        //待收货
      case 3:
        data.status = 2
        break
        //待退款
      case 4:
        data.refundState = 0
        break
    }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    wx.request({
      url: PeopleOrderInfoUrl,
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
  /**
   * 取消订单
   */
  cancelOrder(e) {
    var that = this
    wx.showModal({
      content: '确认取消订单？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          wx.request({
            url: OrderCancelUrl,
            method: 'get',
            data: {
              orderId: e.currentTarget.dataset.id,
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
                current: 1,
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
  /**
   * 已完成-申请售后
   */
  applyService(e) {
    PageGo.jump('/pages/applyAfterType/applyAfterType', {
      orderId: e.currentTarget.dataset.id
    })
  },
  /**
   * 确认收货
   */
  finishOrder(e) {
    var that = this
    wx.showModal({
      content: '确认收货？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          wx.request({
            url: finishOrderUrl,
            method: 'get',
            data: {
              orderId: e.currentTarget.dataset.id,
              peopleId: that.data.peopleId,
            },
            fail: function (err) {
              wx.hideLoading()
              wx.showToast({
                title: '确认收货出错,网络异常！',
                icon: 'none'
              });
            },
            success: function (res) {
              that.setData({
                current: 1,
                //订单列表
                orderList: [],
                //订单总条数
                orderTotal: 0,
              })
              that.getPeopleOrderInfo(that.data.chooseIndex)
              wx.hideLoading()
              wx.showToast({
                title: res.data.message || '确认收货成功',
                icon: 'none'
              });
            }
          })
        }
      }
    })
  },
  toPay(e) {
    let orderId = e.currentTarget.dataset.id
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/settlement/settlement?orderId='+ orderId,
    })
    //this.payOrder()
  },
  toDeliveryInfo:function(e){
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../expressInfo/expressInfo?orderId=' + orderId
    })
  },
  toRefund: function (e) {
    let orderId = e.currentTarget.dataset.id
    this.setData({
      curOrderId:orderId,
      modalName: "resoneModal"
    })
  },
  confirmRefund: function (e) {
    this.hideModal()
    let reason = e.currentTarget.dataset.value
    this.setData({
      reason: reason
    })
    console.info(e)
    this.applyRefund()
  },
  /**
   * 申请退款
   */
  applyRefund: function () {
    wx.showLoading({
      title: '申请退款中...',
      mask: true
    })

    let that = this
    wx.request({
      url: ApplyRefundUrl,
      data: {
        peopleId: this.data.peopleId,
        orderId: this.data.curOrderId,
        reason: this.data.reason
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
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
        wx.showToast({
          title: '申请成功，请耐心等待！',
          icon: 'none'
        });
        that.setData({
          // chooseIndex: e.currentTarget.dataset.index,
          current: 1,
          //订单列表
          orderList: [],
          //订单总条数
          orderTotal: 0,
        })
        that.getPeopleOrderInfo(that.data.chooseIndex)
      }
    })
  },
  findRefundReason: function () {
    let that = this
    wx.request({
      url: FindRefundReasonUrl,
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
      success: function (res) {
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '获取退货原因出错！',
            icon: 'none'
          });
          return
        }
        let resons = res.data.data
        that.setData({
          resonList: resons
        })
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  orderDetail:function(e){
    let orderId=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId='+orderId,
    })
  },
  /**
   * 商品详情
   */
  gotoDetails(e) {
    let id = e.currentTarget.dataset.id
    let orderType = e.currentTarget.dataset.ordertype 
    let url = ''
    if(orderType==1){
      url = '/pages/goodsDetail/goodsDetail?id='+id
    }else if( orderType == 0){
      //电子卡
      url='/pages/cardVoucherDetail/cardVoucherDetail?id='+id
    }else{
      //实体卡
      url='/pages/cardVoucherOfflineDetail/cardVoucherOfflineDetail?id='+id
    }
    wx.navigateTo({
      url:url
     })
  },
})