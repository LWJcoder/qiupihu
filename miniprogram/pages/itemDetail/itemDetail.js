// pages/itemDetail/itemDetail.js
const db = wx.cloud.database()
const _ = db.command
var app = getApp()
const util = require('../../util/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: '../../images/tx.png',
    data: {},
    shareIconUrl: '../../images/zan.png',
    shareIconUrl1: '../../images/zan1.png',
    commentTxt: '',
    itemId: '',
    comments: [],
    isShareTip: false,
    voteFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.isShareTip){
      this.setData({
        isShareTip: true
      })
    }
    if (options.id){
      this.setData({
        itemId: options.id
      })
      console.log(options.id)
      this.search(options.id)
    }

  },
  search: function(id){
    let idNum = 0;
    if (Number(id) || Number(id) == 0)
      idNum = Number(id)
    else
      idNum = this.data.itemId;
    db.collection('funnys').where({
      id: _.eq(idNum)
    }).get({
      success: res => {
        console.log(res)
        let D = res.data;

        this.setData({
          data: D[0]
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  inputHandler: function(e){
    console.log(e)
    this.setData({
      commentTxt: e.detail.value
    })
  },
  confirm: function(){
    const db = wx.cloud.database()
    const _ = db.command

    //发送评论
    let d = new Date(),data = {};
    let arr = util.typeC(this.data.data.comment) == 'array' ? this.data.data.comment : new Array(this.data.data.comment);
    if (this.data.commentTxt){
      data = {
        comment: this.data.commentTxt,
        username: wx.getStorageSync('username'),
        time: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
        userId: wx.getStorageSync('userId'),
        id: this.data.itemId,
        avatar: wx.getStorageSync('avatar')
      }
      arr.push(data)
     
    }else
      wx.showToast({
        title: '请填写内容',
        icon:'none'
      })

   
    if (!data.avatar || !data.userId){
      wx.getSetting({
        success: function(data){
          console.log(data)
      
        },
        fail: function(e){
   
        }
      })
      wx.showToast({
        title: '您还未登录,请先登录',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../me/me',
        })
      }, 1000)
    }else{
      var cn = this.data.data.comment.length + 1;
      db.collection('comments').add({
        data: {
          id: data.userId,
          userId: data.userId,
          text: data.comment
        },
        success: res=>{
          console.log('comment新增成功')
        },
        fail: e=>{
          console.log('comment新增失败')
        }
      })
      wx.cloud.callFunction({
        name: 'comment',
        data: {
          comment: arr,
          id: this.data.itemId,
          commentNum: cn
        },        
        success: res => {
          wx.showToast({
            title: '评论成功',
          })  
          this.search()      
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '评论失败',
          })
          console.error('[云函数] [comment] 调用失败：', err)
        }
      })
    }
    console.log(data)
  },


  navBack: function(){
    wx.switchTab({
      url: '../index/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    var that = this;
    if (res.from === "button") {
      wx.cloud.callFunction({
        name: 'shareHandler',
        data: {
          id: res.target.dataset.qiuid,
          shareNum: Number(res.target.dataset.sharenum) + 1
        },
        success: e => {
          wx.showToast({
            title: '分享成功',
          })
          that.search(that.data.pageId)
          console.log(e)
        },
        fail: e => {
          console.log(e)
        }
      })
      return {
        title: "我发现了一个好笑的东西,分享给你 --糗皮虎",
        path: '/pages/itemDetail/itemDetail?id=' + res.target.dataset.qiuid + '&isShareTip=1',
        imageUrl: ''
      }
    }
  },
  zan: function (e) {
    if (!this.data.voteFlag){
      var id = Number(e.currentTarget.dataset.id),
        vote = Number(e.currentTarget.dataset.vote)
        ;

      var that = this,
        D = this.data.data;
      D.vote = vote + 1

      wx.cloud.callFunction({
        name: 'zan',
        data: {
          data: {
            vote: vote + 1,
            id: id,
          }
        },
        success: res => {
          wx.showToast({
            title: '点赞成功',
          })
          that.setData({
            data: D,
            voteFlag: true
          })

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '点赞失败',
          })
          console.error('[云函数] [zan] 调用失败：', err)
        }
      })  
    }else{
      wx.showToast({
        title: '你已经投过票了',
        icon: 'none'
      })
    }
     

  },
})