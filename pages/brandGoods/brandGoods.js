// pages/brandGoods/brandGoods.js
const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const BrandGoodsUrl = require('../../utils/config.js').HttpConfig.BrandGoodsUrl;
const Message = require('../../utils/util.js').Message;
const PageGo = require('../../utils/util.js').PageGo;
//html解析模块
let htmlParse = require('../../components/wxParse/wxParse.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    chooseIndex: 0, //选中的navbar索引
    filterIndex: 0, //选中的过滤条件索引
    brandGoodsDetail: {},
    brandGoodsList: [],
    id: '',
    current: 1, //当前页
    limit: 6, //1页数据量
    hasData: true,
    sort: 'asc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.iniData()
    this.queryList()
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
    this.queryList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 自定义方法
  /**
   * 切换顶部navbar
   */
  changeNav(e) {
    this.setData({
      chooseIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 切换过滤条件
   */
  changeFilter(e) {
    let that = this
    let filterIndex = e.currentTarget.dataset.index
    that.setData({
      filterIndex: filterIndex,
      brandGoodsList: [], // 清空页面
      current: 1,
      hasData: true
    })
    if (filterIndex === 1) {
      that.setData({
        sort: "desc"
      })
    } else if (filterIndex === 0) {
      that.setData({
        sort: "asc"
      })
    }
    that.queryList()
  },
  iniData() {
    let that = this
    const params = {}
    params.id = that.data.id
    HttpClient.Method.get(BrandGoodsUrl.GetOne, params, function (res) {
      if (res.data.flag) {
        that.setData({
          brandGoodsDetail: res.data.data
        })
        if (that.data.brandGoodsDetail && that.data.brandGoodsDetail.content) {
          let content = that.data.brandGoodsDetail.content.replaceAll("\\", "").replaceAll("\"/", "\"")
          htmlParse.wxParse('commodityDetails', 'html', content, that, 5);
        }
        console.info('detail')
        console.info(that.data.brandGoodsDetail)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        });
      }
    })
  },
  queryList: function () {
    let that = this
    if (!that.data.hasData) {
      wx.showToast({
        title: "没有更多数据了",
        icon: 'none',
        duration: 2000
      });
      return false
    }
    let brandGoodsList = this.data.brandGoodsList
    const params = {}
    params.id = that.data.id
    params.limit = that.data.limit
    params.current = that.data.current
    params.sort = that.data.sort
    wx.showLoading({
      title: '加载中...',
      mask: true

    })
    HttpClient.Method.get(BrandGoodsUrl.FindData, params, function (res) {
      wx.hideLoading()
      if (res.data.flag) {
        if (res.data.data.rows.length > 0) {
          brandGoodsList = brandGoodsList.concat(res.data.data.rows)
          that.setData({
            brandGoodsList: brandGoodsList
          })
          if (Number(res.data.data.total) > that.data.brandGoodsList.length) {
            that.setData({
              current: that.data.current + 1
            })
          } else {
            that.setData({
              hasData: false
            })
          }
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        });
      }
    })
  },
  /**
   * 商品详情
   */
  gotoDetails(e) {
    var id = e.currentTarget.dataset.goodsinfo.id
    PageGo.jump('/pages/goodsDetail/goodsDetail', {
      id
    })
  },
})