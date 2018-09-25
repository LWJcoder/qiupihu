// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()



// 云函数入口函数
exports.main = async (event, context) => {

  var id = event.id,
    shareNum = event.shareNum;
    
  console.log('云函数comment成功',  id)

  // console.warn(data)

  try {
    return await db.collection('funnys').where({
      id: Number(id)
    }).update({
      data: {
        shareNum: shareNum
      },
      success: res => {
        console.log('云函数comment成功', id)

      },
      fail: e => {
        console.error(e)
      }
    })
  } catch (e) {
    console.error(e)
  }

}


