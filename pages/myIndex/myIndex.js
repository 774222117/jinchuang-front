// pages/myIndex/myIndex.js
const app = getApp();
const Message = require('../../utils/util.js').Message;
const HttpClient = require('../../utils/util.js').HttpClient;
const MyCenter = require('../../utils/config.js').HttpConfig.MyCenter;
const PageGo = require('../../utils/util.js').PageGo;
let cartUtil = require('../../utils/cart')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleInfo: {
      nickName: '', //昵称
      icon: '', //头像
      enterpriseName: '', //企业
      balanceData: '', //余额
    }, //用户信息
    countData: { //数据统计
      couponNumber: 0, //优惠券数量
      noPayOrder: 0, //未支付订单数量
      waitSend: 0, //待发货订单数量
    },
    //大牌卡券列表
    cardVoucheList: [],
    //是否能购买大牌卡券
    canbuy:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const userInfo = app.globalData.userInfo;
    // if (userInfo == null || !userInfo.id || userInfo.id <= 0) {
    //   wx.navigateTo({
    //     url: '../login/login',
    //   })
    //   return
    // }
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
    const userInfo = app.globalData.userInfo;
    console.log(userInfo)
    if (userInfo == null || !userInfo.id || userInfo.id <= 0) {
      this.setData({
        peopleInfo: {
          nickName: '', //昵称
          icon: '', //头像
          enterpriseName: '', //企业
          balanceData: '', //余额
        }, //用户信息
        countData: { //数据统计
          couponNumber: 0, //优惠券数量
          noPayOrder: 0, //未支付订单数量
          waitSend: 0, //待发货订单数量
        },
        //大牌卡券列表
        cardVoucheList: []
      })
      return
    }
    Message.Loading.loadingDefault()
    let that = this;
    HttpClient.Method.get(MyCenter.InfoUrl, {
      peopleId: userInfo.id
    }, function (res) {
      Message.Loading.close();
      if (res.data.flag) {
        that.setData({
          peopleInfo: res.data.data
        })
      }else{
        app.globalData.userInfo=null
      }
    });
    HttpClient.Method.get(MyCenter.CountUrl, {
      peopleId: userInfo.id
    }, function (res) {
      if (res.data.flag) {
        that.setData({
          countData: res.data.data
        })
      }
    });
    HttpClient.Method.get(MyCenter.FindPeopleSaleActivityUrl, {
      peopleId: userInfo.id
    }, function (res) {
      if (res.data.flag) {
        that.setData({
          saleActivityList: res.data.data
        })
      }
    })
    //获取大牌卡券信息
    HttpClient.Method.get(MyCenter.MerchantCardInfo, {
      peopleId: userInfo.id
    }, function (res) {
      if (res.data.flag) {
        that.setData({
          cardVoucheList: res.data.data
        })
        if(res.data.code =='200'){
          that.setData({
            canbuy:true
          })
        }
      }
    })
    cartUtil.refreshCartNum()
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
  //收货地址管理
  chooeAddress: function () {
    const userInfo = app.globalData.userInfo;
    if (userInfo == null || !userInfo.id || userInfo.id <= 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    wx.chooseAddress({
      success: (res) => {}
    })
  },
  //页面跳转
  toPage: function (e) {
    const userInfo = app.globalData.userInfo;
    let target = e.currentTarget.dataset.target
    if (userInfo == null || !userInfo.id || userInfo.id <= 0) {
      wx.navigateTo({
        url: '../login/login',

      })
      return
    }
   
    wx.navigateTo({
      url: target,
    })
  },
  /**
   * 点击我的订单tab
   */
  touchOrder: function (e) {
    const userInfo = app.globalData.userInfo;
    if (userInfo == null || !userInfo.id || userInfo.id <= 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    const tab = e.currentTarget.dataset.status;
    PageGo.jump('/pages/orderList/orderList', {
      tab: tab
    })
  },
  //跳转付款页面
  goPay(e) {
    const userInfo = app.globalData.userInfo;
    if (userInfo == null || !userInfo.id || userInfo.id <= 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    PageGo.jump('/pages/myCardVoucherUse/myCardVoucherUse', {
      id: e.currentTarget.dataset.id
    })
  },
  /**
   * 去登录
   */
  goLoin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  toMoreCardVoucher:function(){
    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/cardVoucherList/cardVoucherList'
    })
  },
})