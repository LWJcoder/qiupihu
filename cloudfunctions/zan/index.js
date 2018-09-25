// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()



// 云函数入口函数
exports.main = async (event, context) => { 

  var vote = event.vote, id = event.id;
  console.log('云函数zan成功', vote, id)

  // console.warn(data)

  try {
    return await db.collection('funnys').where({
      id: Number(id)
    }).update({
      data: {
        vote: vote
      },
      success: res => {
        console.log('云函数zan成功', vote, id)
        
      },
      fail: e => {
        console.error(e)
      }
    })
  } catch (e) {
    console.error(e)
  }

}


