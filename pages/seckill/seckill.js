// pages/seckill/seckill.js
const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const PromotionUrl = require('../../utils/config.js').HttpConfig.PromotionUrl;
let cartUtil = require('../../utils/cart')
const PageGo = require('../../utils/util.js').PageGo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleId:0,
    num: 0,
    isIpx: false,
    saleActivityId: 0,
    current: 1, //当前页
    limit: 10, //1页数据量
    saleActivityInfo: '',
    goodsList: [], //商品列表
    totalBuyCount: 0,
    cartTotal: {},
    //购物车
    shopCart: [],
    cartTypeName: cartUtil.cartType.OTO
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      peopleId: app.globalData.userInfo.id,
    })
    this.isIphoneX()
    if (options.activityId != undefined) {
      this.setData({
        saleActivityId: options.activityId
      })
      this.getData()
    }
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
    this.initShopCart()
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //自定义方法
  /**
   * 判断安全区域
   */
  isIphoneX: function () {
    let model = wx.getSystemInfoSync().model;
    let isIpx = model.indexOf("iPhone X") > -1 || model.indexOf("unknown<iPhone") > -1 || model.indexOf("iPhone Max") > -1 || model.indexOf("iPhone 11") > -1 || model.indexOf("iPhone 12") > -1;
    isIpx && this.setData({
      isIpx: true
    });
  },
  /**
   * 加减数量
   */
  changeNum(e) {
    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    let that = this
    let flag = e.currentTarget.dataset.isadd
    let item = e.currentTarget.dataset.goodsinfo
    if (flag == 1) {
      that.addCart(item)
    } else {
      if (item.buyCount < 1) {
        wx.showToast({
          title: '不能再减少啦！',
          icon: 'none'
        })
      } else {
        that.delCart(item)
      }
    }
  },
  addCart: function (e) {
    let goods = e

    let buyCount = 0
    if (goods.buyCount) {
      buyCount = goods.buyCount
    }
    if (!goods.specSku) {
      goods.specSku = ''
    }
    goods = cartUtil.addShopCart(goods, cartUtil.cartType.OTO)

    let goodsList = cartUtil.modifyGoodsList(this.data.goodsList, goods)
    if (goods.buyCount > buyCount) {
      wx.showToast({
        title: '添加购车成功',
        icon: 'none'
      })
    }
    this.setData({
      goodsList: goodsList,
      cartTotal: cartUtil.getShopCartTotal(this.data.cartTypeName),
      shopCart: cartUtil.getShopCart(this.data.cartTypeName)
    })

    this.refreshNum()
  },

  /**
   * 减少购物车
   *   getShopGoodsInfo方法获得到的categoryGoodsList列表将商品信息（goodsInfo）绑定到控件上
   */
  delCart: function (e) {

    let goods = e

    let buyCount = 0
    if (goods.buyCount) {
      buyCount = goods.buyCount
    }
    if (!goods.specSku) {
      goods.specSku = ''
    }
    goods = cartUtil.delShopCart(goods, cartUtil.cartType.OTO)

    let goodsList = cartUtil.modifyGoodsList(this.data.goodsList, goods);
    // 在商品详情中重新设置下数据
    this.setData({
      goodsList: goodsList,
      cartTotal: cartUtil.getShopCartTotal(this.data.cartTypeName),
      shopCart: cartUtil.getShopCart(this.data.cartTypeName)
    })
    this.refreshNum()
  },
  getData() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true

    })
    HttpClient.Method.get(PromotionUrl.InfoUrl, {
      peopleId: that.data.peopleId,
      saleActivityId: that.data.saleActivityId,
      current: that.data.current,
      limit: that.data.limit
    }, function (res) {
      wx.hideLoading()
      if (res.data.flag) {
        that.setData({
          saleActivityInfo: res.data.data,
          goodsList: that.data.goodsList.concat(res.data.data.goodsList),
          current: that.data.current + 1,
        });
        that.initShopCart()
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },
  /**
   * 初始化购物车
   */
  initShopCart: function () {
    let shopCart = cartUtil.getShopCart(cartUtil.cartType.OTO)
    let goodsInfoList = this.data.goodsList
    goodsInfoList.forEach((goods) => {
      goods.buyCount = 0
    })
    shopCart.forEach((item) => {
      goodsInfoList.forEach((goods) => {
        if (item.goodsId == goods.id) {
          goods.buyCount = item.total
        }
      })
    })
    this.setData({
      goodsList: goodsInfoList,
      shopCart: shopCart,
      cartTotal: cartUtil.getShopCartTotal(this.data.cartTypeName)
    })
    this.refreshNum()
  },
  refreshNum: function () {
    let totalBuyCount = cartUtil.getTotalBuyCount()
    this.setData({
      totalBuyCount: totalBuyCount
    })
  },
  /**
   * 商品详情
   */
  gotoDetails(e) {
    PageGo.jump('/pages/goodsDetail/goodsDetail', {
      id: e.currentTarget.dataset.id
    })
  }
})