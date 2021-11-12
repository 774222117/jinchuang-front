// pages/categoryShop/categoryShop.js
const app = getApp()
const GetCategoryShopUrl = require('../../utils/config.js').HttpConfig.GetCategoryShopUrl;
const PageGo = require('../../utils/util.js').PageGo;
const HttpClient = require('../../utils/util.js').HttpClient;
let cartUtil = require('../../utils/cart')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    itemList: [],
    topNum: 0,
    scrollHeight: 0,
    curIndex: 0,
    lastActive: "",
    isIpx: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.isIphoneX()
    //获取屏幕高度
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollHeight: res.windowHeight - 48
        })
      }
    });
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
    cartUtil.refreshCartNum();
    var that = this
    //获取所有分类数据
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    HttpClient.Method.get(GetCategoryShopUrl.getList, {}, function (res) {
      if (res.data.flag) {
        wx.hideLoading();
        if (app.globalData.categoryId) {
          var categoryId = app.globalData.categoryId
          res.data.data.forEach((item, index) => {
            if (categoryId == item.id) {
              that.setData({
                curIndex: index
              })
              console.log('index')
              console.log(index)
            }
          })
        }
        that.setData({
          listData: res.data.data,
          itemList: res.data.data[that.data.curIndex],
        })
        app.globalData.categoryId = undefined
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });
      }
    })
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



  //自定义函数
  /**
   * 点击左侧导航栏
   */
  tap: function (e) {
    var that = this
    // 获取item项的id，和数组的下标值
    let index = parseInt(e.currentTarget.dataset.index);
    // 把点击到的某一项，设为当前index
    this.setData({
      curIndex: index,
      itemList: that.data.listData[index],
      topNum: 0
    })
  },
  /**
   * 跳转搜索页
   * 
   */
  gotoSearch: function () {
    PageGo.jump('/pages/search/search', {
      title: '',
      self: 0
    })
  },
  /**
   * 跳转到产品列表
   */
  getDetails(e) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    PageGo.jump('/pages/categoryGoods/categoryGoods', {
      id,
      title
    })
  },
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
})