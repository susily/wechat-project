// page/list/list.js
// 用utils中封装的请求函数进行请求
const fetch = require("../../utils/fetch.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:{},
      shops:[],
      pageIndex:0,
      pageSize:20,
      hasMore:true
  },
  loadMore(){
      if(!this.data.hasMore)  return
      let {pageIndex,pageSize}=this.data
      const params = {_page:++pageIndex,_limit:pageSize}
      return fetch(`categories/${this.data.category.id}/shops`,params)
        .then(res=>{
            const totalCount = parseInt(res.header['X-Total-Count'])
            const hasMore = pageIndex*pageSize < totalCount
            this.setData({shops:this.data.shops.concat(res.data),pageIndex,hasMore});
            console.log(res.data)
        })
    },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options){

      fetch(`categories/${options.cat}`).then(res=>{
          console.log(res.data);
          this.setData({category: res.data});
          wx.setNavigationBarTitle({
              title: res.data.name
          });

          this.loadMore()
      })


      /*wx.request({
          // url的拼接写法
          url: `https://locally.uieee.com/categories/${options.cat}`,
          success: res => {
              this.setData({category: res.data});
              console.log(res.data);
              wx.setNavigationBarTitle({
                  title: res.data.name
              })
          }
      });*/

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //这里是双重保障，标题的修改必须在onready页面渲染以后，但是网络请求无法判断请求速度快慢，如果先执行fetch中的修改，而页面还未渲染
  //此时就会报错，因此先进行if判断
  onReady: function () {
      if(this.data.category.name){
          wx.setNavigationBarTitle({
              title: this.data.category.name
          })
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.setData({shops:[],pageIndex:0,hasMore:true})
      this.loadMore().then(()=> wx.stopPullDownRefresh())
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})