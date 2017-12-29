//list.js
const api = getApp().globalData.api;

Page({
  data: {
    list: [
      // {
      //   img: 'http://img5.mtime.cn/mt/2017/12/09/120449.13626053_1280X720X2.jpg',
      //   tCn: '芳华',
      //   dN: '冯小刚',
      //   actors: '黄轩 / 苗苗 / 钟楚曦 / 杨采钰黄轩 / 苗苗 / 钟楚曦 / 杨采钰黄轩 / 苗苗 / 钟楚曦 / 杨采钰',
      //   movieType: '爱情 / 剧情 ／ 战争',
      //   commonSpecial: '青春少男少女的文工团芳华岁月',
      //   r: '7.7'
      // }
    ],
    isHot: true,
    loading: true
  },

  formatImgSize(list, img, callback) {

    const regExp = new RegExp(img.origin, 'g');

    if (list[img.attr]) { // object
      list[img.attr] = list[img.attr].replace(regExp, img.clip);
    } else {
      list.forEach((value, index) => {
        value[img.attr] = value[img.attr] && value[img.attr].replace(regExp, img.clip);
      });
    }

    callback(list);
  },

  loadHotList() {

    wx.request({
      url: `${api.m}/Showtime/LocationMovies.api`,
      data: {
        locationId: 290
      },
      success: res => {
        // console.log('正在热映', res.data);

        let list = res.data.ms;

        list.forEach((value, index) => {
          value.r = value.r === -1 ?  0 : value.r;
        });

        this.formatImgSize(list, {attr: 'img', origin: '1280X720X2', clip: '200X720X2'}, (res) => {
          this.setData({
            list: res,
            loading: false
          });
        });
      }
    });
  },

  loadComingList() {

    wx.request({
      url: `${api.m}/Movie/MovieComingNew.api`,
      data: {
        locationId: 290
      },
      success: res => {
        // console.log('即将上映', res.data);

        let list = res.data.moviecomings;

        list.forEach((value, index) => {
          value.r = value.r === -1 ?  0 : value.r;
          value.img = value.image;
          value.tCn = value.title;
          value.dN = value.director;
          value.actors = `${value.actor1}${value.actor2 ? ' / ' : ''}${value.actor2 || ''}`;
          value.movieType = value.type;
          value.commonSpecial = '';
        });

        this.formatImgSize(list, {attr: 'img', origin: '1280X720X2', clip: '200X720X2'}, (res) => {
          this.setData({
            list: res,
            loading: false
          });
        });
      }
    });
  },

  gotoDetail(e) {
    const id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    });
  },

  onLoad: function (e) {
    const isHot = e.type === 'hot';

    this.setData({isHot});

    wx.setNavigationBarTitle({
      title: isHot ? '正在热映' : '即将上映'
    });

    isHot ? this.loadHotList() : this.loadComingList();
  }
});
