// pages/settlement/settlement.js
const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const OrderUrl = require('../../utils/config.js').HttpConfig.OrderUrl;
const PeopleInfoUrl = require('../../utils/config.js').HttpConfig.PeopleInfoUrl
//放弃支付
const PayFaildOrderUrl = require('../../utils/config.js').HttpConfig.OrderUrl.PayFaildOrderUrl;
const Message = require('../../utils/util.js').Message;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 输入框参数设置
    input_value: "",
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "98rpx",//输入框高度
      width: "604rpx",//输入框宽度
      see: false,//是否明文展示
      interval: false//是否显示间隔格子
    },
    stage:true,//有两个页面，这是标识哪个页面显示
    showPayPwdInput:false,//显示支付密码操作界面
    orderId: '',
    peopleId: '',
    payInfo: {},
    surplusMsg: '',
    orderStatus: true,
    surplusMinutes: 0,
    surplusSeconds: 0,
    toPayInfo: {
      payType: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const userInfo = app.globalData.userInfo;
    that.setData({
      orderId: options.orderId,
      peopleId : userInfo.id
    })
    that.iniPayInfo()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  valueSix:function(secret){
    let that = this
    // 校验密码
    let secretVal = secret.detail
    const params = {}
    params.secret = secretVal
    params.peopleId = that.data.peopleId
    HttpClient.Method.get(OrderUrl.CheckSecretUrl, params , function (res) {
      if(res.data.flag){
        // 发起卡支付
        that.toPayCard(secretVal)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        });
      }
    })

    console.info('密码是多少' + that.data.inputData.input_value)
    this.setData({
      showPayPwdInput:false,
    })
  },
  deductionBtn:function(){
    // robber TODO
    // if(!that.data.orderStatus){
    //   wx.showToast({
    //     title: '订单已超时',
    //     icon: 'none'
    //   });
    //   return false
    // }
    this.checkPeopleHadPsw()
    // this.setData({
    //   showPayPwdInput:true
    // })
  },
  //校验用户是否设置过密码
  checkPeopleHadPsw: function () {
    let that = this
    Message.Loading.loadingDefault()
    HttpClient.Method.get(PeopleInfoUrl.peopleHadPswUrl, {
      peopleId: that.data.peopleId
    }, function (res) {
      Message.Loading.close();
      if (res.data.flag) {
        that.setData({
          showPayPwdInput: true
        })
      } else {
        wx.showToast({
          title: '请先设置支付密码',
          icon: 'none'
        })
        wx.navigateTo({
          url: '/pages/retrievePassword/retrievePassword?type=0',
        })
      }
    })
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
  iniPayInfo: function () {
    let that = this
    const params = {}
    params.peopleId = that.data.peopleId
    params.orderId = that.data.orderId
    HttpClient.Method.get(OrderUrl.PayInfoUrl, params , function (res) {
      if(res.data.flag){
        let data = res.data.data
        if(data.myCards){
          if(data.myCards.length > 0){
            that.setData({
              stage: true
            })
          }else{
            that.setData({
              stage: false
            })
          }
          data.myCards.forEach(item=>{
            // 处理余额
            let cardBalanceStr = String(item.cardBalance)
            if(cardBalanceStr.includes(".")){
              item.cardBalanceLeft = cardBalanceStr.split(".")[0]
              item.cardBalanceRight = cardBalanceStr.split(".")[1]
            }else{
              item.cardBalanceLeft = cardBalanceStr
              item.cardBalanceRight = "00"
            }
          })
        }
        // 处理应付实付金额
        let realPrice = data.realPrice
        if(realPrice) {
          let realPriceStr = String(realPrice)
          if(realPriceStr.includes(".")){
            data.realPriceLeft = realPriceStr.split(".")[0]
            data.realPriceRight = realPriceStr.split(".")[1]
          }else{
            data.realPriceLeft = realPriceStr
            data.realPriceRight = "00"
          }
        }else{
          data.realPriceLeft = "0"
          data.realPriceRight = "00"
        }
        // 处理抵扣金额
        let balancePrice = data.balancePrice
        if(balancePrice) {
          let balancePriceStr = String(balancePrice)
          if(balancePriceStr.includes(".")){
            data.balancePriceLeft = balancePriceStr.split(".")[0]
            data.balancePriceRight = balancePriceStr.split(".")[1]
          }else{
            data.balancePriceLeft = balancePriceStr
            data.balancePriceRight = "00"
          }
        }else{
          data.balancePriceLeft = "0"
          data.balancePriceRight = "00"
        }

        // 处理还需支付金额
        let price = data.price
        if(price) {
          let priceStr = String(price)
          if(priceStr.includes(".")){
            data.priceLeft = priceStr.split(".")[0]
            data.priceRight = priceStr.split(".")[1]
          }else{
            data.priceLeft = priceStr
            data.priceRight = "00"
          }
        }else {
          data.priceLeft = "0"
          data.priceRight = "00"
        }
        that.setData({
          payInfo: data
        })
        console.info(that.data.payInfo)
        that.dealSurplusOrderTime(that.data.payInfo.createTime, Number(that.data.payInfo.cancelTime))
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        });
      }
    })
  },
  // 处理订单倒计时，接口获取订单有效时间
  dealSurplusOrderTime: function (time, cancelTime) {
    let that = this
    time=new Date(time.replace(/-/g, '/'));//获取传入时间 并将其转化为date型
    let nowTime=new Date();//获取当前时间
    let timeDifference=nowTime.getTime()-time.getTime();//时间差的毫秒数
    if(timeDifference> cancelTime * 1000){
      that.setData({
        surplusMsg: '订单已经超时',
        orderStatus: false
      })
    }else{
      timeDifference = 30  * 60 * 1000 - timeDifference
      let leave1=timeDifference%(24*3600*1000); //计算天数后剩余的毫秒数
      let leave2=leave1%(3600*1000); //计算小时数后剩余的毫秒数
      let minutes=Math.floor(leave2/(60*1000));//计算相差分钟数
      let leave3=leave2%(60*1000); //计算分钟数后剩余的毫秒数
      let seconds=Math.round(leave3/1000); //计算相差秒数
      that.setData({
        surplusMinutes: minutes,
        surplusSeconds: seconds
      })
      let timer = setInterval(function () {
        seconds--
        if (seconds <= 0) {
          if(minutes > 0) {
            minutes --
            seconds = 59
          }else{
            that.setData({
              surplusMsg: '订单已经超时',
              orderStatus: false
            })
            clearInterval(timer)
          }
          return
        }
        that.setData({
          surplusMinutes: minutes,
          surplusSeconds: seconds
        })
      }, 1000)
    }
  },
  toPayCard: function (payPassword) {
    let that = this
    // 遍历获取  cardIds
    let cardIds = []
    that.data.payInfo.myCards.forEach(item=> {
      if (item.cardChoiceFlag) {
        cardIds.push(item.id)
      }
    })
    const params = {}
    params.payType = 3
    params.orderId = that.data.orderId
    params.peopleId = that.data.peopleId
    params.cardIds = cardIds
    params.payPassword = payPassword
    HttpClient.Method.post(OrderUrl.GoPayUrl, params , function (res) {
     if(res.data.flag){
          // 如果成功 并且 剩余支付金额 大于0  调用微信支付
           if(!res.data.data.flag){
             let data = res.data.data
             that.callWxPay(data)
           }else {
             wx.showToast({
               title: '支付成功',
               icon: 'none',
               duration: 1000
             });
             setTimeout(function () {
               let redirectUrl = '/pages/paySuccess/paySuccess?payAmount='+that.data.payInfo.realPrice
               if(that.data.payInfo.orderType==0){
                redirectUrl = '/pages/cardVoucherConverSuccess/cardVoucherConverSuccess?payAmount='+that.data.payInfo.realPrice+'&ordersn='+that.data.payInfo.ordersn+'&createTime='+that.data.payInfo.createTime
               }
               wx.redirectTo({
                 url: redirectUrl
               })
             }, 1000)
           }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        });
      }
    })
  },
  toPayWx: function () {
    let that = this
    // robber TODO
    // if(!that.data.orderStatus){
    //   wx.showToast({
    //     title: '订单已超时',
    //     icon: 'none'
    //   });
    //   return false
    // }
    const params = {}
    params.payType = 2
    params.orderId = that.data.orderId
    params.peopleId = that.data.peopleId
    HttpClient.Method.post(OrderUrl.GoPayUrl, params , function (res) {
      if(res.data.flag){
        let data = res.data.data
        that.callWxPay(data)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        wx.request({
          url: PayFaildOrderUrl,
          data: {
            orderId: that.data.orderId,
            peopleId: that.data.peopleId
          },
          method: 'GET',
          success: function (res) {
            
          },
          fail: function (res) {},
          complete: function (res) {},
        })
      }
    })
  },
  /**
   * 调用微信支付
   */
  callWxPay: function (weChatInfo) {
    let that = this
    wx.requestPayment({
      timeStamp: weChatInfo.timeStamp,
      nonceStr: weChatInfo.nonceStr,
      package: weChatInfo.package1,
      signType: weChatInfo.signType,
      paySign: weChatInfo.paySign,
      //用户放弃支付，只给提示
      fail: function (err) {
        console.log(err);
        let _msg = err.message
        if (_msg == undefined) {
          _msg = "支付失败!"
        }
        wx.showToast({
          title: _msg,
          icon: 'none'
        })
        wx.request({
          url: PayFaildOrderUrl,
          data: {
            orderId: weChatInfo.orderId,
            peopleId: that.data.peopleId
          },
          method: 'GET',
          success: function (res) {
            wx.redirectTo({
              url: '../orderList/orderList?tab=1',
            })
          },
          fail: function (res) {},
          complete: function (res) {},
        })
      },
      //支付成功
      success: function (res) {
        //售卡，直接跳转卡界面
        setTimeout(function () {
          // TODO 跳转至订单列表
          wx.redirectTo({
            url: '/pages/paySuccess/paySuccess?payAmount='+that.data.payInfo.price
          })
        }, 200)
      }
    })
  }
})