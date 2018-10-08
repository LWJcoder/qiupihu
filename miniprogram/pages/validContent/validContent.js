// pages/validContent/validContent.js
const db = wx.cloud.database()
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: '../../images/tx.png',
    data: '',
    id: '',
    limitCount: 1,
    skipCount: 1
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    this.search()

  },
  search: function(){
    var skipCount = this.data.skipCount;
    db.collection('funnys').where({
      validTime: _.lt(5).and(_.gte(0)),
      _openid: _.neq(wx.getStorageSync('openId'))
    }).skip(skipCount).limit(this.data.limitCount).get({
      success: res => {
        console.log(res)
        if (res.data.length > 0)
          this.setData({
            data: res.data[0],
            id: res.data[0].id,
            skipCount: skipCount + 1
          })
      },
      fail: err => {
        wx.showToast({
          title: '出错',
          icon: 'none'
        })
      }
      })
  },
  passItem: function(e){
    if (this.data.id){
      wx.cloud.callFunction({
        name: 'passItem',
        data: {
          id: this.data.id,
          validTime: this.data.data.validTime+1,
          validStatus: this.data.data.validStatus+1
        },
        success : res =>{
          wx.showToast({
            title: '通过帖子',
          })
          this.search()
        },
        fail: err =>{
          wx.showToast({
            title: '出现错误',
            icon: 'none'
          })
        }
      })
    }
  },
  unPassItem: function (e) {
       wx.showToast({
            title: '打回帖子',
          })
    // if (this.data.id) {
    //   wx.cloud.callFunction({
    //     name: 'passItem',
    //     data: {
    //       id: this.data.id,
    //       validTime: this.data.data.validTime + 1,
    //       validStatus: this.data.data.validStatus - 1
    //     },
    //     success: res => {
    //       this.search()
    //       wx.showToast({
    //         title: '打回帖子',
    //       })
    //     },
    //     fail: err => {
    //       wx.showToast({
    //         title: '出现错误',
    //         icon: 'none'
    //       })
    //     }
    //   })
    // }
  }

})