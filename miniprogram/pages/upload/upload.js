// pages/upload/upload.js
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let openid = wx.getStorageSync('openId')
    if (openid)
      db.collection('funnys').where({
        _openid: openid
      }).get({
        success: res =>{
          this.setData({
            data: res.data
          })
        }
      })
    else{
      wx.showToast({
        title: '请先登录',
      })
    }
  },

})