// pages/mine/mine.js
var base64 = require("../images/base64");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    name: '',
    studentID: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的发布'
    })
    this.setData({
      userInfo: getApp().globalData.userInfo,
      name: wx.getStorageSync('name'),
      studentID: wx.getStorageSync('studentID'),

      icon: base64.icon20,
      slideButtons: [{
        text: '普通',
        src: '/pages/images/icon_love.svg', // icon的路径
      },{
        text: '普通',
        extClass: 'test',
        src: '/pages/images/icon_star.svg', // icon的路径
      },{
        type: 'warn',
        text: '警示',
        extClass: 'test',
        src: '/pages/images/icon_del.svg', // icon的路径
      }],
    })
  },
  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
    
    var that = this
    wx.request({
      url: getApp().globalData.serverURL + 'objects/' + e.detail.data,
      method: 'DELETE',
      success (res) {
        console.log(res)
        that.onShow()
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
    
    /*向服务器请求数据*/
    var that = this
    
    /*获取失物招领列表*/
    wx.request({
      url: getApp().globalData.serverURL + 'objects/find_owner/?publisher=' + this.data.studentID,
      method: 'GET',
      success(res) {
        console.log(res.data);

        /*设置左划按键返回的数据*/
        let items = res.data;
        for (let item of items) {
          item.slideButtons = [{
            type: 'warn',
            text: '删除',
            extClass: 'test',
            src: '/pages/images/icon_del.svg', // icon的路径
            data: 'find_owner/' + item.id
          }];
        }

        that.setData({
          find_owner_list: items.reverse()
        })
      }
    })

    /*获取寻物启事列表*/
    wx.request({
      url: getApp().globalData.serverURL + 'objects/find_object/?publisher=' + this.data.studentID,
      method: 'GET',
      success(res) {
        console.log(res.data);

        /*设置左划按键返回的数据*/
        let items = res.data;
        for (let item of items) {
          item.slideButtons = [{
            type: 'warn',
            text: '删除',
            extClass: 'test',
            src: '/pages/images/icon_del.svg', // icon的路径
            data: 'find_object/' + item.id
          }];
        }

        that.setData({
          find_object_list: items.reverse()
        })
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

  }
})