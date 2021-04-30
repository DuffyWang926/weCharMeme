//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    imgList:[],
    searchValue:''
  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.getData()
  },
  inputTap(e){
    const { value } = e.detail
    this.setData({
      searchValue:value
    })

  },
  searchTap(e){
    debugger
    const { imgListInit, searchValue } = this.data
    let arr = Array.isArray(imgListInit) && imgListInit.filter( item =>{
      let name = item.name || ''
      return name.includes(searchValue)
    })
    console.log(arr)
    debugger
    this.setData({
      imgList:arr
    })
  },
  getData(){
    let that = this
    const imgList = db.collection("imgList")
    imgList.count().then( res =>{
      const { total } = res
      const batchTimes = Math.ceil(total / 20)
      let arraypro = [] 
      let x = 0 
      for (let i = 0; i < batchTimes; i++) {
        db.collection("imgList").where({
          _openid:'oFGvj5ILTdWb5-v8SJNVhN2DFMlw',
        }).orderBy('level', 'desc').skip(i * 20).get({
          success: function (res) {
            x += 1
            for (let j = 0; j < res.data.length; j++) {
              arraypro.push(res.data[j])
            }
            if (x == batchTimes) {
              arraypro.sort( (a,b) => {
                return a.level - b.level
              })
              that.setData({
                imgList: arraypro,
                imgListInit:arraypro
              })
            }
          }
        })
      }
    })
  },
  imgTap(e){
    const { item } = e.currentTarget.dataset
    const { fileID } = item
    debugger
    

    wx.cloud.downloadFile({
      fileID,
      success: res => {
        console.log(res.tempFilePath)
        debugger
        
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })

      },
      fail: err => {
      }
    })
    // wx.downloadFile({
    //   url: fileID,
    //   success (res) {
    //       wx.saveImageToPhotosAlbum({
    //         filePath: res.tempFilePath,
    //         success: function (data) {
    //           console.log(data);
    //         },
    //         fail: function (err) {
    //           console.log(err);
    //           if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
    //             console.log("用户一开始拒绝了，我们想再次发起授权")
    //             alert('打开设置窗口')
    //             wx.openSetting({
    //               success(settingdata) {
    //                 console.log(settingdata)
    //                 if (settingdata.authSetting['scope.writePhotosAlbum']) {
    //                   console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
    //                 } else {
    //                   console.log('获取权限失败，给出不给权限就无法正常使用的提示')
    //                 }
    //               }
    //             })
    //           }
    //         }
    //       })
    //   }
    // })
    
  }
})
