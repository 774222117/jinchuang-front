// pages/arrondi3/arrondi3.js
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
    currentIndex: 0,

    isIphoneX: false,
    bannerId: -1,
    secondPageinfo: '',
    peopleId: 0,
    goodsList: [],
    cartTotal: {},
    //购物车
    shopCart: [],
    cartTypeName: cartUtil.cartType.OTO,
    screenHeight: 0, //商品列表可滚动高度
    toView: '',
    toViewTop:'',
    lastActive: "",
    tabFixed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "isIphoneX": this.isIphoneX()
    })
    let that = this
    that.setData({
      bannerId: options.bannerId
    })
    if (app.globalData.userInfo != null) {
      that.setData({
        peopleId: app.globalData.userInfo.id
      })
    }
    let screenHeight = 0;
    //获取滚动条可滚动高度
    wx.getSystemInfo({
      success: (res) => {
        screenHeight = res.windowHeight; //获取屏幕高度
      }
    });
    this.setData({
      bannerId: options.bannerId,
      screenHeight: screenHeight - 47
    })

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
    if (!this.data.secondPageinfo.secondModuleDtoList) return
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
  onReachBottom: function () {},

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
        that.initShopCart()

      }
    })
  },
  /**
   * 初始化购物车
   */
  initShopCart: function () {
    let that = this
    let shopCart = cartUtil.getShopCart(cartUtil.cartType.OTO)
    let goodsInfoList = []
    this.data.secondPageinfo.secondModuleDtoList.forEach((item) => {
      item.goodsList.forEach((it) => {
        it.buyCount = undefined
        goodsInfoList.push(it)
      })
    })
    shopCart.forEach((list) => {
      that.data.secondPageinfo.secondModuleDtoList.forEach((item) => {
        item.goodsList.forEach((it) => {
          if (list.goodsId == it.id) {
            it.buyCount = list.total
          }
        })
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
  },
  /**
   * 切换顶部导航栏
   */
  handleTitileClick(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    this.setData({
      currentIndex: index,
      toView: id
    })
    console.log(this.data.currentIndex)
  },
  /**
   * 商品列表滑动，顶部tab定位到相对应
   */
  scroll(e) {
    var that = this
    var scrollTop = e.detail.scrollTop
    var height = 0;
    var scrollArr = [];
    for (var i = 0; i < that.data.secondPageinfo.secondModuleDtoList.length; i++) {
      var arrLength = that.data.secondPageinfo.secondModuleDtoList[i].goodsList.length
      height = height + 63 + ((arrLength % 2 == 0 ? arrLength / 2 : (arrLength - (arrLength % 2)) / 2 + 1) * 281)
      scrollArr.push(height)
    }
    let topImgHeight = 0
    let query = wx.createSelectorQuery();
    query.select('#imgsty1').boundingClientRect(res => {
      topImgHeight = res ? res.height : 0
      console.log(topImgHeight)
      console.log(scrollTop)
      if (scrollTop - topImgHeight > scrollArr[scrollArr.length - 1] - that.data.screenHeight) {
        return
      } else {
        for (var i = 0; i < scrollArr.length; i++) {
          if (scrollTop - topImgHeight >= 0 && scrollTop - topImgHeight < scrollArr[0]) {
            if (0 != that.data.lastActive) {
              that.setData({
                currentIndex: 0,
                toViewTop:'t0',
                lastActive: 0
              })
            }
          } else if (scrollTop - topImgHeight >= scrollArr[i - 1] && scrollTop - topImgHeight <= scrollArr[i]) {
            if (i != that.data.lastActive) {
              that.setData({
                currentIndex: i,
                toViewTop:'t'+i,
                lastActive: i
              })
            }
          }
        }
      }
      this._update()
    }).exec()
  },
  _update: function () {
    var query = wx.createSelectorQuery().in(this)
    query.select('#mainBox').boundingClientRect(res => {
      let tabFixed = res.top <= 0
      if (tabFixed == this.data.tabFixed) return //防止过多setdata影响效率
      this.setData({
        tabFixed: tabFixed
      })
    }).exec()
  },
})