// pages/applyAfterOrder/applyAfterOrder.js
const app = getApp()
//查询订单Url
const searchOrderInfoUrl = require('../../utils/config.js').HttpConfig.OrderUrl.searchOrderInfoUrl
//提交售后订单
const submitAfterOrderUrl = require('../../utils/config.js').HttpConfig.OrderUrl.submitAfterOrderUrl
//上传图片
const uploadImageUrl = require('../../utils/config.js').HttpConfig.OrderUrl.uploadImageUrl
//退货原因
const FindRefundReasonUrl = require('../../utils/config.js').HttpConfig.OrderUrl.findRefundReasonUrl;
Page({
  // 打开弹窗
  showModal(e) {
    const index = e.currentTarget.dataset.bottom
    this.setData({
      modalName: e.currentTarget.dataset.target,
      bottomIndex: index
    })

  },
  // 隐藏弹窗
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 选择出问题的商品
  questionClick(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({
      questionIndex: index,
      resonId: this.data.resonList[index].id
    })
    this.hideModal()
  },
  // 选择已收货和未收货
  receClick(e) {
    this.setData({
      isShow: e.currentTarget.dataset.flag == 0 ? true : false,
      orderStatus: e.currentTarget.dataset.flag == 0 ? 0 : 1
    })
    this.hideModal()
  },
  /**
   * 页面的初始数据
   */
  data: {
    questionIndex: 0, //记录选择退款原因
    bottomIndex: 0, //记录打开的弹窗
    isShow: true,

    orderId: 0,
    goodsItems: [], //退款商品列表
    peopleId: 0,
    applyType: '', //退款类型
    chooseGoodsList: [], //选择的退款商品的id和数量的集合
    orderInfo: '', //订单信息
    totalPrice: 0, //退款总金额
    orderStatus: null, //货物状态
    resonList: [], //退款原因列表
    resonId: null, //退款原因id
    describe: '', //描述
    questionPicList: [], //凭证
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      peopleId: app.globalData.userInfo.id,
      orderId: options.orderId,
      applyType: options.applyType,
      chooseGoodsList: JSON.parse(options.goods)
    })
    this.searchOrderInfo()
    this.findRefundReason()

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

  /**
   * 查询订单
   */
  searchOrderInfo: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    wx.request({
      url: searchOrderInfoUrl,
      data: {
        peopleId: this.data.peopleId,
        orderId: this.data.orderId
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
      success: function (res) {
        wx.hideLoading()
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '查询订单出错！',
            icon: 'none'
          });
          return
        }

        /**
         * 循环商品
         */
        var goodsItems = [] //退款商品列表
        var totalPrice = 0 //退款总金额
        res.data.data.goodsItems.forEach((item) => {
          that.data.chooseGoodsList.forEach((it) => {
            if (item.id === it.id) {
              item.quantity = it.total
              totalPrice += item.quantity * item.price
              goodsItems.push(item)
            }
          })
        });
        that.setData({
          orderInfo: res.data.data,
          totalPrice: totalPrice,
          goodsItems: goodsItems
        })
      }
    })
  },
  /**
   * 退款原因列表
   */
  findRefundReason: function () {
    let that = this
    wx.request({
      url: FindRefundReasonUrl,
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      },
      success: function (res) {
        if (!res.data.flag) {
          wx.showToast({
            title: res.data.message || '获取退货原因出错！',
            icon: 'none'
          });
          return
        }
        let resons = res.data.data
        that.setData({
          resonList: resons
        })
      }
    })
  },
  /**
   * 获取输入的描述
   */
  getValue: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  /**
   * 添加图片
   */
  uploadPhoto() {
    if (this.data.questionPicList.length > 5) {
      return
    }
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempFilePath = tempFilePaths[0]
        that.uploads(tempFilePath)
      }
    })
  },
  // 上传图片
  uploads(files) {
    let that = this
    let path = 'applyAfterOrder'
    wx.showLoading({
      icon: "loading",
      title: "正在上传",
      mask: true

    })

    wx.uploadFile({
      url: uploadImageUrl,
      filePath: files,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'path': path
      },
      success: function (res) {
        //上传成功返回数据
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        if (res.data == '404') {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        let image = res.data
        that.data.questionPicList.push(JSON.parse(image))
        that.setData({
          questionPicList: that.data.questionPicList
        })
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideLoading(); //隐藏
      }
    })
  },
  /**
   * 提交
   */
  submit() {
    let that = this
    if (this.data.orderStatus == null) {
      wx.showToast({
        title: '请选择货物状态！',
        icon: 'none'
      })
    } else if (this.data.resonId == null) {
      wx.showToast({
        title: '请选择退款原因！',
        icon: 'none'
      })
    } else if (this.data.describe.length == 0) {
      wx.showToast({
        title: '请补充描述！',
        icon: 'none'
      })
    } else if (this.data.questionPicList.length == 0) {
      wx.showToast({
        title: '请上传凭证！',
        icon: 'none'
      })
    } else {

      wx.showModal({
        content: '确认提交？',
        success(res) {
          if (res.confirm) {
            if (that.data.isSubmit) return
            that.setData({
              isSubmit: true
            })
            let orderInfo = that.createOrderInfo();
            if (orderInfo == null) {
              that.setData({
                isSubmit: false
              })
              return
            }
            wx.showLoading({
              title: '提交中...',
              mask: true
            })
            wx.request({
              url: submitAfterOrderUrl,
              method: 'post',
              data: orderInfo,
              fail: function (err) {
                wx.hideLoading()
                wx.showToast({
                  title: '售后订单提交出错，网络异常！',
                  icon: 'none'
                });
                that.setData({
                  isSubmit: false
                })
              },
              success: function (res) {
                wx.hideLoading()
                that.setData({
                  isSubmit: false
                })
                if (!res.data.flag) {
                  wx.showToast({
                    title: res.data.message || '售后订单异常！',
                    icon: 'none'
                  });
                  return
                }
                wx.showModal({
                  title: '提示',
                  content: '售后订单已提交，售后工作人员稍后与您联系！',
                  showCancel: false,
                  success: function () {
                    //跳转到订单页
                    wx.navigateBack({
                      delta: 2
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  },
  /**
   * 生成退款订单
   */
  createOrderInfo() {
    let questionPic = ''
    for (let i = 0; i < this.data.questionPicList.length; i++) {
      if (questionPic != '') questionPic += ','
      questionPic += this.data.questionPicList[i]
    }
    let orderInfo = {
      outerOrderId: this.data.orderId,
      outerOrdersn: this.data.orderInfo.ordersn,
      peopleId: this.data.orderInfo.peopleId,
      applyType: this.data.applyType,
      applyReason: this.data.resonList[this.data.questionIndex].reason,
      questionDescription: this.data.describe,
      questionPic: questionPic,
      moneyReturned: this.data.totalPrice.toFixed(2)
    }
    let afterSaleGoodsList = []
    this.data.goodsItems.forEach((item) => {
      if (item.quantity > 0) {
        let afterSaleGoods = {}
        afterSaleGoods.id = item.id
        afterSaleGoods.goodsId = item.goodsId
        afterSaleGoods.title = item.title
        afterSaleGoods.goodssn = item.goodssn
        afterSaleGoods.productsn = item.productsn
        afterSaleGoods.quantity = item.quantity
        afterSaleGoods.executePrice = item.executePrice
        afterSaleGoods.price = item.price
        afterSaleGoods.totalRefund = item.totalRefund
        afterSaleGoodsList.push(afterSaleGoods)
      }
    })
    orderInfo.orderAfterSaleGoodsList = afterSaleGoodsList
    return orderInfo
  },
  /**
   * 删除照片
   */
  deleteImg(e) {
    var list = this.data.questionPicList
    list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      questionPicList: list
    })
  }
})