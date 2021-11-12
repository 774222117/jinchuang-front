const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const Message = require('../../utils/util.js').Message;
const IndexUrl = require('../../utils/config.js').HttpConfig.IndexUrl;
const PageGo = require('../../utils/util.js').PageGo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alphabetArr:["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    scrollTopId:'',
    cities:[],
    hots:[],
    allCity:[], //用于搜索城市
    searchResult:[],
    seachBg:false,
    searchPanel:false,
    inputValue:'',
    histories:[]//历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      histories:PageGo.getSearchCache_chooseCity(),
      navH: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      navHeight: app.globalData.navHeight
    })
    this.loadHotAndAllCity()
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
  chooseCity:function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//上一个页面
    if(!prevPage) return
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      currentCity: e.currentTarget.dataset.name
    })
    PageGo.cacheSearch_chooseCity(e.currentTarget.dataset.name);
    wx.navigateBack({
      delta: 1,
    })
  },
  clickLetter:function(e){
    console.log(e.target.letter)
    this.setData({
      scrollTopId:e.currentTarget.dataset.letter
    })
  },

  loadHotAndAllCity:function(){
    let that = this
    Message.Loading.loadingDefault();
    HttpClient.Method.get(IndexUrl.FindCity, {}, function (res) {
      Message.Loading.close()
      if (res.data) {
        let allcity = []
        res.data.cities.forEach(function(item){
          item.data.forEach(function(e){
            allcity.push(e)
          })
        })
        that.setData({
          cities:res.data.cities,
          hots:res.data.hots,
          allCity:allcity
        })
      } else {
        Message.Alert.alertError(res.data.message)
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
  onSearch: function (e) {
    let searchValue = e.detail.value
    let result = []
    if(searchValue.trim().length == 0) {
      this.setData({
        searchPanel:false
      })
      return
    }

    searchValue = searchValue.trim()
    this.data.allCity.forEach(function(item){
      if(item.name.indexOf(searchValue) >= 0){
        result.push(item)
      }
    })
    this.setData({
      searchPanel:true,
      searchResult:result
    })
  },
  onFocus:function(){
    this.setData({
      seachBg:true
    })
  },
  onBlur:function(){
    
  },
  onSearchCancel:function(){
    this.setData({
      inputValue:'',
      searchPanel:false,
      seachBg:false
    })
  },
  onTouchBgLayer:function(){
    this.setData({
      seachBg:false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})