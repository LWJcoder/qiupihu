// pages/advice/advice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    showCBtn: true,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  textareaHandler: function(e){
    this.setData({
      text: e.detail.value
    })
  },
  complate: function(){
    const db = wx.cloud.database();
    var that = this;
    if (this.data.text){
      db.collection('advices').add({
        data: {
          text: that.data.text,
          openId: wx.getStorageSync('openId')
        },
        success: res =>{
          wx.showToast({
            title: '提交意见/建议成功',
          })

          setTimeout(()=>{
            wx.switchTab({
              url: '../index/index',
            })
          }, 1000)
        },
        fail: e =>{
          wx.showToast({
            title: '提交意见/建议失败',
            icon: 'none'
          })
        }
      })
    }
  }

})