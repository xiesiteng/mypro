<template>
  <div class="main">
    <!--顶部-->
    <div class="header">
      <div class="welcome">
        <img src="../assets/pageLogo.png" alt="">
        <span>欢迎登录</span>
      </div>
    </div>
    <!--登录-->
    <div class="beiJ">
      <img src="../assets/login.png" alt="">
      <!--登录框-->
      <div class="frame">
        <div class="name">
          <span>用户名：</span>
          <input type="text" v-model="username">
        </div>
        <div class="password">
          <span>&nbsp;密&nbsp;&nbsp;码：</span>
          <input type="password" v-model="password">
        </div>
        <div class="forget" @click="toChange">忘记密码？</div>
        <div class="button">
          <button @click="Login">登录</button>
          <button @click="toRigester">注册</button>
        </div>
        <!--提示框-->
        <div class="ins">{{this.msg}}</div>
      </div>
    </div>
    <!--底部-->
    <!--<div class="footer"></div>-->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      msg: ''
    }
  },
  methods: {
    Login () {
      // var params = {
      //   username: this.username,
      //   password: this.password
      // }
      axios.get('http://localhost:8088/login?username=' + this.username + '&password=' + this.password).then(this.LoginSucc).catch(this.LoginFail)
    },
    LoginSucc (res) {
      console.log(res)
      if (res.data.r === 'ok') {
        if (this.username === 'admin') {
          this.$router.push('./manage')
        } else {
          let uid = res.data.uid
          this.$router.push({path: './index', query: {username: this.username, uid: uid}})
        }
      } else {
        this.msg = res.data.r
      }
    },
    LoginFail (err) {
      console.log(err)
    },
    toRigester () {
      this.$router.push('./rigester')
    },
    toChange () {
      this.$router.push('./forget')
    }
  }
}
</script>

<style scoped>
  input{
    outline: none;
  }
  .header{
    width: 100%;
    height: 100px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
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
    color: #6A2C19;
  }
  .welcome img{
    height: 90px;
  }
  .footer{
    width: 100%;
    height: 100px;
    background-color: #ccc;
  }
  .beiJ{
    width: 100%;
    height: 843px;
    position: relative;
  }
  .beiJ img{
    width: 100%;
    height: 100%;
    background-position: center center;
  }
  .frame{
    position: absolute;
    top: 150px;
    right: 150px;
    width: 300px;
    height: 330px;
    background-color: rgba(0,0,0,.4);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .name{
    margin-top: 80px;
  }
  .name span{
    color: #fff;
  }
  .password{
    margin: 30px 0;
  }
  .password span{
    color: #fff;
  }
  .forget{
    color: #fff;
    margin-left: 150px;
  }
  .forget:hover{
    color: #EE772B;
    cursor: pointer;
  }
  .button button{
    margin: 40px 30px;
    width: 60px;
    height: 25px;
    line-height: 20px;
    border: none;
    border-radius: 5px;
    color: #fff;
    background-color: #EE772B;
  }
  .ins{
    position: absolute;
    left: 98px;
    bottom: 150px;
    color: red;
    font-size: 14px;
  }
</style>
