const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const Message = require('../../utils/util.js').Message;
const IndexUrl = require('../../utils/config.js').HttpConfig.IndexUrl;
const PageGo = require('../../utils/util.js').PageGo;
const imgUrl = require('../../utils/config.js').HttpConfig.imgUrl;
let cartUtil = require('../../utils/cart')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCity: '',
    customBar: '0',
    imgUrl: imgUrl,
    // 轮播的配置
    indicatorDots: true, //是否需要指示点
    indicatorColor: "rgba(255,255,255,0.65)", //指示点颜色
    indicatorActiveColor: "rgba(255,255,255,1)", //当前选中指示点颜色
    autoplay: true, //是否自动切换
    interval: 5000, //自动时长
    duration: 500, //滑动动画时长

    peopleId: -1,
    allDataObj: {},
    current: 1, //当前页
    limit: 10, //1页数据量
    categories: [],
    curCategoryIndex: 0,
    homeModuleId: '',
    goodsList: [],
    tabFixed: false,
    //分类轮播序号
    categorySwpIndex: 0,
    firstLoad:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取设备信息
    wx.getSystemInfo({
      success: e => { // { statusBarHeight: 20, ... }，单位为 px
        // 获取右上角胶囊的位置信息
        let info = wx.getMenuButtonBoundingClientRect() // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
        let CustomBar = info.bottom + info.top - e.statusBarHeight
        console.log(CustomBar)
        this.setData({
          customBar: CustomBar
        })
      }
    })
    this.setData({
      navH: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      navHeight: app.globalData.navHeight,
      statusBarHeight: app.globalData.statusBarHeight,
    })
    this.loadIndexInfo()
    this.loadCategories()
  },
  changeCity: function () {
    wx.navigateTo({
      url: '/pages/chooseCity/chooseCity'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    cartUtil.refreshCartNum();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      firstLoad: false
    })
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
  onPageScroll: function (e) {
    this._update()
    this.setData({
      firstLoad: true
    })
  },
  _update: function () {
    var query = wx.createSelectorQuery().in(this)
    query.select('#category').boundingClientRect(res => {
      let tabFixed = res.top - 80 < 0
      if (tabFixed == this.data.tabFixed) return //防止过多setdata影响效率
      this.setData({
        tabFixed: tabFixed
      })
    }).exec()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMoreGoodsInfo(this.data.homeModuleId)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /****************自定义方法**************************************** */
  //加载首页模块数据
  loadIndexInfo: function () {
    let that = this
    let peopleId = -1
    if (app.globalData.userInfo != undefined) {
      peopleId = app.globalData.userInfo.id
    }
    HttpClient.Method.get(IndexUrl.InfoUrl, {
      peopleId: peopleId
    }, function (res) {
      that.distributeAllData(res)
    })
  },
  // 分发所有数据到allDataObj
  distributeAllData: function (data) {
    let that = this;
    that.setData({
      allDataObj: {}
    })
    for (var i = 0; i < data.data.length; i++) {
      that.data.allDataObj[data.data[i].code] = data.data[i].banners;
      if (data.data[i].code == "enjoy") {
        that.setData({
          enjoyName: data.data[i].name
        })
      }
    }
    that.setData({
      allDataObj: that.data.allDataObj
    })
    //是否显示pop弹框
    if (that.data.allDataObj.pop && that.data.allDataObj.pop.length > 0) {
      that.setData({
        popModelIsShow: true
      })
    }
    that.caulTime()
  },
  loadCategories: function () {
    let that = this
    let categories = []
    Message.Loading.loadingDefault()
    HttpClient.Method.get(IndexUrl.ModuleCategoryData, {}, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        categories = res.data.data
        if (categories.length > 0) {
          let homeModuleId = categories[that.data.curCategoryIndex].id
          that.setData({
            categories
          })
          that.loadMoreGoodsInfo(homeModuleId)
        }
      }
    })
  },
  commodityAdTouch: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.jump,
    })
  },
  //加载首页更多超值精选
  loadMoreGoodsInfo: function (hmId) {
    let that = this
    let curHomeModuleId = this.data.homeModuleId
    //let peopleId = -1
    // if (app.globalData.userInfo != undefined) {
    //   peopleId = app.globalData.userInfo.id
    // }
    Message.Loading.loadingDefault();
    HttpClient.Method.get(IndexUrl.ModuleDetailData, {
      homeModuleId: hmId,
      current: that.data.current,
      limit: that.data.limit
    }, function (res) {
      Message.Loading.close()
      if (res.data.flag) {
        if (hmId == curHomeModuleId) {
          that.setData({
            goodsList: that.data.goodsList.concat(res.data.data.rows),
            current: that.data.current + 1
          });
        } else {
          that.setData({
            goodsList: res.data.data.rows,
            homeModuleId: hmId,
            current: that.data.current + 1
          });
        }
        that.initShopCart()
      }
    })
  },
  onjumpPage: function (e) {
    let contentid = ''
    let popcontent = ''
    switch (e.currentTarget.dataset.item.bannerType) {
      case 1:
        contentid = e.currentTarget.dataset.item.navigateId
        popcontent = e.currentTarget.dataset.item.navigateName
        wx.navigateTo({
          url: '../coupondetail/coupondetail?source=' + clicktype + '&id=' + e.currentTarget.dataset.item.navigateId,
          success() {
            console.log('success')
          },
          fail() {
            console.log('fail')
          },
          complete() {
            wx.hideLoading() //关闭loding
          }
        })
        break;
        case 3:
          wx.navigateTo({
            url: '../webView/webView?path=' + e.currentTarget.dataset.item.navigateUrl,
            success() {
              console.log('success')
            },
            fail() {
              console.log('fail')
            },
            complete() {
              wx.hideLoading()//关闭loding
            }
          })
        break;
      case 5:
        popcontent = e.currentTarget.dataset.item.navigateUrl
        //如果跳转目标是分类页
        if (popcontent.indexOf("category/category") != -1) {
          if (popcontent.indexOf("?") != -1) {
            const params = popcontent.split('?')[1];
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
            url: popcontent,
          })
        }
        break
      case 8:
        contentid = e.currentTarget.dataset.item.navigateId
        wx.navigateTo({
          url: '../promotion/promotion?activityId=' + contentid,
          complete() {
            wx.hideLoading() //关闭loding
          }
        })
        break
      case 9:
        contentid = e.currentTarget.dataset.item.navigateId
        wx.navigateTo({
          url: '../promotion/promotion?activityId=' + contentid,
          complete() {
            wx.hideLoading() //关闭loding
          }
        })
        break

    }
    //关闭弹窗
    this.setData({
      popModelIsShow: false
    })
  },
  toSeckill: function (e) {
    let contentid = e.currentTarget.dataset.item.navigateId
    wx.navigateTo({
      url: '../seckill/seckill?activityId=' + contentid,
      complete() {
        wx.hideLoading() //关闭loding
      }
    })
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
      goodsList: goodsInfoList
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
    let goodsList = cartUtil.modifyGoodsList(this.data.goodsList, goods);
    if (goods.buyCount > buyCount) {
      wx.showToast({
        title: '添加购车成功',
        icon: 'none'
      })
      this.setData({
        goodsList: goodsList,
      })
      cartUtil.refreshCartNum()
    }
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
    let goods = e.currentTarget.dataset.info
    goods = cartUtil.delShopCart(goods, cartUtil.cartType.OTO)
    if (goods.buyCount == 0) goods.buyCount = undefined
    let goodsList = cartUtil.modifyGoodsList(this.data.goodsList, goods);
    // 在商品详情中重新设置下数据
    this.setData({
      goodsList: goodsList,
    })
    cartUtil.refreshCartNum()
  },
  toMoreCardVoucher: function () {
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
  //底部类别点击事件
  touchCategory: function (e) {
    let curCategoryIndex = e.currentTarget.dataset.index;
    let homeModuleId = e.currentTarget.dataset.id;
    let curHomeModuleId = this.data.homeModuleId
    if (curHomeModuleId == homeModuleId) {
      return
    }
    this.setData({
      current: 1,
      curCategoryIndex
      // homeModuleId,
      // goodsList:[]
    });
    this.loadMoreGoodsInfo(homeModuleId)
  },
  gotoSearch: function () {
    PageGo.jump('/pages/search/search', {
      title: ''
    })
  },
  //跳转商品详情
  goGoodsDetail: function (e) {
    let goods = e.currentTarget.dataset.goodsinfo
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id=' + goods.id,
    })
  },
  //计算倒计时
  caulTime: function () {
    if (!this.data.allDataObj.plate || this.data.allDataObj.plate.length == 0) {
      return
    }
    let that = this
    let seckill = this.data.allDataObj.seckill[0];
    if(seckill && seckill.endTime) {
      let endTimeStr = seckill.endTime
      let endTime = new Date(endTimeStr.replace(/-/g, '/'))
      let now = new Date()
      that.timedifference(now, endTime)
    }
    setTimeout(function () {
      that.caulTime();
    }, 1000)
  },
  ////计算两个时间之间的时间差
  timedifference: function (faultDate, completeTime) {
    var stime = Date.parse(faultDate); //获得开始时间的毫秒数
    var etime = Date.parse(completeTime); //获得结束时间的毫秒数
    var usedTime = etime - stime; //两个时间戳相差的毫秒数
    // var days = Math.floor(usedTime / (24 * 3600 * 1000));
    // //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(usedTime / (3600 * 1000)); //将剩余的毫秒数转化成小时数
    //计算相差分钟数
    var leave1 = usedTime % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave1 / (60 * 1000)); //将剩余的毫秒数转化成分钟
    //计算相差秒数
    var leave2 = leave1 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.floor(leave2 / 1000); //将剩余的毫秒数转化成秒数

    minutes = minutes > 9 ? minutes : '0' + minutes
    seconds = seconds > 9 ? seconds : '0' + seconds
    this.setData({
      hour: hours,
      minute: minutes,
      second: seconds
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
    let goodsList = cartUtil.modifyGoodsList(this.data.goodsList, goods);
    if (goods.buyCount > buyCount) {
      wx.showToast({
        title: '添加购车成功',
        icon: 'none'
      })
      this.setData({
        goodsList: goodsList,
      })
      cartUtil.refreshCartNum()
    }
  },
  //确定去兑换
  toExchange: function (e) {
    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    let url = ''
    let cardid = e.currentTarget.dataset.id
    let sellType = e.currentTarget.dataset.selltype
    if (sellType == "2") {
      url = '/pages/cardVoucherOfflineDetail/cardVoucherOfflineDetail?id=' + cardid
    } else if (sellType == 1) {
      url = '/pages/cardVoucherDetail/cardVoucherDetail?id=' + cardid
    } else {
      url = '/pages/cardVoucherList/cardVoucherList'
    }

    wx.navigateTo({
      url: url
    })
  },
  changeSwp: function (e) {
    this.setData({
      categorySwpIndex: e.detail.current
    })
  },
  onTabItemTap(item) {
    if (!this.data.firstLoad) {
      return;
    }
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})
