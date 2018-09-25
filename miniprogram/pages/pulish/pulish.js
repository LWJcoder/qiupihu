// pages/pulish/pulish.js
var app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    imgUrl: '',
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCount()
  },
  getCount: function(){

    var that = this
    db.collection('funnys').count({
      success: res => {
        that.setData({
          count: Number(res.total) + 1
        })
      }
    })

  },
  textInput: function(e){
    this.setData({
      text: e.detail.value
    })
  },
  pulish: function(){

    var data = {
      image: new Array(app.globalData.fileID),
      content: this.data.text,
      comment: [],
      userId: wx.getStorageSync('userId'),
      username: wx.getStorageSync('username'),
      id: Number(this.data.count) +1,
      shareNum: 0,
      commentNum: 0,
      unValid: 1
    }
    console.log(data)

    if (data.content){
        db.collection('funnys').add({
          data: data,
          success:res => {
            wx.showToast({
              title: '发布成功',
            })
            setTimeout(()=>{
              
              wx.switchTab({
                url: '../index/index',
              })
            }, 1000)
          },
          fail: e=>{
            wx.showToast({
              title: '发布错误',
            })
            console.log(e)
          }
        })
    }else{
      wx.showToast({
        title: '请填写文字',
        icon: 'none'
      })
    }

  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        that.setData({
          imgUrl: filePath
        })
        // 上传图片
        const cloudPath = that.data.count + filePath.match(/\.[^.]+?$/)[0]
        //改写: 数组 多图片
        // const filePath = res.tempFilePaths, cloudPath = [];
        // filePath.forEach((item, i)=>{
        //   cloudPath.push(that.data.count + '_' + i + filePath[i].match(/\.[^.]+?$/)[0])
        // })
         
        console.log(cloudPath)


        // filePath.forEach((item, i) => {
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', cloudPath, res)

              app.globalData.fileID = res.fileID
              app.globalData.cloudPath = cloudPath
              app.globalData.imagePath = filePath
              
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        // })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})