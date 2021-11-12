// pages/goodsDetails/goodsDetails.js
const app = getApp()
const GoodsUrl = require('../../utils/config.js').HttpConfig.GoodsUrl;
const HttpClient = require('../../utils/util.js').HttpClient;
const Message = require('../../utils/util.js').Message;
const cartUtil = require('../../utils/cart');
const PageGo = require('../../utils/util.js').PageGo;
//html解析模块
let htmlParse = require('../../components/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {},
    scrollHeight: 0,
    isIpx: false,
    specs: "请选择规格数量",
    discount: '暂无优惠券',
    isShow: false,
    isShow2: false,
    choosedSku: "",
    active1: 0,
    active2: 0,
    num: 0,
    totalBuyCount: 0, //购物车商品数
    type: '' //根据self的值判断
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.getGoodsInfo(options.id)
    //获取屏幕高度
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollHeight: res.windowHeight - 65
        })
      }
    });
    this.isIphoneX()
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
    let totalBuyCount = cartUtil.getTotalBuyCount();
    this.setData({
      totalBuyCount
    });
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
  //自定义方法
  /**
   * 判断机型
   */
  isIphoneX: function () {
    let model = wx.getSystemInfoSync().model;
    let isIpx = model.indexOf("iPhone X") > -1 || model.indexOf("unknown<iPhone") > -1 || model.indexOf("iPhone Max") > -1 || model.indexOf("iPhone 11") > -1 || model.indexOf("iPhone 12") > -1;
    isIpx && this.setData({
      isIpx: true
    });
  },
  /**
   * 根据id获取商品详情
   */
  getGoodsInfo(id) {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true

    })
    HttpClient.Method.get(GoodsUrl.InfoUrl, {
      goodsId: id
    }, function (res) {
      wx.hideLoading()
      if (res.data.flag) {
        let goodsInfo = res.data.data;

        if (goodsInfo.self == 1) {
          that.setData({
            type: 1,
            goodsInfo,
            specs: goodsInfo.spec
          })
        } else {
          that.setData({
            type: 0,
            goodsInfo,
            choosedSku: res.data.data.goodsSkuSpecs[0]
          })
        }

        // 模板渲染

        let ruleInfo = goodsInfo.content ? goodsInfo.content.replaceAll("\\", "").replaceAll("\"/", "\"") : ''
        if (ruleInfo) {
          htmlParse.wxParse('commodityDetails', 'html', ruleInfo, that, 5);
        }
      } else {
        Message.Alert.alertDefault(res.data.message);
      }
    })
  },
  addToCart:function(){
    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    let that = this
    if (this.data.type == 1) {
      this.addCart()
    } else {
      this.setData({
        isShow: !that.data.isShow,
        num: 1,
      })
      this.initShopCart()
    }
  },
  /**
   * 弹出分类框
   */
  showDialog() {
    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    let that = this
    if (this.data.type == 1) {
      this.addCart()
      this.topay()
    } else {
      this.setData({
        isShow: !that.data.isShow,
        num: 1,
      })
      this.initShopCart()
    }
  },
  /**
   * 弹出优惠券框
   */
  showDialog2() {
    let that = this
    return
    this.setData({
      isShow2: !that.data.isShow2,
    })
  },
  /**
   * 无效果点击
   */
  nothing() {

  },
  /**
   * 选择保质期
   */
  chooseSkuSpecs: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      active1: index,
      active2: 0,
      choosedSku: this.data.goodsInfo.goodsSkuSpecs[index],

    })
    this.initShopCart()
  },
   /**
   * 选择规格
   */
  chooseChildSku: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      active2: index
    })
    this.initShopCart()
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
    if (flag == 1) {
      that.addCart()
    } else {
      // if (that.data.num < 2) {
      //   wx.showToast({
      //     title: '不能在减少啦！',
      //     icon: 'none'
      //   })
      // } else {
      //   that.setData({
      //     num: that.data.num - 1
      //   })
      // }
      that.delCart()
    }
  },
  gotoIndex: function () {
    PageGo.switchTo('/pages/index/index');
  },
  gotoCart: function () {
    PageGo.switchTo('/pages/shoppingCart/shoppingCart');
  },
  /**
   * 加入购物车
   * @param e
   */
  addCart: function () {
    let goods = this.data.goodsInfo
    let buyCount = 0
    if (goods.buyCount) {
      buyCount = goods.buyCount
    }


    if (this.data.type == 1) {
      goods.specSku = ''
      goods.specDesc=''
      goods.tradeTypeId=3
      goods.limitDate ==''
    } else {
      let curGoodsSku = this.data.choosedSku.childs[this.data.active2]
      goods.specSku = curGoodsSku.specSku
      goods.marketPrice = curGoodsSku.specPrice
      goods.specDesc = curGoodsSku.specDesc
      goods.tradeTypeId= goods.tradeTypeId
      goods.limitDate = this.data.choosedSku.specDesc
    }


    console.log(goods)
    goods = cartUtil.addShopCart(goods, cartUtil.cartType.OTO)
    if (goods.buyCount > buyCount) {
      wx.showToast({
        title: '添加购车成功',
        icon: 'none'
      })
    }
    let totalBuyCount = cartUtil.getTotalBuyCount();
    this.setData({
      totalBuyCount,
      num: goods.buyCount
    })
  },
  /**
   * 加入购物车
   * @param e
   */
  delCart: function () {
    let goods = this.data.goodsInfo
    let buyCount = 0
    if (goods.buyCount) {
      buyCount = goods.buyCount
    }
    let curGoodsSku = this.data.choosedSku.childs[this.data.active2]
    goods.specSku = curGoodsSku.specSku
    goods.marketPrice = curGoodsSku.specPrice
    console.log(goods)
    goods = cartUtil.delShopCart(goods, cartUtil.cartType.OTO)
    let totalBuyCount = cartUtil.getTotalBuyCount();
    this.setData({
      totalBuyCount,
      num: goods.buyCount
    })
  },
  initShopCart: function () {
    let shopCart = cartUtil.getShopCart(cartUtil.cartType.OTO)
    let goodsInfo = this.data.goodsInfo
    let buyCount = 0
    let curGoodsSku = this.data.choosedSku.childs[this.data.active2]
    shopCart.forEach((item) => {
      if (item.goodsId == goodsInfo.id && curGoodsSku.specSku == item.specSku) {
        buyCount = item.total
      }
    })
    this.setData({
      num: buyCount
    })
  },
  topay: function () {
    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    if (this.data.goodsInfo.buyCount==undefined|| this.data.goodsInfo.buyCount<= 0) {
      if(!this.data.isShow){
        this.showDialog()
        return
      }
      wx.showToast({
        title: '请选择需要购买的数量',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '../orderSubmit/orderSubmit',
    })
  },
  /**
   * 预览轮播图
   */
  handlePreviewImg(e) {
    console.log(e)
    //构造图片数组
    const urls = this.data.goodsInfo.pictures
    //点击的图片
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      urls,
      current
    })
  }
})
