// pages/arrondi2/arrondi2.js
const app = getApp()
//获取二级页数据
const SecondBannerUrl = require('../../utils/config.js').HttpConfig.SecondBannerUrl
const HttpClient = require('../../utils/util.js').HttpClient;
let cartUtil = require('../../utils/cart')
const PageGo = require('../../utils/util.js').PageGo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    bannerId: -1,
    secondPageinfo: '',
    peopleId: 0,
    curCategoryIndex: 0,
    current: 0, //当前页
    limit: 6, //1页数据量
    goodsList: [],
    moduleId: "",
    cartTotal: {},
    //购物车
    shopCart: [],
    cartTypeName: cartUtil.cartType.OTO
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 水果机 底部遮挡
    this.setData({
      "isIphoneX": this.isIphoneX()
    })
    let that = this
    that.setData({
      bannerId: options.bannerId
    })
    if(app.globalData.userInfo!=null){
      that.setData({
        peopleId:app.globalData.userInfo.id
      })
    }
    this.getSecondPageInfo()

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
    if (this.data.goodsTotal == this.data.goodsList.length) {
      return
    } else {
      let current = this.data.current;
      this.setData({
        current: current + 1
      });
      this.loadGoodsInfo(this.data.moduleId, this.data.current, this.data.limit)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //自定义方法
  // 判断水果机
  isIphoneX() {
    let info = wx.getSystemInfoSync();
    if (/iPhone X/i.test(info.model)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 获取二级页基础信息
   */
  getSecondPageInfo: function () {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    HttpClient.Method.get(SecondBannerUrl.InfoUrl, {
      bannerId: that.data.bannerId,
      peopleId: that.data.peopleId
    }, function (res) {
      wx.hideLoading()
      if (res.data.flag) {
        that.setData({
          secondPageinfo: res.data.data
        })
        wx.setNavigationBarTitle({
          title: res.data.data.bannerTitle
        })
        if (that.data.secondPageinfo.secondModuleDtoList.length > 0) {
          that.setData({
            moduleId: that.data.secondPageinfo.secondModuleDtoList[that.data.curCategoryIndex].id
          })
          that.loadGoodsInfo(that.data.moduleId, that.data.current, that.data.limit)
        }
      }
    })
  },
  /**
   * 获取二级页商品信息
   */
  loadGoodsInfo: function (moId, current, limit) {
    let that = this;
    let goodsList = this.data.goodsList;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    HttpClient.Method.get(SecondBannerUrl.getgetSecondModuleGoodsListUrl, {
      peopleId: that.data.peopleId,
      moduleId: moId,
      pn: current,
      ps: limit
    }, function (res) {
      wx.hideLoading()
      if (res.data.flag) {
        if (res.data.data.rows.length > 0) {
          goodsList = goodsList.concat(res.data.data.rows)
          that.setData({
            goodsList: goodsList,
            //订单条数
            goodsTotal: res.data.data.total,
          })
          that.initShopCart()
        }
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
      goods.buyCount = undefined
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
  /**
   * 刷新购物车
   */
  refreshNum: function () {
    let totalBuyCount = cartUtil.getTotalBuyCount()
    this.setData({
      totalBuyCount: totalBuyCount
    })
  },
  /**
   * 加入购物车
   */
  addCart: function (e) {
    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    let goods = e.currentTarget.dataset.goodsinfo
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
   * 商品详情
   */
  gotoDetails(e) {
    PageGo.jump('/pages/goodsDetail/goodsDetail', {
      id: e.currentTarget.dataset.id
    })
  }
})