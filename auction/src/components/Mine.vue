<template>
    <div>
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
      <!--竞拍-->
      <div class="al-auction">
        <div class="ad-left">
          <img src="../assets/ad.jpg" alt="" style="width: 100%;height: 100%">
        </div>
        <!--竞拍详情start-->
        <div class="au-detail">
          <div class="title">
            <span>商品</span>
            <span>商品名字</span>
            <span>价格</span>
            <span>收件人</span>
            <span>联系方式</span>
            <span>地址</span>
            <span style="margin-left: 85px">状态</span>
          </div>
          <div class="content" v-for="(item,index) in list" :key="index">
            <img :src="item.photo" alt="" class="pro">
            <span style="display: inline-block;width: 80px;font-size: 14px">{{item.gname}}</span>
            <span>￥{{item.price}}</span>
            <span style="margin: 0 55px">{{item.name}}</span>
            <span>{{item.phone}}</span>
            <span style="display: inline-block;width: 100px;font-size: 14px">{{item.adress}}</span>
            <span @click="plus(item.gid, item.state)" :class="['state', item.state === '我要加价' ? 'state-active' : '']">{{item.state}}</span>
          </div>
        </div>
        <!--竞拍详情end-->
        <div class="ad-right">
          <img src="../assets/img/buy.png" alt="" style="width: 100%;height: 30%">
          <img src="../assets/img/buy.png" alt="" style="width: 100%;height: 30%">
          <img src="../assets/img/buy.png" alt="" style="width: 100%;height: 30%">
        </div>
      </div>
      <!--弹出层-->
      <div class="mask" ref="mask" v-show="mask">
        <div class="mask-content">
          <p style="text-align: center;line-height: 1.5">
            您竞拍的商品
            <span style="color: mediumvioletred" v-for="(item,index) in proName" :key="index">{{item}}&nbsp;</span>
            已被其他用户超越
          </p>
          <button style="background-color: dodgerblue" @click="cancel">确定</button>
        </div>
      </div>
      <!--加价弹出层-->
      <div class="mask" ref="mask" v-show="masks" @click.self="close">
        <div class="add">
          <p style="padding-top: 30px">商品当前价格：￥{{current}}</p>
          <div class="tag">
            <span>加价金额：</span>
            <input type="text" v-model="newPrice">
          </div>
          <div class="sure" @click="ensure">确认</div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Mine',
  data () {
    return {
      newPrice: '',
      current: '',
      msg: '竞拍中',
      uid: '',
      list: [],
      idList: '',
      msgList: [],
      mask: false,
      masks: false,
      proName: [],
      id: [],
      temp: 0
    }
  },
  watch: {
    'idList': function () {
      this.getUserGoods()
    },
    'msgList': function () {
      this.compare()
    }
  },
  mounted () {
    this.uid = this.$route.query.uid
    console.log(this.uid)
    this.getData()
    // this.compare()
  },
  methods: {
    // 获取用户的订单信息
    getData () {
      axios.get('http://localhost:8088/getMessage?uid=' + this.uid).then(this.getDataSucc).catch(this.getDataFail)
    },
    getDataSucc (res) {
      console.log(res.data)
      this.list = res.data
      for (let i = 0; i < this.list.length; i++) {
        // this.idList.push(this.list[i].gid)
        this.idList = this.idList + this.list[i].gid + ','
      }
      this.idList = this.idList.substring(0, this.idList.length - 1)
      console.log(this.idList, typeof this.idList)
    },
    getDataFail (err) {
      console.log(err)
    },
    // 根据用户的订单信息获取全部商品的详情
    getUserGoods () {
      let params = {
        gid: this.idList
      }
      console.log(params.gid, typeof params.gid)
      axios.post('http://localhost:8088/getAllMessage', params).then(this.getUserGoodsSucc).catch(this.getUserGoodsFail)
    },
    getUserGoodsSucc (res) {
      this.msgList = res.data
      console.log(this.msgList)
    },
    getUserGoodsFail (err) {
      console.log(err)
    },
    compare () {
      // var arr = []
      var gid1 = [] // 存订单里的商品id
      var gid2 = [] // 存goods表中的商品id
      var price1 = [] // 存订单里的商品价格
      var price2 = [] // 存goods表中的商品价格
      var gName = [] // 存订单里的商品名称
      var state = [] // 存订单里的商品状态 0:竞拍领先 1:竞拍落后
      var endTime = [] // 存商品的截止日期
      // 订单
      for (let i = 0; i < this.list.length; i++) {
        this.$set(this.list[i], 'state', '竞拍中')
        gid1.push(this.list[i].gid)
        price1.push(this.list[i].price)
        gName.push(this.list[i].gname)
        state.push(this.list[i].state)
        // 返回商品
        for (let j = 0; j < this.msgList.length; j++) {
          gid2.push(this.msgList[j].id)
          price2.push(this.msgList[j].gPrice)
          endTime.push(this.msgList[j].endTime)
        }
      }
      for (let i = 0; i < gid1.length; i++) {
        for (let j = 0; j < gid2.length; j++) {
          if (gid1[i] === gid2[j]) {
            // 判断是否到截止时间
            if (!this.compareDate(this.dateFrm(endTime[j]), this.getNowFormatDate())) {
              state[i] = '竞拍结束'
            } else if (price2[j] > price1[i]) {
              this.proName.push(gName[i])
              state[i] = '我要加价'
              this.mask = true
              break
            }
          }
        }
      }
      // 将state数组中的值赋回给list中对应的state字段
      for (let i = 0; i < state.length; i++) {
        this.list[i].state = state[i]
      }
    },
    // 获取当前时间，格式YYYY-MM-DD
    getNowFormatDate () {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    compareDate (s1, s2) {
      console.log('---', ((new Date(s1.replace(/-/g, ' '))) > (new Date(s2.replace(/-/g, ' ')))))
      return ((new Date(s1.replace(/-/g, ' '))) > (new Date(s2.replace(/-/g, ' '))))
    },
    cancel () {
      this.mask = false
    },
    close () {
      this.masks = false
    },
    plus (gid, state) {
      if (state !== '我要加价') {
        return false
      }
      this.masks = true
      this.temp = gid
      axios.get('http://localhost:8088/getPrice?gid=' + gid).then(this.getSucc).catch(err => console.log(err))
    },
    getSucc (res) {
      this.current = res.data
    },
    ensure () {
      if (this.newPrice <= this.current) {
        return 0
      }
      if (!this.newPrice) {
        return 0
      }
      let params = {
        gid: this.temp,
        price: this.newPrice
      }
      axios.post('http://localhost:8088/updateAddPrice', params).then(this.ensureSucc).catch(this.ensureFail)
    },
    ensureSucc (res) {
      console.log(res.data)
      let params = {
        gid: this.temp,
        uid: this.uid,
        price: this.newPrice
      }
      axios.post('http://localhost:8088/updateMessage', params).then(this.updateSucc).catch(this.updateFail)
    },
    ensureFail (err) {
      console.log(err)
    },
    updateSucc (res) {
      console.log(res.data)
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].gid === this.temp) {
          this.list[i].price = this.newPrice
          this.list[i].state = '竞拍中'
        }
      }
      this.newPrice = ''
      this.masks = false
    },
    updateFail (err) {
      console.log(err)
    },
    dateFrm (el) {
      return moment(el).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
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
  .al-auction{
    width: 100%;
    height: 800px;
    background-color: cornflowerblue;
    display: flex;
    /*position: relative;*/
    justify-content: space-between;
  }
  .ad-left{
    width: 20%;
    height: 100%;
    background-color: #f7f7f7;
  }
  .ad-right{
    width: 15%;
    height: 100%;
    background-color: #fff;
    /*position: absolute;*/
    /*right: 0;*/
  }
  .au-detail{
    width: 65%;
    height: 100%;
    background-color: #fff;
  }
  .title{
    background-color: #f7f7f7;
    width: 100%;
    margin: 20px 0 12px 0;
    padding: 20px 0;
  }
  .title span{
    margin: 0 50px;
  }
  .pro{
    width: 150px;
    height: 150px;
  }
  .content{
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
  }
  .content:last-child{
    margin-bottom: 50px;
  }
  .content span{
    margin: 0 38px;
  }
  .mask{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
  }
  .mask-content{
    width: 400px;
    /*height: 200px;*/
    background-color: #fff;
    margin: 300px auto;
    border-radius: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .mask-content p{
    padding: 30px 30px 5px 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-wrap: wrap;
  }
  .mask-content button{
    width: 120px;
    height: 50px;
    margin: 30px auto;
    border: none;
    color: #fff;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .add{
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    width: 350px;
    background-color: #fff;
    margin: 300px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tag{
    padding: 30px 0;
  }
  .tag input{
    border: none;
    outline: none;
    border-bottom: 1px solid #e3e3e3;
    width: 100px;
    font-size: 18px;
  }
  .sure{
    padding: 5px 40px;
    border-radius: 50px;
    margin-bottom: 20px;
    background-color: dodgerblue;
    color: #fff;
    cursor: pointer;
  }
  .state{
    color: #333;
  }
  .state-active{
    color: red;
    cursor: pointer;
  }
</style>
