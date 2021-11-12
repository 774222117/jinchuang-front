/**
 * 项目配置
 */
//正式服
// const host = "https://jinchuang.wyouquan.cn";
//测试服
const host = "https://jinchuang.sgsugou.com";
// const host = "http://localhost:8080";
// const host = "http://localhost:9090";
//admin
// const host = "https://jinchuang-admin.wyouquan.cn"

var oss = "https://jinchuang-source.wyouquan.cn"

const HttpConfig = {
  oss,
  imgUrl: `${oss}/img-coupon/`,
  IndexUrl: {
    InfoUrl: `${host}/app/index/findIndexData`, //首页模块数据
    FindMoreUrl: `${host}/app/index/findMoreData`, //首页更多超值精选商品
    EnterpriseRechargeUrl: `${host}/app/people/enterprise/recharge`, //用户发券/余额
    ModuleCategoryData: `${host}/app/homeModule/getHomeModuleData`, //首页底部分类标题
    ModuleDetailData: `${host}/app/homeModule/getHomeModuleDetail`, //首页底部商品信息
    FindCity: `${host}/app/city/findData`, //获取带选择城市列表
  },
  CategoryUrl: {
    ListUrl: `${host}/app/goods/activity/categories`, //商品详情页
  },
  GoodsUrl: {
    InfoUrl: `${host}/app/goods/getOne`, //商品详情页
    ListUrl: `${host}/app/goods/findData`, //分类列表
  },
  OrderUrl: {
    MyOrderCouponsUrl: `${host}/app/mycoupon/getMyShopCoupons`, //订单可用优惠券
    //SubmitShopOrderUrl : `${host}/app/order/submitShopOrder`,//订单可用优惠券
    SubmitShopOrderUrl: `${host}/app/order/v2/submit`, //新版订单支付
    //订单支付失败
    PayFaildOrderUrl: `${host}/app/order/v2/pay/fail`,
    //重新支付
    PayOrderUrl: `${host}/app/order/payOrder`,
    //售后订单列表
    findAfterSaleListUrl: `${host}/app/order/findAfterSaleList`,
    //售后订单详情
    getPeopleOrderAfterSaleUrl: `${host}/app/order/getPeopleOrderAfterSale`,
    //根据订单号查询订单
    searchOrderInfoUrl: `${host}/app/order/searchOrderById`,
    //提交售后
    submitAfterOrderUrl: `${host}/app/order/v2/submitAfterOrder`,
    //上传图片
    uploadImageUrl: `${host}/app/image/upload`,
    //退款原因
    findRefundReasonUrl: `${host}/app/order/findRefundReason`,
    //查询订单列表
    PeopleOrderInfoUrl: `${host}/app/order/getPeopleOrderInfo`,
    //申请退款，取消订单
    ApplyRefundUrl: `${host}/app/order/v2/applyRefund`,
    //订单详情页，重新支付订单
    AgainPayOrderUrl: `${host}/app/order/againPayOrder`,
    //校验支付密码
    CheckSecretUrl: `${host}/app/people/check/secret`,
    //订单支付
    GoPayUrl: `${host}/app/order/v2/go/pay`,
    //订单支付信息
    PayInfoUrl: `${host}/app/order/v2/pay/info`,
    //取消订单
    OrderCancelUrl: `${host}/app/order/v2/cancel`,
    //确认收货
    finishOrderUrl: `${host}/app/order/v2/finish`,
    //根据订单号、商品查询订单
    searchOrderGoodsByIdUrl: `${host}/app/order/searchOrderGoodsByOrderGoodsId`,
    //提交退回信息
    submitRejectInfo: `${host}/app/order/submitRejectInfo`,
    //取消售后
    AfterOrderCancelUrl: `${host}/app/order/v2/cancelAfterOrder`,
  },
  RegisterUrl: {
    VailCardInfo: `${host}/app/cardProDetail/vailCardInfo`, //校验卡号卡密
    VailQRCode: `${host}/app/cardProDetail/vailQRCode`, //校验二维码
    SendCodeForRegister: `${host}/app/people/sendCodeForRegister`, //发送注册验证码
    VailCodeForRegister: `${host}/app/people/vailCodeForRegister`, //校验注册验证码
    RegisterAndBind: `${host}/app/people/registerAndBind`, //校验注册验证码
  },
  BindingCardUrl: {
    bindByCardNumber: `${host}/app/card/bindByCardNumber`, //绑定卡号
    bindCardInfo: `${host}/app/card/bindCardInfo`, //绑定储值卡
    bindQRCode: `${host}/app/card/bindQRCode`, //绑定提货券
    setSecret: `${host}/app/people/setSecret`, //设置密码
  },
  LoginUrl: {
    sendCodeForLoginAndRegister: `${host}/app/people/sendCodeForLoginAndRegister`, //发送登录验证码
    PhoneLogin: `${host}/app/people/phoneLoginIn`, //登录
    GetWechatSessionKey: `${host}/app/people/getWechatSessionKey`, //获取手机号码
    WechatLogin: `${host}/app/people/wechatLogin`, //获取手机号码
    InfoUrl: `${host}/app/people/loginIn`, //登录
  },
  SendCodeUrl: {
    InfoUrl: `${host}/app/people/sendCode`, //获取验证码
    ModifyPsUrl: `${host}/app/people/modify/sendCode`,
    CheckCodeUrl: `${host}/app/people/check/code`
  },
  GetPhoneUrl: {
    InfoUrl: `${host}/app/people/getPhoneToWeChat`, //获取手机号
  },
  GetPeopleInfoByIdUrl: {
    InfoUrl: `${host}/app/people/getOne`, //获取用户信息
  },
  GetExpressInfoUrl: {
    InfoUrl: `${host}/app/order/getOrderExpressInfo`, //获取物流详情
    LastExpressInfoUrl: `${host}/app/order/getLastOrderExpressInfo`
  },
  MyCenter: {
    InfoUrl: `${host}/app/people/getOne`, //我的信息余额 我的订单
    CountUrl: `${host}/app/center/count`, //订单优惠券数量/订单数量
    OrderUrl: `${host}/app/people/order`, //我的全部订单列表
    CouponUrl: `${host}/app/people/coupon`, //我的优惠券列表
    MerchantCardInfo: `${host}/app/merchant/card/card/findData`
  },
  GetCouponListUrl: {
    UnusedCouponUrl: `${host}/app/mycoupon/getMyunUsedCouponList`, //获取待使用券
    InvalidCouponUrl: `${host}/app/mycoupon/getMyInvalidCouponList`, //获取已过期券
    UsedCouponUrl: `${host}/app/mycoupon/getMyUsedCouponList`, //获取已使用券
    GetCouponCountsUrl: `${host}/app/mycoupon/getCouponCountsList`, //获取优惠券数量
    SubmitExchangeCodeUrl: `${host}/app/mycoupon/submitExchangeCode`, //提交兑换码
  },
  PromotionUrl: {
    InfoUrl: `${host}/app/sales/activity/findData`, //获取促销活动信息
  },
  GetCategoryShopUrl: {
    getList: `${host}/app/category/findData`, //获取全部分类
  },
  PeopleInfoUrl: {
    peopleHadPswUrl: `${host}/app/people/check/peopleHadPsw` //校验用户是否设置过密码
  },
  SetSecretUrl: {
    NewPassWordUrl: `${host}/app/people/modify/secret`,
    RetrievePwdUrl: `${host}/app/people/retrievePwd`, //找回密码
    EditPwdUrl: `${host}/app/people/edit/secret` //修改密码
  },
  MerchantCardUrl: {
    InfoUrl: `${host}/app/merchant/card/findData`, //获取大牌卡券列表
    DetailUrl: `${host}/app/merchant/card/getOne`, //获取卡券详情,
    SubmitCardBuyUrl: `${host}/app/order/v2/card/submit`, //提交兑换卡
    MineUrl: `${host}/app/merchant/card/mine`, //我的卡券列表
  },
  peopleInfoUrl: {
    getPeopleInfoUrl: `${host}/app/people/getOne`, //获取账号个人信息
    modifyPeopleInfoUrl: `${host}/app/people/modifyPeopleInfo`,
    editPeopleSexUrl: `${host}/app/people/updateGender`, //修改性别
    updateBirthdayUrl: `${host}/app/people/updateBirthday`, //设置生日
  },
  SecondBannerUrl: {
    InfoUrl: `${host}/app/secondBanner/findAllForIndex`, //获取二级页信息
    getgetSecondModuleGoodsListUrl: `${host}/app/secondBanner/getSecondModuleGoodsList`, //获取楼层下商品信息
  },
  BrandGoodsUrl: {
    GetOne: `${host}/app/brand/getOne`, //详情
    FindData: `${host}/app/brand/findData`, //商品列表
  },
  feedbackUrl: {
    submitFeedBackUrl: `${host}/app/feedBack/submitFeedBack`, //提交反馈
  },
  NewsUrl: {
    GetListUrl: `${host}/pc/columnInfo/getList` //获取资讯列表
  },
  CardUrl: {
    MineUrl: `${host}/app/card/mine`, //我的卡列表
  },
  myCardVoucherUse: {
    getDataUrl: `${host}/app/merchant/card/verify`, //获取付款码信息
  }
}

/**
 * 缓存key
 */
const CacheKey = {
  userInfo: 'userInfo'
}
module.exports = {
  HttpConfig,
  CacheKey
}
