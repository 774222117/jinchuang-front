// pages/orderSubmit/orderSubmit.js
//购物车
const app = getApp()
//获取优惠券
const myOrderCouponsUrl = require('../../utils/config.js').HttpConfig.OrderUrl.MyOrderCouponsUrl;
//重新支付
const PayOrderUrl = require('../../utils/config.js').HttpConfig.OrderUrl.PayOrderUrl;
//提交订单
const SubmitShopOrderUrl = require('../../utils/config.js').HttpConfig.OrderUrl.SubmitShopOrderUrl;
const Message = require('../../utils/util.js').Message;
let shopcartUtil = require('../../utils/cart')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: false,
    flag: false,
    pickerName: '',
    pickerMobile: '',
    regionInfo: '',
    detailInfo: '',
    shopCart: [],
    cartTypeName: shopcartUtil.cartType.OTO,
    sumPrice: 0, //总价
    sumProductPrice: 0, // 折前总价
    buyCount: 0, //总数
    isShow: false,
    isShow2: false,
    buyRemark: '', //备注
    name: '', //姓名
    cardId: '', //身份证号码
    peopleId: 0,
    //支付方式 1 余额 2 优惠金额
    payType: 2,
    //促销ID
    saleActivityId: 0,
    //订单号
    orderId: 0,
    //优惠券描述
    couponDetail: '暂无',
    //优惠券列表
    myCoupons: [],
    //可用红包个数
    useCouponCount: 0,
    //是否填身份证姓名
    isShowId: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      name:app.globalData.userInfo.name,
      cardId:app.globalData.userInfo.IDCard
    })
    // 判断机型
    this.isIphoneX()
    //获取优惠券
    this.getMyOrderCoupon()
    //获取购物车
    //购物车数据
    let shopCart = shopcartUtil.getShopCart(this.data.cartTypeName)
    for (var i = 0; i < shopCart.length; i++) {
      //1：保税直供（原保税），2：完税进口（原一般贸易），3：国内贸易，4：香港直邮，5：海外直邮
      //2 3不需要检查
      if (shopCart[i].self == 0&&shopCart[i].tradeTypeId!=2&&shopCart[i].tradeTypeId!=3) {
        this.setData({
          isShowId: true
        })
        break
      }
    }
    let cartTotal = shopcartUtil.getShopCartTotal(this.data.cartTypeName);
    if (!cartTotal.sumPrice) {
      cartTotal.sumPrice = 0;
    }
    this.setData({
      peopleId: app.globalData.userInfo.id,
      shopCart: shopCart.filter(item =>
        item.isChoosed
      ),
      sumPrice: cartTotal.sumPrice,
      buyCount: cartTotal.buyCount,
      sumProductPrice: cartTotal.sumProductPrice
    })
    if (options.saleActivityId) {
      this.setData({
        saleActivityId: options.saleActivityId
      })
    }
    this.getPeopleLocalInfo()
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
   * 选择收货地址
   */
  chooseAddress() {
    let that = this
    wx.chooseAddress({
      success: (res) => {
        that.setData({
          flag: true,
          pickerName: res.userName,
          pickerMobile: res.telNumber,
          regionInfo: res.provinceName + '-' + res.cityName + '-' + res.countyName,
          detailInfo: res.detailInfo
        })
        wx.setStorageSync("regionInfo", that.data.regionInfo)
        wx.setStorageSync("detailInfo", that.data.detailInfo)
        wx.setStorageSync("pickerName", that.data.pickerName)
        wx.setStorageSync("pickerMobile", that.data.pickerMobile)
      },
    })
  },
  /**
   * 弹出优惠券框
   */
  showDialog() {
    let that = this
    this.setData({
      isShow: !that.data.isShow,
    })
  },
  /**
   * 弹出身份信息框
   */
  showDialog2() {
    let that = this
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
   * 选择优惠券
   */
  chooseDiscount(e) {
    //获取商品
    let goods = e.currentTarget.dataset.goodsinfo
    let allChoosed = true
    this.data.shopCart.forEach((item) => {
      if (item.goodsId == goods.goodsId) {
        item.isChoosed = !item.isChoosed
        if (!item.isChoosed) {
          this.setData({
            isChoosedAll: false
          })
          allChoosed = false
        }
      }
    })
    this.setData({
      isChoosedAll: allChoosed,
      shopCart: this.data.shopCart
    })
  },
  /**
   *
   * 获取输入的备注
   */
  getValue: function (e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  /**
   * 点击提交订单
   */
  submitOrder() {
    if (!this.data.flag) {
      wx.showToast({
        title: '请选择收货地址！',
        icon: 'none'
      })
    } else {
      if(this.data.isShowId){
        this.showDialog2()
      }
      else{
        this.confirmSubmit()
      }
    }
  },
  /**
   * 校验身份证号码
   */
  idcardblur() {
    let idcard = this.data.cardId
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

    if (reg.test(idcard) == false) {
      wx.showToast({
        title: '身份证号码有误',
        icon: 'none',

      })
      return false
    } else {
      return true
    }

  },

  /**
   * 获取我的优惠券
   */
  getMyOrderCoupon: function () {
    let that = this
    //组织数据
    let orderInfo = {
      //用户ID
      peopleId: this.data.peopleId,
      //支付金额
      price: this.data.sumPrice,
    }
    //商品数据
    let orderGoods = []
    this.data.shopCart.forEach((item) => {
      let goods = {
        goodsId: item.goodsId,
        total: item.total,
        price: item.price,
        realPrice: item.realPrice
      }
      orderGoods.push(goods)
    })
    orderInfo.goodsItems = orderGoods

    wx.showLoading({
      title: '正在加载数据，请稍后...',
      mask: true
    })

    wx.request({
      url: myOrderCouponsUrl,
      method: 'post',
      data: orderInfo,
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '获取优惠券出错,网络异常！',
          icon: 'none'
        });
      },
      success: function (res) {
        wx.hideLoading()
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '获取优惠券信息失败！',
            icon: 'none'
          });
          return
        }
        that.setData({
          //可用红包个数
          useCouponCount: res.data.code,
          //红包描述
          couponDetail: res.data.message,
          //优惠券列表
          myCoupons: res.data.data
        })
        //有可用红包
        if (that.data.useCouponCount == 1) {
          let couponMonery = res.data.data[0].productByMoney
          let cartTotal = shopcartUtil.getShopCartTotal(that.data.cartTypeName)
          let payAmount = parseFloat((cartTotal.sumPrice - couponMonery + (that.data.dispatchPrice - that.data.dispatchDiscountPrice)).toFixed(2))
          payAmount = payAmount > 0 ? payAmount : 0
          that.setData({
            selectCoupon: res.data.data[0],
            couponDetail: "-￥" + couponMonery,
            couponMonery: couponMonery,
            payAmount: payAmount
          })
        }
      }
    })
  },
  /**
   * 确认提交
   */
  confirmSubmit() {
    let that = this
    if(this.data.isShowId){
      if (!this.data.name) {
        wx.showToast({
          title: '请输入姓名！',
          icon: 'none',
        })
        return
      }
      if (!this.data.cardId) {
        wx.showToast({
          title: '请输入身份证号码！',
          icon: 'none',
        })
        return
      }
    }
    let orderInfo = {
      merchantId: 1,
      supplierId: -1,
      //提货人
      pickerName: this.data.pickerName,
      //提货人电话
      pickerMobile: this.data.pickerMobile,//this.data.pickerMobile
      //配送各区域
      regionInfo: this.data.regionInfo,
      //配送地址
      detailInfo: this.data.detailInfo,
      //用户ID
      peopleId: this.data.peopleId,
      //openId
      openId: app.globalData.userInfo.wxMinOpenId,

      //订单备注
      buyRemark: this.data.buyRemark,
      //支付金额
      price: this.data.sumPrice,
      //商品金额
      goodsPrice: this.data.sumPrice,
      //优惠金额
      discountPrice: 0,
      //使用优惠券Id
      useCouponId: 0,
      //优惠券卡
      useCouponCode: "",
      //优享卡Id
      couponId: 0,
      //配送费
      dispatchPrice: 0,
      //包装费
      packPrice: 0,
      //支付方式
      payType: this.data.payType,
      //促销活动id
      saleActivityId: this.data.saleActivityId,
      //身份证
      idCard: this.data.cardId,
      //真实姓名
      realName:this.data.name,
      //订单类型
      orderType:1
    }
    //优惠券金额
    if (this.data.selectCoupon) {
      orderInfo.useCouponId = this.data.selectCoupon.couponId
      orderInfo.useCouponCode = this.data.selectCoupon.couponCode
      orderInfo.discountPrice = this.data.selectCoupon.productByMoney
    }

    //商品数据
    let orderGoods = []
    let sumTotal = 0
    this.data.shopCart.forEach((item) => {
      if (item.isChoosed) {
        sumTotal += item.total
        let goods = {
          goodsId: item.goodsId,
          total: item.total,
          price: item.price,
          realPrice: item.realPrice,
          productPrice: item.productPrice,
          spu: item.specSku
        }
        orderGoods.push(goods)
      }

    })
    if (sumTotal == 0) {
      wx.showToast({
        title: '商品数量为零！',
        icon: 'none'
      });
      return null
    }
    //添加商品数据
    orderInfo.goodsItems = orderGoods

    if (this.data.isSubmit) return
    this.setData({
      isSubmit: true
    })
    //首次提交
    let url = SubmitShopOrderUrl
    if (that.data.orderId > 0) {
      url = PayOrderUrl
      orderInfo.id = this.data.orderId
    }
    //提交数据
    wx.showLoading({
      title: '正在提交...',
      mask: true
    })

    wx.request({
      url: url,
      method: 'post',
      data: orderInfo,
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '订单提交出错,网络异常！',
          icon: 'none'
        });
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          isSubmit: false
        })
        //判断是否有错
        if (!res.data.flag) {
          Message.Modal.Default(res.data.message)
          return
        }
        let userinfo = app.globalData.userInfo
        userinfo.name = that.data.name
        userinfo.IDCard = that.data.cardId
        app.setUserInfo(userinfo)
        that.clearShopCart()
        wx.redirectTo({
          url: '/pages/settlement/settlement?orderId=' + res.data.data.id,
        })
      },
      fail: function () {
        that.setData({
          isSubmit: false
        })
      }
    })
  },
  clearShopCart: function () {
    shopcartUtil.clearShopCart(shopcartUtil.cartType.OTO)
  },
  /**
   * 获取提货人信息
   */
  getPeopleLocalInfo: function () {
    let pickerName = wx.getStorageSync("pickerName")
    let pickerMobile = wx.getStorageSync("pickerMobile")
    let regionInfo = wx.getStorageSync("regionInfo")
    let detailInfo = wx.getStorageSync("detailInfo")
    if (regionInfo) {
      this.setData({
        flag:true,
        pickerName: pickerName,
        pickerMobile: pickerMobile,
        regionInfo: regionInfo,
        detailInfo: detailInfo
      })
    }
  },
})
