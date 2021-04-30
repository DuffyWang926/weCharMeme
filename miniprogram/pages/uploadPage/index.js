//index.js
const app = getApp()

const db = wx.cloud.database()



Page({
  data: {
    type:'',
    name:'',
    level:''
  },

  onLoad: function() {
    
    
  },
   // 上传图片
   doUpload: function () {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:  res => {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        let date = parseInt(((new Date()).valueOf())/1000)
        const cloudPath = `meme/my-image${date}${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
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
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  inputTap(e){
    const { value } = e.detail
    this.setData({
      name:value
    })
  },
  typeTap(e){
    const { value } = e.detail
    this.setData({
      type:value
    })
  },
  levelTap(e){
    const { value } = e.detail
    this.setData({
      level:value
    })
  },
  addData(data){
    const { name, level, type } = this.data
    const { fileID } = app.globalData
    let date = parseInt(((new Date()).valueOf())/1000)
    db.collection('imgList').add({
      data:{
        name:name,
        level,
        type,
        fileID:fileID,
        date
      },
    }).then( res =>{
      wx.showToast({
        title: '插入成功',
      })
    })

  }

  

})
