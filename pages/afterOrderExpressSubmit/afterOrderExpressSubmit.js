// pages/afterOrderExpressSubmit/afterOrderExpressSubmit.js
//上传图片
const uploadImageUrl = require('../../utils/config.js').HttpConfig.OrderUrl.uploadImageUrl


const submitRejectInfo = require('../../utils/config.js').HttpConfig.OrderUrl.submitRejectInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:-1,
    textLength: 0,
    logisticsCompany: null,
    description: null,
    logisticsNumber: null,
    questionPicList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id  
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  refundTextInput: function (e) {
    this.setData({
      textLength: e.detail.value.length,
      description: e.detail.value
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
  getValue(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
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
    let path = 'afterOrderExpressSubmit'
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
  submit() {
    let that = this
    if (!this.data.logisticsCompany) {
      wx.showToast({
        title: '请输入物流公司！',
        icon: 'none'
      })
    } else if (!this.data.logisticsNumber) {
      wx.showToast({
        title: '请输入物流单号！',
        icon: 'none'
      })
    } else if (this.data.textLength == 0) {
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
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '提交中...',
              mask: true
            })
            wx.request({
              url: submitRejectInfo,
              method: 'get',
              data: {
                id: that.data.id,
                logisticsCompany: that.data.logisticsCompany,
                logisticsNumber: that.data.logisticsNumber,
                description: that.data.description,
                imgUrl: that.data.questionPicList[0],
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
                    title: res.data.message || '网络异常！',
                    icon: 'none'
                  });
                  return
                }
                wx.showToast({
                  title: '已提交！',
                  icon: 'none'
                })
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        }

      })
    }
  },
  deleteImg() {
    this.setData({
      questionPicList: []
    })
  }
})