<template>
    <div class="main">
      <!--头部-->
      <div class="header">
        <div class="welcome">
          <img src="../assets/pageLogo.png" alt="">
          <span>拍 拍 乐</span>
        </div>
      </div>
      <!--间隙-->
      <div class="space"></div>
      <!--导航栏-->
      <div class="nav">
        <a href="javascript:void(0)">立即抢购</a>
        <a href="javascript:void(0)">我要帮助</a>
        <a href="http://localhost:8080/#/mine">我的拍卖</a>
      </div>
      <!--商品详情-->
      <div class="wrap">
        <div class="left">
          <div class="product">
            <div style="width: 50%">
              <img :src="goods.gPhoto" alt="" style="height: 450px;width: 100%;line-height: 450px">
            </div>
            <!--商品内容-->
            <div class="content">
              <div class="name">{{goods.gName}}</div>
              <!--结束时间-->
              <div class="time">
                <p style="margin-bottom: 20px">该拍卖结束时间： <span style="color: red">{{goods.endTime | dateFrm}}</span></p>
                <div><span style="color: #333">12</span>人围观</div>
              </div>
              <!--价格-->
              <div class="price">
                ￥ <span>{{goods.gPrice}}</span>
              </div>
              <!--竞拍按钮-->
              <div :class="['auction', this.flag === true ? 'fail' : '']" @click="auction">{{this.msg}}</div>
              <p style="color: #666">本服务不支持7天无理由</p>
            </div>
          </div>
          <div class="bot-pic">
            <img src="../assets/bottom.jpg" alt="" style="height: 150px;width: 100%">
          </div>
        </div>
        <div class="right">
          <img src="../assets/ad.jpg" alt="">
        </div>
      </div>
      <!--遮罩-->
      <div class="mask" ref="mask" v-show="mask">
        <div class="order">
          <div class="title">订单信息</div>
          <div class="person">
            <span>竞拍金额</span>
            <input type="text" placeholder="请输入金额" v-model="price">
          </div>
          <div class="person">
            <span>收件人</span>
            <input type="text" placeholder="请输入收件人姓名" v-model="name">
          </div>
          <div class="person">
            <span>收件人联系方式</span>
            <input type="text" placeholder="请输入收件人联系方式" v-model="phone">
          </div>
          <div class="adress">
            <p style="margin-bottom: 10px">收件人地址</p>
            <textarea name="" id="" cols="43" rows="5" placeholder="请输入收件人地址" v-model="adress"></textarea>
          </div>
          <div class="sure" @click="sure">确认</div>
          <div class="close" @click="close">X</div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Detail',
  data () {
    return {
      uid: '',
      id: '',
      goods: {},
      mask: false,
      name: '',
      phone: '',
      adress: '',
      price: '',
      photo: '',
      gname: '',
      list: [],
      msg: '我要竞拍', // 竞拍按钮中的内容
      flag: false // 控制按钮变灰
    }
  },
  filters: {
    dateFrm: function (el) {
      return moment(el).format('YYYY-MM-DD')
    }
  },
  watch: {
    'list': {
      handler () {
        this.judge()
        console.log(123)
      },
      deep: true
    }
  },
  mounted () {
    this.uid = this.$route.query.uid
    console.log(this.uid)
    this.id = this.$route.query.id
    this.getData()
    this.getMsg()
    // this.judge()
  },
  methods: {
    getData () {
      axios.get('http://localhost:8088/getdetail?id=' + this.id).then(this.getDataSucc).catch(this.getDataFail)
    },
    getDataSucc (res) {
      this.goods = res.data
      this.gid = res.data.id
      this.photo = res.data.gPhoto
      this.gname = res.data.gName
    },
    getDataFail (err) {
      console.log(err)
    },
    auction () {
      if (this.flag) {
        return 0
      }
      this.mask = true
    },
    close () {
      this.mask = false
      this.price = ''
      this.name = ''
      this.phone = ''
      this.adress = ''
    },
    sure () {
      if (!this.price) {
        alert('请输入竞拍金额 !')
        return 0
      }
      if (this.price <= this.goods.gPrice) {
        alert('请输入正确的竞拍金额 !')
        return 0
      }
      if (!this.name) {
        alert('请输入收件人姓名 !')
        return 0
      }
      if (!this.phone) {
        alert('请输入收件人联系方式 !')
        return 0
      }
      if (!this.adress) {
        alert('请输入收件人地址 !')
        return 0
      }
      axios.get('http://localhost:8088/update?gid=' + this.gid + '&price=' + this.price).then(this.sureSucc).catch(this.sureFail)
      let params = {
        uid: this.uid,
        gid: this.gid,
        name: this.name,
        phone: this.phone,
        adress: this.adress,
        price: this.price,
        photo: this.photo,
        gname: this.gname
      }
      axios.post('http://localhost:8088/saveOrder', params).then(this.saveSucc).catch(this.saveFail)
    },
    sureSucc (res) {
      console.log(res)
    },
    sureFail (err) {
      console.log(err)
    },
    saveSucc (res) {
      console.log(res.data, 111111)
      alert('订单保存成功！')
      this.$router.push({path: '/mine', query: {uid: this.uid}})
    },
    saveFail (err) {
      console.log(err)
    },
    // 获取用户的订单信息
    getMsg () {
      axios.get('http://localhost:8088/getMessage?uid=' + this.uid).then(this.getMsgSucc).catch(this.getMsgFail)
    },
    getMsgSucc (res) {
      this.list = res.data
      console.log(this.list)
      // for (let i = 0; i < this.list.length; i++) {
      //   // this.idList.push(this.list[i].gid)
      //   this.idList = this.idList + this.list[i].gid + ','
      // }
      // this.idList = this.idList.substring(0, this.idList.length - 1)
      // console.log(this.idList, typeof this.idList)
    },
    getMsgFail (err) {
      console.log(err)
    },
    // 判断用户是否竞拍过此商品
    judge () {
      for (let i = 0; i < this.list.length; i++) {
        if (this.id === this.list[i].gid) {
          this.msg = '竞拍中'
          this.flag = true
          return 0
        }
      }
    }
  }
}
</script>

<style scoped>
  .main{
    background-color: #f7f7f7;
    height: 100%;
  }
  .header{
    width: 100%;
    height: 100px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  .space{
    height: 10px;
    background-color: #fff;
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
  .wrap{
    margin: 50px auto;
    width: 70%;
    height: 700px;
    background-color: #fff;
    display: flex;
  }
  .left{
    width: 75%;
    background-color: #fff;
    position: relative;
  }
  .product{
    display: flex;
  }
  .content{
    width: 50%;
    padding: 30px;
    box-sizing: border-box;
  }
  .name{
    margin: 30px 0;
    font-size: 18px;
  }
  .time{
    color: #666;
    padding: 20px 0;
    line-height: 1.5;
  }
  .price{
    margin: 30px 0;
    font-size: 28px;
    font-weight: bold;
  }
  .auction{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: darkred;
    font-size: 24px;
    border-radius: 50px;
    width: 250px;
    height: 80px;
    margin-bottom: 30px;
  }
  .fail{
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #ccc;
    font-size: 24px;
    border-radius: 50px;
    width: 250px;
    height: 80px;
    margin-bottom: 30px;
  }
  .bot-pic{
    position: absolute;
    bottom: 0;
    height: 150px;
  }
  .right{
    width: 25%;
    background-color: cornflowerblue;
  }
  .right img{
    width: 100%;
    height: 100%;
  }
  .mask{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
  }
  .order{
    width: 400px;
    height: 500px;
    background-color: #fff;
    margin: 200px auto;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .order span{
    margin-right: 20px;
  }
  .order input{
    border: none;
    outline: none;
  }
  .title{
    margin: 30px auto;
    font-weight: bold;
    font-size: 24px;
  }
  .person{
    margin: 0 30px 20px 30px;
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
  }
  .adress{
    margin: 0 30px 20px 30px;
  }
  .adress textarea{
    resize: none;
    outline: none;
    padding: 10px;
    box-sizing: border-box;
  }
  .sure{
    width: 350px;
    height: 40px;
    background-color: darkred;
    margin: 0px auto;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  .close{
    font-size: 10px;
    position: absolute;
    right: 3px;
    top: 3px;
    padding: 4px 8px;
    background-color: rgba(0,0,0,.5);
    border-radius: 50%;
    color: #fff;
  }
  .close:hover{
    background-color: #A63723;
    cursor: pointer;
  }
</style>
