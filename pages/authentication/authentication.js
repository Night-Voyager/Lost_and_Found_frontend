// pages/authentication/authentication.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toptipType: 'error', //提示类型，可以为info、error、success，表示三种提示颜色
    toptipMessage: '',

    isDataBack: false,
    isLoggedIn: false,
    loginNotSuccess: false,
    openid: ''
  },

  /* “确定”按钮被点击 */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    var formData = e.detail.value; //提取表单数据
    var that = this;

    wx.request({
      url: getApp().globalData.serverURL + 'users/register/',
      data: {
        name: formData.name,
        studentID: formData.studentID,
        openid: this.data.openid
      },
      method: 'POST',
      success(res) {
        console.log(res.statusCode)
        if (res.statusCode!=201) {
          that.setData({
            toptipMessage: '姓名或学号有误'
          })
        }
        else {
          console.log('注册成功')
          wx.setStorage({
            data: res.data.name,
            key: 'name',
          })
          wx.setStorage({
            data: res.data.studentID,
            key: 'studentID',
          })
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          wx.request({
            url: getApp().globalData.serverURL + 'users/login/',
            method: 'POST',
            data: {
              code: res.code
            },
            success(res) {
              wx.hideLoading()
              if (res.data.message == 'success')
              {
                wx.setStorage({
                  data: res.data.name,
                  key: 'name',
                })
                wx.setStorage({
                  data: res.data.studentID,
                  key: 'studentID',
                })
                wx.switchTab({
                  url: '/pages/index/index'
                })
                that.setData({isLoggedIn: true})
              }
              else
              {
                console.log('登录失败，用户未注册' + res.errMsg)
                that.setData({ isDataBack: true, openid: res.data.openid })
              }
            },
            fail(res) {
              wx.hideLoading()
              console.log('登录失败，小程序网络请求函数调用失败' + res.errMsg)
              that.setData({loginNotSuccess: true})
            }
          })
        } else {
          wx.hideLoading()
          console.log('登录失败，未收到服务器数据' + res.errMsg)
          that.setData({ loginNotSuccess: true })
        }
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

  }
})