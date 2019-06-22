<template>
  <div class="main">
    <div class="header">
      <div class="welcome">
        <img src="../assets/cZ.jpg" alt="">
        <span>修改密码</span>
      </div>
      <div class="login">
        <!--<p>已有账号?</p>-->
        <a href="http://localhost:8080/#/login">去登录 ></a>
      </div>
    </div>
    <!--间隔空隙-->
    <div class="space"></div>
    <!--注册-->
    <div class="rigester">
      <div class="username">
        <span>用户名</span>
        <input type="text" v-model="username">
      </div>
      <div class="password">
        <span>旧密码</span>
        <input type="password" v-model="password">
      </div>
      <div class="password">
        <span>新密码</span>
        <input type="password" v-model="newPassword">
      </div>
      <button class="submit" @click="submit">确认</button>
      <!--提示框-->
      <div class="ins">{{msg}}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Forget',
  data () {
    return {
      username: '',
      password: '',
      newPassword: '',
      msg: ''
    }
  },
  methods: {
    submit () {
      if (this.newPassword === this.password) {
        this.msg = '新密码与旧密码重复'
        return 0
      }
      axios.get('http://localhost:8088/changePassword?username=' + this.username + '&password=' + this.newPassword).then(this.submitSucc).catch(this.submitFail)
    },
    submitSucc (res) {
      console.log(res.data)
      alert('密码修改成功!')
      this.$router.push('/login')
    },
    submitFail (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped>
  input{
    width: 200px;
    height: 30px;
    outline: none;
    font-size: 18px;
  }
  .main{
    position: relative;
  }
  .header{
    width: 100%;
    height: 100px;
    background-color: #fff;
    display: flex;
    align-items: center;
    position: relative;
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
    color: #E1B21A;
  }
  .welcome img{
    height: 90px;
  }
  .login{
    display: flex;
    align-items: center;
    position: absolute;
    right: 50px;
    color: #666;
  }
  .login a{
    color: darkred;
    text-decoration: none;
  }
  .login a:hover{
    color: red;
  }
  .space{
    height: 10px;
    background-color: #F6F6F6;
  }
  .rigester{
    margin: 100px auto;
    width: 500px;
    height: 400px;
    background-color: #f7f9fe;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .username{
    margin-top: 20px;
    display: flex;
    align-items: center;
    padding: 30px;
    font-size: 20px;
  }
  .username span{
    margin-right: 20px;
  }
  .password{
    display: flex;
    align-items: center;
    padding: 30px;
    font-size: 20px;
  }
  .password span{
    margin-right: 20px;
  }
  .submit{
    margin: 0 auto;
    width: 300px;
    height: 40px;
    background-color: #E2231A;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-top: 20px;
    border: none;
  }
  .ins{
    position: absolute;
    left: 190px;
    bottom: 90px;
    color: red;
  }
</style>
