// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTx: '',
    defaultUrl: '../../images/tx.png',
    username: '点击头像登录',
    userTx: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let username = wx.getStorageSync('username'),
      avatar = wx.getStorageSync('avatar');
    if (username){
      this.setData({
        username: username,
        defaultUrl: avatar
      })
    }
  },

  getUserInfoHandler: function(e){
   
    console.log(e)
    let d = e.detail.userInfo
    this.setData({
      userTx: d.avatarUrl,
      username: d.nickName
    })
    wx.setStorageSync('username', d.nickName)
    wx.setStorageSync('avatar', d.avatarUrl)
    const db = wx.cloud.database()
    const _ = db.command
    var userId = wx.getStorageSync('userId')
    if (!userId) {
      userId = this.getUserId()
    }
    setTimeout(()=>{
      db.collection('users').add({
        data: {
          userId: userId,
          iv: d.iv
        },
        success: function () {
          wx.showToast({
            title: '用户登录成功',
          })
          console.log('用户id新增成功')
        },
        fail: function (e) {
          console.log('用户id新增失败')
        }
      })
    }, 100)
    
  },
  getUserId: function () {
    var w = "abcdefghijklmnopqrstuvwxyz0123456789",
      firstW = w[parseInt(Math.random() * (w.length))];

    var userId = firstW + (Date.now()) + (Math.random() * 100000).toFixed(0)
    console.log(userId)
    wx.setStorageSync("userId", userId)

    return userId;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showInfo: function(){
    wx.showModal({
      title: '关于糗皮虎',
      content: '本小程序的内容来源于网上各大平台(如糗百等),如有侵权,请联系管理员johnnymike007@gmail.com',
      showCancel: false
    })
  }
})