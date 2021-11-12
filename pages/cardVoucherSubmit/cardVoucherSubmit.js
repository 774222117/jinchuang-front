const app = getApp();
const MerchantCardUrl = require('../../utils/config.js').HttpConfig.MerchantCardUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX:false,
    cardVoucherInfo:[],
    //订单号
    orderId: 0,
    //用户Id,
    peopleId: 0,
    //促销ID
    saleActivityId: 0,
    //接受的数据
    shopCart: [],
    //支付金额
    payAmount: 0,
    //用户余额
    peopleBalance: 0,
    //是否显示余额充值按钮
    isShowBalanceRecharge: false,

    /*********** 优惠券相关 ********** */
    //优惠券描述
    couponDetail: '',
    //优惠券列表
    myCoupons: [],
    //可用红包个数
    useCouponCount: 0,

    /*********** 配送费相关 ********** */
    //配送费 暂时写死
    dispatchPrice: 0,
    //配送优惠金额
    dispatchDiscountPrice: 0,
    //是否显示配送费 写死不显示
    isShowDispatchPrice: false,

    /*********** 界面录入 ********** */
    //选择的红包
    couponMonery: 0,
    //提货人
    pickerName: '',
    //提货人联系电话
    pickerMobile: '',
    //订单备注
    buyRemark: '',
    flag: false,
    pickerName: '',
    pickerMobile: '',
    regionInfo: '',
    detailInfo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 水果机 底部遮挡
     this.setData({
      "isIphoneX": this.isIphoneX()
    })
    this.setData({
      cardVoucherInfo: app.globalData.cardVoucherInfo
    })
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
  // 判断水果机
  isIphoneX() {
    let info = wx.getSystemInfoSync();
    if (/iPhone X/i.test(info.model)) {
      return true;
    } else {
      return false;
    }
  },
  addCount:function(){
    let buyCount = this.data.cardVoucherInfo.buyCount+1
    this.data.cardVoucherInfo.buyCount = buyCount
    this.data.cardVoucherInfo.sumPrice = this.data.cardVoucherInfo.realPrice*buyCount
    this.setData({
      cardVoucherInfo:this.data.cardVoucherInfo
    })
  },
  delCount:function(){
    let buyCount = this.data.cardVoucherInfo.buyCount
    if(buyCount<=1){
      wx.showToast({
        title: '购买数量不能小于1',
        icon:'none'
      })
      return
    }
    buyCount = this.data.cardVoucherInfo.buyCount-1
    this.data.cardVoucherInfo.buyCount = buyCount
    this.data.cardVoucherInfo.sumPrice = this.data.cardVoucherInfo.realPrice*buyCount
    this.setData({
      cardVoucherInfo:this.data.cardVoucherInfo
    })
  },
  submitOrder:function(){
    let that = this
    if(this.data.cardVoucherInfo.orderType==2&&!this.data.flag){
      wx.showToast({
        title: '请选择收货地址',
        icon:'none'
      })
      return
    }
    if (this.data.isSubmit) return
    this.setData({
      isSubmit: true
    })
    let orderInfo = this.createOrderInfo();
    if (orderInfo == null) {
      this.setData({
        isSubmit: false
      })
      return
    }

    console.log("订单数据：" + JSON.stringify(orderInfo))
    //提交数据
    wx.showLoading({
      title: '正在提交...',
      mask: true
    })

    wx.request({
      url: MerchantCardUrl.SubmitCardBuyUrl,
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
          wx.showToast({
            title: res.data.message || '提交订单异常！',
            icon: 'none'
          });
          return
        }
        wx.redirectTo({
          url: '/pages/settlement/settlement?orderId='+res.data.data.id,
        })
      },
      fail: function () {
        that.setData({
          isSubmit: false
        })
      }
    })
  },
   /**
   * 生成订单
   */
  createOrderInfo: function () {
    let that = this
    let orderInfo = {
      merchantId: 1,
      supplierId: -1,
      //提货人
      pickerName: this.data.pickerName,
      //提货人电话
      pickerMobile: this.data.pickerMobile,
      //配送各区域
      regionInfo: this.data.regionInfo,
      //配送地址
      detailInfo: this.data.detailInfo,
      //用户ID
      peopleId: app.globalData.userInfo.id,
      //openId
      openId: app.globalData.userInfo.wxMinOpenId,

      //订单备注
      buyRemark: '',
      //支付金额
      price: this.data.cardVoucherInfo.sumPrice,
      //商品金额
      goodsPrice: this.data.cardVoucherInfo.sumPrice,
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
      //卡类型 0 电子 2 实体卡
      orderType:this.data.cardVoucherInfo.orderType
    }
    //商品数据
    let orderGoods = []
    if (this.data.cardVoucherInfo.buyCount == 0) {
      wx.showToast({
        title: '商品数量为零！',
        icon: 'none'
      });
      return null
    }
    let goods = {
      cardId: this.data.cardVoucherInfo.id,
      total: this.data.cardVoucherInfo.buyCount,
      price: this.data.cardVoucherInfo.nominalPrice,
      realPrice: this.data.cardVoucherInfo.realPrice,
      productPrice: this.data.cardVoucherInfo.nominalPrice,
      spu:''
    }
    orderGoods.push(goods)

    //添加商品数据
    orderInfo.goodsItems = orderGoods

    return orderInfo
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
