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
          <p>欢迎您，管理员</p>
        </div>
      </div>
      <!--商品栏-->
      <div class="title">
        <ul>
          <li>商品</li>
          <li>名称</li>
          <li>价格</li>
          <li>结束时间</li>
          <li>操作</li>
        </ul>
      </div>
      <!--商品展示-->
      <div class="show" v-for="(item,index) in goodsList" :key="index">
        <div class="pic">
          <img :src="item.gPhoto" alt="">
        </div>
        <div class="name">{{item.gName}}</div>
        <div class="price">￥{{item.gPrice}}</div>
        <div class="time">{{item.endTime | dateFrm}}</div>
        <div class="do" @click="reduce(item.id)">{{msg}}</div>
      </div>
      <!--分页-->
      <div class="page">
        <div class="button" @click="back">上一页</div>&nbsp;
        <div>{{this.page}}/{{Math.ceil(this.count / this.pageSize)}}</div>&nbsp;
        <div class="button" @click="next">下一页</div>
      </div>
      <!--商品上架-->
      <div class="addTitle">添加商品</div>
      <div class="addPro">
        <div class="addName">
          <span>商品名称：</span>
          <input type="text" v-model="gName">
        </div>
        <div class="addName">
          <span>商品图片：</span>
          <input type="text" v-model="gPhoto">
        </div>
        <div class="addName">
          <span>商品价格：</span>
          <input type="text" v-model="gPrice">
        </div>
        <div class="addName">
          <span>竞拍截止日：</span>
          <input type="text" v-model="endTime">
        </div>
        <button class="up" @click="add">上架</button>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Manage',
  data () {
    return {
      page: 1,
      pageSize: 5,
      key: '',
      goodsList: [],
      count: 0,
      flag: false,
      msg: '下架',
      gName: '',
      gPhoto: '',
      gPrice: '',
      endTime: ''
    }
  },
  filters: {
    dateFrm: function (el) {
      return moment(el).format('YYYY-MM-DD')
    }
  },
  mounted () {
    this.getLength()
    this.getGoods()
    // this.add()
  },
  methods: {
    getLength () {
      axios.get('http://localhost:8088/getLength').then(this.getLengthSucc).catch(this.getLengthFail)
    },
    getLengthSucc (res) {
      this.count = res.data.count
    },
    getLengthFail (err) {
      console.log(err)
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
      // console.log(res.data.count, this.count)
      if (res.data.count <= this.pageSize && this.flag) {
        this.count = res.data.count
      }
    },
    getGoodsFail (err) {
      console.log(err)
    },
    search () {
      if (!this.key) {
        return 0
      }
      this.flag = true
      this.getGoods()
      // console.log(this.count)
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
    add () {
      let params = {
        gName: this.gName,
        gPhoto: this.gPhoto,
        gPrice: this.gPrice,
        endTime: this.endTime
      }
      axios.post('http://localhost:8088/addProduct', params).then(this.addSucc).catch(this.addFail)
    },
    addSucc (res) {
      this.gName = ''
      this.gPhoto = ''
      this.gPrice = ''
      this.endTime = ''
      this.getGoods()
      console.log(res)
    },
    addFail (err) {
      console.log(err)
    },
    reduce (id) {
      console.log(id)
      axios.get('http://localhost:8088/reduceProduct?id=' + id).then(this.reduceSucc).catch(this.reduceFail)
    },
    reduceSucc () {
      this.getGoods()
    },
    reduceFail (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped>
  li{
    list-style: none;
    margin: 0 150px;
  }
  img{
    width: 150px;
    height: 150px;
  }
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
  .title{
    margin: 20px 0;
    background-color: #f7f7f7;
    width: 100%;
    padding: 15px 30px;
  }
  .title ul{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .show{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 150px;
  }
  .pic{
    position: absolute;
    left: 235px;
  }
  .name{
    position: absolute;
    left: 550px;
  }
  .price{
    position: absolute;
    left: 950px;
  }
  .time{
    position: absolute;
    left: 1280px;
  }
  .do{
    position: absolute;
    right: 235px;
    cursor: pointer;
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
  .addPro{
    width: 800px;
    height: 500px;
    background-color: #fff;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .addPro input{
    border: none;
    border-bottom: 1px solid #000;
    outline: none;
  }
  .addName{
    display: flex;
    align-items: center;
    margin: 20px;
  }
  .up{
    margin-top: 30px;
    border: none;
    width: 200px;
    padding: 10px 0;
  }
  .addTitle{
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-weight: bold;
    font-size: 30px;
    text-align: center;
    background-color: #f7f7f7;
  }
</style>
