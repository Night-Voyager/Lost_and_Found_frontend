// pages/newFindObject/newFindObject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toptipType: '', //提示类型，可以为info、error、success，表示三种提示颜色
    toptipMessage: '',

    files: [],

    accounts: ["微信号", "QQ", "手机"],
    accountIndex: 0,

    num: 0,

    name: '',
    studentID: 0
  },

  /*图片上传函数*/
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  /*图片预览函数*/
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  /*联系方式选项控制函数*/
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },

  /*字数统计函数*/
  countNum: function (e) {
    var len = parseInt(e.detail.value.length); // 获取输入框内容的长度

    this.setData({
      num: len
    })
  },

  /* “确定”按钮被点击 */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    var formData = e.detail.value;
    formData['publisher'] = this.data.studentID; // 添加提交者学号
    
    if (this.canSubmit(formData)) {
      /*向服务器发送数据，有图和无图时调用的方法不同*/
      var that = this
      if (this.data.files[0]) {
        wx.uploadFile({
          url: getApp().globalData.serverURL + 'objects/find_object/',
          filePath: this.data.files[0],
          name: 'objectImage',
          formData: formData,
          success(res) {
            console.log(res.statusCode);
            if (res.statusCode==201) {
              that.setData({
                toptipType: 'success',
                toptipMessage: '提交成功'
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/findObject/findObject'
                })
              }, 2500)
            }
            else if (res.statusCode==451) {
              that.setData({
                toptipType: 'error',
                toptipMessage: '检测到敏感信息'
              })
            }
            else {
              that.setData({
                toptipType: 'error',
                toptipMessage: '提交失败'
              })
            }
            console.log(res.data)
          },
          fail(res) {
            that.setData({
              toptipType: 'error',
              toptipMessage: '提交失败'
            })
            console.log(res)
          }
        })
      }
      else {
        wx.request({
          url: getApp().globalData.serverURL + 'objects/find_object/',
          data: formData,
          method: 'POST',
          success(res) {
            console.log(res.statusCode);
            if (res.statusCode==201) {
              that.setData({
                toptipType: 'success',
                toptipMessage: '提交成功'
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/findObject/findObject'
                })
              }, 2500)
            }
            else if (res.statusCode==451) {
              that.setData({
                toptipType: 'error',
                toptipMessage: '检测到敏感信息'
              })
            }
            else {
              that.setData({
                toptipType: 'error',
                toptipMessage: '提交失败'
              })
            }
            console.log(res.data)
          },
          fail(res) {
            that.setData({
              toptipType: 'error',
              toptipMessage: '提交失败'
            })
            console.log(res.data)
          }
        })
      }
    }
    else {
      console.log('不能提交');
    }
  },
  /*提交表单前验证函数*/
  canSubmit: function (data) {
    var that = this;

    if (!data.objectName) {
      this.setData({
        toptipType: 'info',
        toptipMessage: '失物名称不能为空'
      })
      return false;
    }

    if (!data.ownerName) {
      this.setData({
        toptipType: 'info',
        toptipMessage: '姓名不能为空'
      })
      return false;
    }

    if (!data.ownerID) {
      this.setData({
        toptipType: 'info',
        toptipMessage: '学号不能为空'
      })
      return false;
    }
    else {
      if (! /^\d{8}$/.test(data.ownerID)) {
        that.setData({
          toptipType: 'info',
          toptipMessage: '学号格式有误'
        })
        return false;
      }
    }

    if (!data.ownerContactNum) {
      this.setData({
        toptipType: 'info',
        toptipMessage: '联系方式不能为空'
      })
      return false;
    }

    return true;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '信息填写'
    })
    this.setData({
      name: wx.getStorageSync('name'),
      studentID: wx.getStorageSync('studentID')
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