<template>
    <div class="main">
      <!--头部-->
      <div class="header">
        <div class="welcome">
          <img src="../assets/pageLogo.png" alt="">
          <span>拍 拍 乐</span>
        </div>
        <div class="search">
          <input type="text" placeholder="请输入搜索内容..." v-model="key">
          <span @click="search">搜索</span>
        </div>
        <div class="user">
          <p>欢迎您，<span style="color: #FFA000">{{this.username}}</span></p>
        </div>
      </div>
      <!--间隙-->
      <div class="space"></div>
      <!--导航栏-->
      <div class="nav">
        <a href="javascript:void(0)">立即抢购</a>
        <a href="javascript:void(0)">我要帮助</a>
        <a href="javascript:void(0)" @click="toMine">我的拍卖</a>
      </div>
      <!--图片栏-->
      <!--<div class="pic">-->
        <!--<img src="../assets/index3.png" alt="">-->
      <!--</div>-->
      <div>
        <swiper :options="swiperOption">
          <swiper-slide class="swiper-slide" v-for="(item,index) in slide" :key="index">
            <img :src="item.src" alt="">
          </swiper-slide>
          <div class="swiper-pagination"  slot="pagination"></div>   <!-- 分页 -->
          <div class="swiper-button-prev" slot="button-prev"></div>  <!-- 箭头左 -->
          <div class="swiper-button-next" slot="button-next"></div>  <!-- 箭头右 -->
        </swiper>
      </div>
      <!--商品栏-->
      <div class="title">
        <img src="../assets/product.png" alt="">&nbsp;&nbsp;
        <p>热拍HOT</p>
      </div>
      <!--商品拍卖-->
      <div class="product">
        <div class="pro" v-for="(item,index) in goodsList" :key="index" @click="toDetail(item.id)">
          <img :src="item.gPhoto" alt="" class="photo">
          <p>{{item.gName}}</p>
          <div class="time">结束时间 <span>{{item.endTime | dateFrm}}</span></div>
          <div class="price">当前价格： <span style="font-weight: bold;color: #333">￥{{item.gPrice}}</span></div>
          <div class="pai">
            <img src="../assets/pai.png" alt="">
            <p>我要抢拍</p>
          </div>
        </div>
      </div>
      <!--分页-->
      <div class="page">
        <div class="button" @click="back">上一页</div>&nbsp;
        <div>{{this.page}}/{{Math.ceil(this.count / this.pageSize)}}</div>&nbsp;
        <div class="button" @click="next">下一页</div>
      </div>
      <!--底部-->
      <div class="footer">
        <div class="footer-name">买卖须知</div>
        <div class="footer-content">
          <p style="font-weight: bold">竞拍活动基础服务</p>
          <p>
            1.如实描述承诺：卖家承诺如实描述，一旦发现描述不符的拍品，买家可在交易成功后指定期限内向京东投诉卖家。<br/>
            2.保证金保障：卖家入驻竞拍平台需缴纳较高的经营保证金，买家维权有保障。
          </p>
          <p style="font-weight: bold">拍卖承诺</p>
          <p>
            友情提示:根据中华人民共和国法律，拍卖行具有合法的拍卖经营主体资格，在中华人民共和国法律和政策允许的范围内，组织和开展拍卖活动。凡参加拍卖行组织、开展的文物、网络竞投拍卖、艺术品等收藏品拍卖活动的委托人、竞买人、买受人和其他相关各方均视为同意且应遵守《中华人民共和国拍卖法》。
            <br/>
            1. 依据《中华人民共和国拍卖法》的规定，拍卖行承诺如实描述拍品。
            <br/>
            2.拍卖行成交不卖，拍卖行应将保证金退一赔一向竞买成功人。
            <br/>
            3.关于拍卖行佣金收取：依据《中华人民共和国拍卖法》的规定，竞买人在竞拍成功后，需根据拍卖行约定（商品页面描述佣金额），缴纳约定比例、数额的佣金。
            <br/>
            4.关于运费：由竞买成功人承担，以拍卖行实际商品描述运费为准。（如：贵重商品额外保险费用需要由竞买成功人承担）。
          </p>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Index',
  data () {
    return {
      flag: false,
      count: 0,
      key: '',
      page: 1,
      pageSize: 8,
      goodsList: [],
      username: '',
      uid: '',
      slide: [
        {src: require('../assets/wheel/wheel1.png')},
        {src: require('../assets/wheel/wheel2.png')},
        {src: require('../assets/wheel/wheel3.png')}],
      // 设置属性
      swiperOption: {
        // 显示分页
        pagination: {
          el: '.swiper-pagination',
          clickable: true // 允许分页点击跳转
        },
        // 设置点击箭头
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        // 自动轮播
        autoplay: {
          delay: 1500
        },
        // 开启循环模式
        loop: true,
        // 开启鼠标滚轮控制Swiper切换
        mousewheel: false
      }
    }
  },
  comments: {
    swiperSlide,
    swiper
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {
    this.username = this.$route.query.username
    this.uid = this.$route.query.uid
    console.log(this.uid)
    this.getLength()
    this.getGoods()
  },
  methods: {
    getLength () {
      axios.get('http://localhost:8088/getLength').then(this.getLengthSucc).catch(this.getLengthFail)
    },
    getLengthSucc (res) {
      this.count = res.data.count
      console.log(this.count)
    },
    getLengthFail (err) {
      console.log(err)
    },
    search () {
      if (!this.key) {
        return 0
      }
      this.flag = true
      this.getGoods()
    },
    toDetail (val) {
      this.$router.push({path: './detail', query: {id: val, uid: this.uid}}) // id:商品id  uid:用户id
    },
    getGoods () {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        key: this.key
      }
      axios.post('http://localhost:8088/getproduct', params).then(this.getGoodsSucc).catch(this.getGoodsFail)
    },
    getGoodsSucc (res) {
      this.goodsList = res.data.list
      // 搜索之后控制分页的number
      if (res.data.count <= this.pageSize && this.flag) {
        this.count = res.data.count
      }
    },
    getGoodsFail (err) {
      console.log(err)
    },
    next () {
      if (this.page >= Math.ceil(this.count / this.pageSize)) {
        return 0
      }
      this.page++
      this.getGoods()
    },
    back () {
      if (this.page === 1) {
        return 0
      }
      this.page--
      this.getGoods()
    },
    toMine () {
      console.log(this.uid)
      this.$router.push({path: '/mine', query: {uid: this.uid}})
    }
  },
  filters: {
    dateFrm: function (el) {
      return moment(el).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
  .header{
    width: 100%;
    height: 100px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search input{
    width: 300px;
    font-size: 18px;
    outline: none;
  }
  .search span{
    /*border: 1px solid #ccc;*/
    border-radius: 5px;
    padding: 2px 10px;
    color: #333;
    text-align: center;
    line-height: 1.5;
  }
  .search span:hover{
    background-color: dodgerblue;
    color: #fff;
    cursor: pointer;
  }
  .welcome{
    margin-left: 200px;
    display: flex;
    align-items: center;
  }
  .welcome span{
    margin-left: 20px;
    font-weight: bold;
    font-size: 28px;
    color: #FFA000;
  }
  .welcome img{
    height: 90px;
  }
  .user{
    margin-right: 70px;
  }
  .user p{
    color: #666;
  }
  .space{
    height: 10px;
    background-color: #f7f7f7;
  }
  .nav{
    height: 30px;
    background-color: #FFA000;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 50px;
  }
  .nav a{
    text-decoration: none;
    margin: 0 20px;
    color: darkred;
  }
  .nav a:hover{
    color: red;
  }
  .pic{
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
  }
  .pic img{
    width: 70%;
    height: 500px;
  }
  .title{
    width: 100%;
    font-size: 24px;
    color: #3C2415;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 50px 0;
  }
  .title img{
    width: 50px;
    height: 50px;
  }
  .product{
    padding-left: 180px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background-color: #f7f7f7;
  }
  .pro{
    width: 15%;
    height: 300px;
    background-color: #fff;
    margin: 20px 60px;
    position: relative;
    cursor: pointer;
  }
  .photo{
    width: 100%;
    height: 60%;
  }
  .pai{
    position: absolute;
    right: -10px;
    bottom: 10px;
    font-size: 14px;
    color: #EC7069;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pai img{
    width: 60px;
    height: 50px;
  }
  .pro p{
    padding: 0 20px;
    line-height: 1.5;
  }
  .time{
    color: #999;
    padding: 10px 20px;
  }
  .time span{
    font-weight: bold;
    color: #333;
  }
  .price{
    padding: 0 20px;
    color: #999;
  }
  .page{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }
  .button{
    cursor:pointer;
    border: none;
    background-color: #fff;
  }
  .footer{
    height: 300px;
    background-color: #f7f7f7;
  }
  .footer-name{
    height: 80px;
    line-height: 100px;
    font-size: 24px;
    font-weight: bold;
    font-family: 宋体;
    display: flex;
    justify-content: center;
    color: #C7171E;
  }
  .footer-content{
    padding: 0 100px;
    font-size: 14px;
  }
  .swiper-slide {
    width: 100%;
    height: 600px;
    line-height: 500px;
    font-size: 50px;
    text-align: center;
    /*background-color: rosybrown;*/
  }
</style>
