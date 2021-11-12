// pages/feedback/feedback.js
const app = getApp()

//上传图片
const uploadImageUrl = require('../../utils/config.js').HttpConfig.OrderUrl.uploadImageUrl
//提交反馈
const submitFeedBackUrl = require('../../utils/config.js').HttpConfig.feedbackUrl.submitFeedBackUrl


Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    phone: '',
    questionPicList: [],
    peopleId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) return
    this.setData({
      peopleId: app.globalData.userInfo.id
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
   * 获取输入的值
   */
  getValue(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  /**
   * 添加图片
   */
  uploadPhoto() {
    if (this.data.questionPicList.length > 0) {
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
    let path = 'feedback'
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
    if (!this.data.content) {
      wx.showToast({
        title: '请输入问题和建议！',
        icon: 'none'
      })
    } else {
      var data = {
        description: this.data.content, // 意见内容
        adviceImg: this.data.questionPicList.length > 0 ? this.data.questionPicList[0] : '', //意见图片
        phone: this.data.phone, //联系方式
        peopleId: this.data.peopleId,
      }
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      wx.request({
        url: submitFeedBackUrl,
        method: 'get',
        data: data,
        fail: function (err) {
          wx.hideLoading()
          wx.showToast({
            title: '网络异常，稍后再试！',
            icon: 'none'
          });
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.flag) {
            wx.showModal({
              title: '提示',
              content: '感谢您的宝贵意见',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
          }

        }
      })
    }
  }
})