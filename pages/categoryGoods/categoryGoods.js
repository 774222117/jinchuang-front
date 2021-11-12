// pages/goodsSearch/goodsSearch.js
const app = getApp()
const PageGo = require('../../utils/util.js').PageGo;
const HttpClient = require('../../utils/util.js').HttpClient;
const GetCategoryShopUrl = require('../../utils/config.js').HttpConfig.GetCategoryShopUrl;
const GoodsUrl = require('../../utils/config.js').HttpConfig.GoodsUrl;
let cartUtil = require('../../utils/cart')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    goodsInfos: [],
    level1: 0,
    level2: 0,
    level3: 0,

    preLevel1: 0,
    preLevel2: 0,
    preLevel3: 0,
    isShow: false,
    categoryId: '',
    current: 1,
    limit: 8,
    scrollHeight: 0,
    total: 0,

    isIpx: false,

    sortType: 0, //选中的排序条件的索引
    sortMode: 'desc',
    marketPriceMin: '', //价格区间最小
    marketPriceMax: '', //价格区间最大
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isIphoneX()
    this.setData({
      categoryId: options.id,
    })
    this.getGoodsByid(options.id, this.data.current, this.data.limit)
    var that = this
    //获取屏幕高度
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollHeight: res.windowHeight - 87
        })
      }
    });
    //获取所有分类数据
    wx.showLoading({
      title: '加载中...',
      mask: true

    })
    HttpClient.Method.get(GetCategoryShopUrl.getList, {}, function (res) {
      wx.hideLoading()
      if (res.data.flag) {
        var list = res.data.data
        new Promise((resolve, reject) => {
          var levelArr = that.recursion(res.data.data, options.id)
          resolve(levelArr)
        }).then(res => {
          that.setData({
            listData: list,
            level1: res[0],
            level2: res[1],
            level3: res[2],

            preLevel1: res[0],
            preLevel2: res[1],
            preLevel3: res[2],
          })

        })
      } else {
        wx.showToast({
          title: '网络异常！',
          icon: 'none'
        });

      }
    })
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

  //自定义函数
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
   * 遍历分类树
   */
  recursion(data, id) {
    var that = this
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].children.length; j++) {
        for (var k = 0; k < data[i].children[j].children.length; k++) {
          if (id == data[i].children[j].children[k].id) {
            return [i, j, k]
          }
        }
      }
    }
  },
  /**
   * 根据类型id获取商品
   */
  getGoodsByid(cateId, current, limit) {
    let categoryId = this.data.categoryId;
    let goodsInfos = this.data.goodsInfos;
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true

    })

    HttpClient.Method.get(GoodsUrl.ListUrl, {
      categoryId: cateId,
      current: current,
      limit: limit,
      // level: 3,
      // self: 0,
      sortType: this.data.sortType,
      sortMode: this.data.sortMode,
      marketPriceMin: this.data.marketPriceMin, //价格区间最小
      marketPriceMax: this.data.marketPriceMax, //价格区间最大
    }, function (res) {
      wx.hideLoading();
      if (res.data.total > 0) {
        if (res.data.rows.length > 0) {
          const firstId = res.data.rows[0].id;
          if (categoryId !== cateId) {
            goodsInfos = res.data.rows;
          } else {
            goodsInfos = goodsInfos.concat(res.data.rows);
          }
          //设置结果 和 当前分类
          that.setData({
            goodsInfos,
            categoryId: cateId,
            total: res.data.total
          });
        } else {
          //分页没有数据显示则展示下个分类
          that.setData({
            // dataHas: false
          });
        }
      }
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
   * 弹出分类框
   */
  showDialog() {
    var that = this
    this.setData({
      isShow: !that.data.isShow,
      level1: that.data.preLevel1,
      level2: that.data.preLevel2,
      level3: that.data.preLevel3,
    })
  },
  /**
   * 选择分类
   */
  clickLevel(e) {
    var that = this
    if (e.currentTarget.dataset.name == "level1") {
      that.setData({
        level2: 0,
        level3: 0
      })
    } else if (e.currentTarget.dataset.name == "level2") {
      that.setData({
        level3: 0
      })
    }
    this.setData({
      [e.currentTarget.dataset.name]: e.currentTarget.dataset.index,
    })
  },
  /**
   * 无效果点击
   */
  nothing() {

  },
  /**
   * 重置
   */
  reset() {
    var that = this
    this.setData({
      level1: 0,
      level2: 0,
      level3: 0,
      marketPriceMin: '', //价格区间最小
      marketPriceMax: '', //价格区间最大
      categoryId: that.data.listData[0].children[0].children[0].id
    })

  },
  /**
   * 确认
   */
  handleSubmit() {
    var that = this
    if (this.data.listData[this.data.level1].children[this.data.level2].children[this.data.level3]) {
      var id = that.data.listData[that.data.level1].children[that.data.level2].children[that.data.level3].id
      var name = that.data.listData[that.data.level1].children[that.data.level2].children[that.data.level3].title
      that.setData({
        current: 1,
        categoryId: id,
        isShow: false,
        goodsInfos: [],
        preLevel1: that.data.level1,
        preLevel2: that.data.level2,
        preLevel3: that.data.level3,
      })
      that.getGoodsByid(id, 1, that.data.limit)
    } else {
      wx.showToast({
        title: '暂无分类，请重新选择',
        icon: 'none'
      })
    }
  },
  /**
   * 下拉至底部时加载新的
   */
  toLower() {
    if (this.data.total == this.data.goodsInfos.length) {
      return
    } else {
      let current = this.data.current;
      this.setData({
        current: current + 1
      });
      this.getGoodsByid(this.data.categoryId, this.data.current, this.data.limit)
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
    let goodsList = cartUtil.modifyGoodsList(this.data.goodsInfos, goods);
    // 在商品详情中重新设置下数据
    this.setData({
      goodsInfos: goodsList,
    })
    cartUtil.refreshCartNum()
  },
  /**
   * 增加购物车
   */
  addcart: function (e) {

    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '../login/login'
      })
      return
    }
    let goods = e.currentTarget.dataset.goodsinfo
    let buyCount = 0
    if (goods.buyCount) {
      buyCount = goods.buyCount
    }
    goods = cartUtil.addShopCart(goods, cartUtil.cartType.OTO)
    let goodsList = cartUtil.modifyGoodsList(this.data.goodsInfos, goods);
    if (goods.buyCount > buyCount) {
      wx.showToast({
        title: '添加购车成功',
        icon: 'none'
      })
      this.setData({
        goodsInfos: goodsList,
      })
      cartUtil.refreshCartNum()
    }
  },
  /**
   * 商品详情
   */
  goGoodsDetail(e) {
    var id = e.currentTarget.dataset.goodsinfo.id
    PageGo.jump('/pages/goodsDetail/goodsDetail', {
      id
    })
  },
  /**
   * 切换排序条件
   */
  changeTab(e) {
    var curIndex = e.currentTarget.dataset.index
    if (curIndex == this.data.sortType) {
      this.setData({
        sortMode: this.data.sortMode == 'desc' ? 'asc' : 'desc'
      })
    } else {
      this.setData({
        sortType: e.currentTarget.dataset.index,
        sortMode: 'desc'
      })
    }
    // 清空数据
    this.setData({
      current: 1,
      goodsInfos: [],
    })
    this.getGoodsByid(this.data.categoryId, this.data.current, this.data.limit)
  },
  /**
   * 获取最低价
   */
  getvalue(e) {
    this.setData({
      marketPriceMin: e.detail.value
    })
  },
  //获取最高价
  getvalue2(e) {
    this.setData({
      marketPriceMax: e.detail.value
    })
  }
})