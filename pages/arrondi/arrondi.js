const app = getApp()
//获取二级页数据
const SecondBannerUrl = require('../../utils/config.js').HttpConfig.SecondBannerUrl
const HttpClient = require('../../utils/util.js').HttpClient;
let cartUtil = require('../../utils/cart')
const Message = require('../../utils/util.js').Message;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerId: -1,
    peopleId: -1,
    secondPageinfo: null,
    curCategoryIndex: 0,
    goodsList: [],
    moduleId: "",
    current: 0, //当前页
    limit: 6, //1页数据量
    hasData: true,
    totalBuyCount: 0,
    cartTotal: {},
    //购物车
    shopCart: [],
    cartTypeName: cartUtil.cartType.OTO,

    flag: false, //判断tab栏是否固定
    swiperCurrent: 0,
    swiperNum: 0,
    tabTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      bannerId: options.bannerId
    })
    if (app.globalData.userInfo != null) {
      that.setData({
        peopleId: app.globalData.userInfo.id
      })
    }
    that.getSecondPageInfo()
    
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
    let moId = this.data.moduleId
    let current = this.data.current
    if (this.data.hasData) {
      this.setData({
        current: current + 1
      })
    } else {
      return
    }
    this.loadGoodsInfo(moId, this.data.current, this.data.limit);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取二级页基础信息
  getSecondPageInfo: function () {
    let that = this
    Message.Loading.loadingDefault()
    HttpClient.Method.get(SecondBannerUrl.InfoUrl, {
      bannerId: that.data.bannerId,
      peopleId: that.data.peopleId
    }, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        var alength = res.data.data.secondModuleCategoryList.length
        that.setData({
          secondPageinfo: res.data.data,
          swiperNum: alength % 5 == 0 ? alength / 5 : (alength - (alength % 5)) / 5 + 1
        })
        wx.setNavigationBarTitle({
          title: res.data.data.bannerTitle
        })
        if (that.data.secondPageinfo.secondModuleDtoList.length > 0) {
          that.loadGoodsInfo(that.data.secondPageinfo.secondModuleDtoList[that.data.curCategoryIndex].id, that.data.current, that.data.limit)
        }
        wx.createSelectorQuery().in(that).select('#tabcategory').boundingClientRect(function (rect) {
          that.setData({
            tabTop: rect ? rect.top : 0
          })
        }).exec()
      }
    })
  },
  /**
   * 促销分类点击选择
   */
  tabCategorySelect(e) {
    let curCategoryIndex = e.currentTarget.dataset.id
    let CategoryIndex = this.data.curCategoryIndex
    if (curCategoryIndex == CategoryIndex) {
      return
    }
    this.setData({
      hasData: true,
      current: 0,
      curCategoryIndex: curCategoryIndex,
      scrollIntoItem: "scrollIntoViewId" + curCategoryIndex
      //goodsList: []
    })
    const moId = this.data.secondPageinfo.secondModuleDtoList[curCategoryIndex].id;
    this.loadGoodsInfo(moId, this.data.current, this.data.limit);
  },
  loadGoodsInfo: function (moId, current, limit) {
    let that = this;
    let goodsList = this.data.goodsList;
    Message.Loading.loadingDefault()
    HttpClient.Method.get(SecondBannerUrl.getgetSecondModuleGoodsListUrl, {
      peopleId: that.data.peopleId,
      moduleId: moId,
      pn: current,
      ps: limit
    }, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        if (res.data.data.rows.length > 0) {
          if (moId != that.data.moduleId) {
            goodsList = res.data.data.rows
          } else {
            goodsList = goodsList.concat(res.data.data.rows)
          }

          that.setData({
            goodsList: goodsList,
            moduleId: moId
          })
          that.initShopCart(that.data.secondPageinfo.isAloneCart)
        } else {
          that.setData({
            hasData: false
          })
        }
      }
    })
  },
  addcart: function (e) {
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
   * 减少购物车
   *   getShopGoodsInfo方法获得到的categoryGoodsList列表将商品信息（goodsInfo）绑定到控件上
   */
  delCart: function (e) {
    //判断登录
    if (app.globalData.userInfo == null) {
      wx.redirectTo({
        url: '../login/login'
      })
      return
    }
    let goods = e.currentTarget.dataset.goodsinfo
    goods = cartUtil.delShopCart(goods, cartUtil.cartType.OTO)
    if (goods.buyCount == 0) goods.buyCount = undefined
    let goodsList = cartUtil.modifyGoodsList(this.data.goodsList, goods);
    // 在商品详情中重新设置下数据
    this.setData({
      goodsList: goodsList,
    })
    this.refreshNum()
  },

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

  refreshNum: function () {
    let totalBuyCount = cartUtil.getTotalBuyCount()
    this.setData({
      totalBuyCount: totalBuyCount
    })
  },

  //跳转商品详情
  goGoodsDetail: function (e) {
    let goods = e.currentTarget.dataset.goodsinfo
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id=' + goods.id,
    })
  },

  toCart: function () {
    wx.switchTab({
      url: '../shoppingCar/shoppingCar',
    })
  },
  onjumpPage: function (e) {
    let jumpLink = e.currentTarget.dataset.link
    if (jumpLink.indexOf("category/category") != -1) {
      if (jumpLink.indexOf("?") != -1) {
        const params = jumpLink.split('?')[1];
        app.globalData.categoryId = params.split('=')[1];
      }
      wx.switchTab({
        url: "../category/category",
        complete() {
          wx.hideLoading() //关闭loding
        },
        fail(res) {
          console.info(res)
        }
      })
    } else {
      wx.navigateTo({
        url: jumpLink,
      })
    }
  },
  toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 页面滚动距离
   */
  onPageScroll: function (e) {
    // var height = this.data.boxHeight1 + this.data.boxHeight2 + this.data.boxHeight3 + this.data.boxHeight4 + this.data.boxHeight5 - this.data.boxHeight
    // var flag = false
    // console.log(height+'+'+e.scrollTop+'+'+ this.data.isReady)
    // flag = e.scrollTop >= height
    // if (this.data.isReady&&flag == this.data.flag) return //防止过多setdata影响效率
    // this.setData({
    //   flag
    // })
    console.log(e.scrollTop)
    let that = this
    let flag = that.data.tabTop -80<= e.scrollTop
    if (flag == that.data.flag) return //防止过多setdata影响效率
    that.setData({
      flag: flag
    })
    // wx.createSelectorQuery().in(this).select('#tabcategory').boundingClientRect(function (rect) {
    //   let flag = rect.top - 70 < 0
    //   if (flag == that.data.flag) return //防止过多setdata影响效率
    //   that.setData({
    //     flag: flag
    //   })
    // }).exec()
  },
  /**
   * 分类轮播切换分页
   */
  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  }
})