
const ctx = wx.createCanvasContext('shareImg')
Page({
  drawImg(avatarUrl, index) {
    this.setData({
      msg: index + "~~~" + avatarUrl
    })

    let that = this;
    wx.showLoading({
      title: '努力生成中...'
    })
    let promise1 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: avatarUrl,
        success: function(res) {
          console.log("promise1", res)
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: `图像路径`,
        success: function(res) {
          console.log(res)
          resolve(res);
        }
      })
    });

    Promise.all([
      promise1, promise2
    ]).then(res => {
      //主要就是计算好各个图文的位置
      let num = 1125;
      ctx.drawImage(res[0].path, 0, 0, num, num)
      ctx.drawImage('../../' + res[1].path, 0, 0, num, num)
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: num,
          height: num,
          destWidth: num,
          destHeight: num,
          canvasId: 'shareImg',
          success: function(res) {
            console.log(res.tempFilePath);
            that.setData({
              prurl: res.tempFilePath
            })
            wx.hideLoading()
          },
          fail: function(res) {
            wx.hideLoading()
          }
        })
      })
    })
  },
  //获取高清微信头像
  headimgHD(imageUrl) {
    console.log('原来的头像', imageUrl);
    imageUrl = imageUrl.split('/'); //把头像的路径切成数组
    //把大小数值为 46 || 64 || 96 || 132 的转换为0
    if (imageUrl[imageUrl.length - 1] && (imageUrl[imageUrl.length - 1] == 46 || imageUrl[imageUrl.length - 1] == 64 || imageUrl[imageUrl.length - 1] == 96 || imageUrl[imageUrl.length - 1] == 132)) {
      imageUrl[imageUrl.length - 1] = 0;
    }
    imageUrl = imageUrl.join('/'); //重新拼接为字符串
    console.log('高清的头像', imageUrl);
    return imageUrl;
  },

  //生成头像
  shengcheng: function(e) {
    console.log("点击了", e.currentTarget.dataset.k)
    console.log(e);
    let index = e.currentTarget.dataset.k
    let avatarUrl = e.detail.userInfo.avatarUrl
    //获取高清微信头像
    avatarUrl = this.headimgHD(avatarUrl);
    this.drawImg(avatarUrl, index);
  },

  //保存到相册
  save: function() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          }
        })
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '制作属于你的中秋头像',
      path: '/pages/canvas/canvas2',
    }
  },
  onShareTimeline: function () {
		return {
	      title: '爱如圆月，心怀家园',
	      
	      imageUrl: 'https://7131-q1974892005-kz-cn9d0-1301198963.tcb.qcloud.la/T001R300x300M000003WRhir3yPor8.jpg?sign=66e9a43873c120643207d9a24674f310&t=1599218416'
	    }
	},
})
