const app = getApp()
const HttpClient = require('../../utils/util.js').HttpClient;
const Message = require('../../utils/util.js').Message;
const modifyPeopleInfoUrl = require('../../utils/config.js').HttpConfig.peopleInfoUrl.modifyPeopleInfoUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    peopleId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = app.globalData.userInfo;
    if(userInfo){
      this.setData({
        peopleId : userInfo.id
      })
    }
    
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
   * 
   * 获取输入的用户名
   */
  getValue: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  /**
   * 保存修改
   */
  submit() {
    let that = this
    if(this.includeSpecialCharacters(that.data.userName)){
      wx.showToast({
        title: "包含特殊字符",
        icon: 'error'
      });
      return
    }
    Message.Loading.loadingDefault()
    HttpClient.Method.get(modifyPeopleInfoUrl, {peopleID:that.data.peopleId,nickName:that.data.userName}, function (res) {
      Message.Loading.close()
      if (res.data) {
        wx.showToast({
          title: res.data.message || '修改成功',
          icon: 'success'
        });
      } else {
        Message.Alert.alertError(res.data.message)
      }
    })
  },
  includeSpecialCharacters:function(chars){
    var regu =  /^[0-9a-zA-Z\u4e00-\u9fa5]+$/
    var re = new RegExp(regu)
    //console.log(re.test(chars))
    if(re.test(chars)){
      return false
    }
    else{
      return true
    }
  }
})