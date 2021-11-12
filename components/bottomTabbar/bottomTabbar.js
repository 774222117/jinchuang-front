// component/bottomTabbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentIdx: {
      type: Number,
      value: 0,
      observer: function (t) {
        if (t) {
          let tabbar = this.data.tabbar;
          for (let i in tabbar.list) {
            tabbar.list[i].selected = false;
            (i == t) && (tabbar.list[i].selected = true);
          }
          this.setData({ tabbar })
        }
      }
    },
    cartNum: {
      type: Number,
      value: 0
    },
    tabbarRefresh: {
      type: Boolean,
      value: false,
      observer: function (t) {
        if (t) this.getTabbar();
      }
    }
  },

  attached() {
    let model = wx.getSystemInfoSync().model;
    let isIpx = model.indexOf("iPhone X") > -1 || model.indexOf("unknown<iPhone") > -1 || model.indexOf("iPhone Max") > -1 || model.indexOf("iPhone 11") > -1|| model.indexOf("iPhone 12") > -1;
    isIpx && this.setData({ isIpx: true });    
    isIpx && this.setData({ isIpx: true });    
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIpx: false,
    tabbar: {
      "backgroundColor": "#fff",
      "color":"#898989",
      "selectedColor": "#F37920",
      "list": [
        {
          "pagePath": "/pages/shopIndex/shopIndex",
          "text": "全球汇",
          "iconPath": "/image/tabBar/indexOff.png",
          "selectedIconPath": "/image/tabBar/indexOn.png",
          "selected": true
        },
        {
          "pagePath": "/pages/shopCategory/shopCategory",
          "text": "分类",
          "iconPath": "/image/tabBar/categoryOff.png",
          "selectedIconPath": "/image/tabBar/categoryOn.png",
          "selected": false
        },
        {
          "pagePath": "/pages/shoppingCar/shoppingCar",
          "text": "购物车",
          "iconPath": "/image/tabBar/carOff.png",
          "selectedIconPath": "/image/tabBar/carOn.png",
          "selected": false
        },
        {
          "pagePath": "/pages/myIndex/myIndex",
          "text": "我的",
          "iconPath": "/image/tabBar/userOff.png",
          "selectedIconPath": "/image/tabBar/userOn.png",
          "selected": false
        }
      ]
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goWeapp: function (e) {
      // 跳转小程序
      let url = e.currentTarget.dataset.url
      if (url.indexOf('pages/groupbuy/groupbuy') != -1||url.indexOf('pages/shopCategory/shopCategory') != -1||url.indexOf('pages/shopIndex/shopIndex') != -1) {
        // wx.navigateTo({ url })
        wx.redirectTo({ url })
      } else{
       wx.switchTab({ url })
      }
    }
  }
})
